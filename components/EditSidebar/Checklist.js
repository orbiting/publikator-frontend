import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { Checkbox } from '@project-r/styleguide'
import { swissTime } from '../../lib/utils/format'
import { gql, graphql } from 'react-apollo'
import { compose } from 'redux'
import Loader from '../Loader'
import withT from '../../lib/withT'
import { ascending } from 'd3-array'

const timeFormat = swissTime.format('%d. %B %Y, %H:%M Uhr')

const cleanName = string => (
  string.split('@')[0]
    .replace(/\s*\.\s*/, ' ')
    .split(' ')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ')
)

const styles = {
  approvedBy: css({
    clear: 'left',
    display: 'block',
    fontSize: '11px',
    lineHeight: '1.3em'
  })
}

const milestoneNames = [
  'cvd1', 'ad', 'korrektur', 'cvd2'
]

class Checklist extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mutating: {}
    }
  }

  render () {
    const {
      loading, error,
      milestones, t,
      placeMilestone, removeMilestone,
      disabled
    } = this.props
    const {
      mutating
    } = this.state
    return (
      <Loader loading={loading} error={error} render={() => {
        const allMilestones = milestones
          .concat(
            milestoneNames
              .filter(name =>
                !milestones.find(m => m.name === name)
              )
              .map(name => ({
                name
              }))
          )
          .sort((a, b) => ascending(
            milestoneNames.indexOf(a.name),
            milestoneNames.indexOf(b.name)
          ))
        return (
          <div>
            {allMilestones.map(({name, author, commit}) =>
              <p key={name}>
                <Checkbox
                  checked={!!author}
                  disabled={disabled || mutating[name]}
                  onChange={(_, checked) => {
                    this.setState(state => ({
                      mutating: {
                        ...state.mutating,
                        [name]: true
                      }
                    }))
                    const finish = () => {
                      this.setState(state => ({
                        mutating: {
                          ...state.mutating,
                          [name]: false
                        }
                      }))
                    }
                    checked
                      ? placeMilestone({
                        name,
                        message: 'Check'
                      }).then(finish)
                      : removeMilestone({
                        name
                      }).then(finish)
                  }}
                >
                  {t(`checklist/labels/${name}`, undefined, name)}
                  {!!author && <span {...styles.approvedBy}>
                    {cleanName(author.name)}
                  </span>}
                  {!!commit && <span {...styles.approvedBy}>
                    {timeFormat(
                      new Date(commit.date)
                    )}
                    {' '}
                    {(
                      author.name !== commit.author.name &&
                      cleanName(commit.author.name)
                    )}
                  </span>}
                </Checkbox>
              </p>
            )}
          </div>
        )
      }} />
    )
  }
}

Checklist.propTypes = {
  repoId: PropTypes.string.isRequired,
  commitId: PropTypes.string.isRequired
}

const query = gql`
query repo($repoId: ID!) {
  repo(id: $repoId) {
    id
    milestones {
      name
      message
      commit {
        id
        date
        author {
          name
        }
      }
      author {
        name
      }
    }
  }
}
`

const placeMilestone = gql`
mutation placeMilestone(
  $repoId: ID!
  $commitId: ID!
  $name: String!
  $message: String!
) {
  placeMilestone(repoId: $repoId, commitId: $commitId, name: $name, message: $message) {
    name
    message
    commit {
      id
      date
      author {
        name
      }
    }
    author {
      name
    }
  }
}
`
const removeMilestone = gql`
mutation removeMilestone(
  $repoId: ID!
  $name: String!
) {
  removeMilestone(repoId: $repoId, name: $name)
}
`

export default compose(
  withT,
  graphql(query, {
    props: ({data, ownProps: {name}}) => ({
      loading: data.loading,
      error: data.error,
      milestones: data.repo && data.repo.milestones
    })
  }),
  graphql(placeMilestone, {
    props: ({ mutate, ownProps: {repoId, commitId} }) => ({
      placeMilestone: ({name, message}) =>
        mutate({
          variables: {
            repoId,
            commitId,
            name,
            message
          },
          update: (proxy, { data: { placeMilestone } }) => {
            const variables = {
              repoId
            }
            const data = proxy.readQuery({
              query,
              variables
            })
            data.repo.milestones.push(placeMilestone)
            proxy.writeQuery({
              query: query,
              variables,
              data
            })
          }
        })
    })
  }),
  graphql(removeMilestone, {
    props: ({ mutate, ownProps: {repoId} }) => ({
      removeMilestone: ({name, message}) =>
        mutate({
          variables: {
            repoId: repoId,
            name
          },
          update: (proxy, { data: { removeMilestone } }) => {
            const variables = {
              repoId
            }
            const data = proxy.readQuery({
              query,
              variables
            })
            if (removeMilestone) {
              data.repo.milestones = data.repo.milestones
                .filter(milestone => milestone.name !== name)
            }
            proxy.writeQuery({
              query: query,
              variables,
              data
            })
          },
          refetchQueries: [{
            query,
            variables: {
              repoId
            }
          }]
        })
    })
  })
)(Checklist)
