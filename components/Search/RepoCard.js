import { Fragment } from 'react'
import { path } from 'ramda'
import { Link } from '../../lib/routes'
import { swissTime } from '../../lib/utils/format'
import {
  colors,
  linkRule,
  Label,
  InlineSpinner
} from '@project-r/styleguide'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import styles from './styles'

const dateTimeFormat = '%d.%m.%Y'
const formatDateTime = swissTime.format(dateTimeFormat)

export const displayDateTime = string =>
  string && formatDateTime(new Date(string))

export const getRepoId = str => {
  const match = /github.com\/([A-Za-z-_]+\/[A-Za-z-_]+)/.exec(str)
  return (match && match[1].trim()) || null
}

const GET_REPO = gql`
  query getRepo($repoId: ID!) {
    repo(id: $repoId) {
      latestCommit {
        document {
          meta {
            title
            publishDate
            credits
          }
          content
        }
      }
    }
  }
`

const documentMeta = path([
  'repo',
  'latestCommit',
  'document',
  'meta'
])
const contentMeta = path([
  'repo',
  'latestCommit',
  'document',
  'content',
  'meta'
])

const getMetaFromData = data => {
  if (!documentMeta(data) && !contentMeta(data)) {
    return null
  }
  return {
    ...(documentMeta(data) || {}),
    ...(contentMeta(data) || {})
  }
}

export default ({ label, value, ...props }) => {
  const repoId = getRepoId(value)
  return (
    <div {...props}>
      <div>
        <Label>{label}</Label>
      </div>
      <div>
        <Query
          query={GET_REPO}
          skip={!value || !repoId}
          variables={{ repoId }}
        >
          {({ loading, data, error }) => {
            const isLoading = loading && repoId

            if (error) {
              return (
                <Label style={{ color: colors.error }}>
                  {!console.error(error.toString()) &&
                    'Hoppla. Da ging was schief'}
                </Label>
              )
            }
            const meta = getMetaFromData(data)
            const { title, publishDate } = meta || {}

            return (
              <div {...styles.card}>
                {isLoading && (
                  <span {...styles.cardLoading}>
                    <InlineSpinner size={35} />
                  </span>
                )}
                {!isLoading && (
                  <Fragment>
                    <div {...styles.cardTitle}>
                      {title || (
                        <span {...styles.cardSelect}>Auswählen</span>
                      )}
                    </div>
                    {repoId && (
                      <Fragment>
                        <div {...styles.cardActions}>
                          <Label>
                            <Link
                              route='repo/tree'
                              params={{ repoId: repoId.split('/') }}
                            >
                              <a
                                {...linkRule}
                                target='_blank'
                                onClick={e => e.stopPropagation()}
                              >
                                Versionen
                              </a>
                            </Link>
                          </Label>
                        </div>
                        <div {...styles.cardInfo}>
                          <Label>
                            Publikation<br />
                            {displayDateTime(publishDate) || '-'}
                          </Label>
                        </div>
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </div>
            )
          }}
        </Query>
      </div>
    </div>
  )
}
