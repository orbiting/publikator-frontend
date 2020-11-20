import React, { Component } from 'react'
import { css } from 'glamor'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { descending, ascending } from 'd3-array'
import debounce from 'lodash.debounce'

import withT from '../../lib/withT'
import { Link, Router } from '../../lib/routes'
import { intersperse } from '../../lib/utils/helpers'
import { swissTime } from '../../lib/utils/format'

import GithubIcon from 'react-icons/lib/fa/github'
import LockIcon from 'react-icons/lib/md/lock'
import PublicIcon from 'react-icons/lib/md/public'

import { linkRule, A, Label, colors, Field } from '@project-r/styleguide'

import { Table, Tr, Th, ThOrder, Td, TdNum } from '../Table'

import Loader from '../Loader'

import { GITHUB_ORG, REPO_PREFIX, FRONTEND_BASE_URL } from '../../lib/settings'

import { matchType } from 'mdast-react-render/lib/utils'

import { renderMdast } from 'mdast-react-render'

import EditMetaDate from './EditMetaDate'
import { phases } from './workflow'
import RepoAdd from './Add'
import { withRouter } from 'next/router'

export const editRepoMeta = gql`
  mutation editRepoMeta($repoId: ID!, $publishDate: DateTime) {
    editRepoMeta(repoId: $repoId, publishDate: $publishDate) {
      id
      meta {
        publishDate
      }
    }
  }
`

export const filterAndOrderRepos = gql`
  query repoListSearch(
    $after: String
    $search: String
    $phases: [RepoPhase!]
    $orderBy: RepoOrderBy
    $isTemplate: Boolean
  ) {
    repos: reposSearch(
      first: 50
      after: $after
      search: $search
      phases: $phases
      orderBy: $orderBy
      isTemplate: $isTemplate
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        meta {
          publishDate
        }
        latestCommit {
          id
          date
          message
          author {
            name
          }
          document {
            id
            meta {
              template
              title
              credits
              series {
                title
              }
              section {
                id
                meta {
                  title
                }
              }
              format {
                id
                meta {
                  title
                }
              }
              dossier {
                id
                meta {
                  title
                }
              }
            }
          }
        }
        milestones {
          name
          immutable
        }
        latestPublications {
          name
          prepublication
          live
          scheduledAt
          document {
            id
            meta {
              path
              slug
            }
          }
        }
        currentPhase
      }
    }
  }
`

const dateTimeFormat = '%d.%m %H:%M'
const formatDateTime = swissTime.format(dateTimeFormat)

export const displayDateTime = string =>
  string && formatDateTime(new Date(string))

const link = {
  matchMdast: matchType('link'),
  props: node => ({
    title: node.title,
    href: node.url
  }),
  component: A
}
const creditSchema = {
  rules: [link]
}

const styles = {
  container: css({
    padding: 20,
    paddingBottom: 80
  }),
  filterBar: css({
    paddingBottom: 15,
    borderBottom: `1px solid ${colors.divider}`
  }),
  phase: css({
    color: '#fff',
    borderRadius: 3,
    padding: '3px 6px',
    marginRight: 6,
    display: 'inline-block'
  }),
  pageInfo: css({
    marginTop: 10,
    textAlign: 'right'
  })
}

const orderFields = [
  {
    field: 'pushed',
    width: '28%',
    accessor: repo => new Date(repo.latestCommit.date)
  },
  {
    field: 'published',
    width: '10%',
    accessor: repo => new Date(repo.meta.publishDate)
  }
]

const Phase = ({ phase, onClick, disabled, t }) => {
  const { color } = phases.find(p => p.key === phase)

  return (
    <div
      {...styles.phase}
      style={{
        backgroundColor: disabled ? 'gray' : color,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {t(`repo/phase/${phase}`, undefined, phase)}
    </div>
  )
}

const PageInfo = withT(({ t, repos, loading, fetchMore }) => {
  return repos ? (
    <div {...styles.pageInfo}>
      <Label>
        {repos.nodes.length === repos.totalCount
          ? t('repo/table/pageInfo/total', {
              count: repos.totalCount
            })
          : t('repo/table/pageInfo/loadedTotal', {
              loaded: repos.nodes.length,
              total: repos.totalCount
            })}
        <br />
        {!loading && repos.pageInfo.hasNextPage && (
          <a
            {...linkRule}
            href='#'
            onClick={e => {
              e.preventDefault()
              fetchMore({ after: repos.pageInfo.endCursor })
            }}
          >
            {t('repo/table/pageInfo/loadMore')}
          </a>
        )}
      </Label>
    </div>
  ) : null
})

const SEARCH_MIN_LENGTH = 3

class RepoList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: this.props.search
    }

    this.debouncedRouting = debounce(params => {
      Router.replaceRoute('index', params)
    }, 500)
  }

  componentWillUnmount() {
    if (this.debouncedRouting && this.debouncedRouting.cancel) {
      this.debouncedRouting.cancel()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.router.query.templates !== this.props.router.query.templates
    ) {
      this.setState({
        search: undefined
      })
    }
  }

  render() {
    const {
      t,
      data = {},
      orderField,
      orderDirection,
      phase: filterPhase,
      editRepoMeta,
      fetchMore,
      router: { query }
    } = this.props

    const { templates } = query

    const { search } = this.state

    const getParams = ({
      field = orderField,
      phase = filterPhase,
      q = search,
      order = false
    }) => {
      const params = {
        orderBy: [
          field,
          orderField === field && order
            ? orderDirection === 'DESC'
              ? 'ASC'
              : 'DESC'
            : orderDirection
        ].join('-')
      }
      if (phase) {
        params.phase = phase
      }
      if (q) {
        params.q = q
      }

      return params
    }

    const onChangeSearch = (_, value) => {
      if (this.debouncedRouting && this.debouncedRouting.cancel) {
        this.debouncedRouting.cancel()
      }

      this.setState(
        { search: value },
        this.debouncedRouting.bind(this, {
          templates,
          ...getParams({ q: value })
        })
      )
    }

    const orderCompare = orderDirection === 'DESC' ? descending : ascending

    const activeOrderField = orderFields.find(
      order => order.field === orderField
    )

    const activeFilterPhase = phases.find(phase => phase.key === filterPhase)

    const orderAccessor = activeOrderField
      ? activeOrderField.accessor
      : orderFields[0].accessor

    return (
      <div {...styles.container}>
        <RepoAdd isTemplate={templates} />

        <Field
          label={t('repo/search/field/label')}
          value={search}
          error={
            search &&
            search.length < SEARCH_MIN_LENGTH &&
            t('repo/search/field/minLength', { count: SEARCH_MIN_LENGTH })
          }
          onChange={onChangeSearch}
        />

        {!templates && (
          <div {...styles.filterBar}>
            {phases.map(phase => {
              const active =
                activeFilterPhase && activeFilterPhase.key === phase.key
              return (
                <Link
                  key={phase.key}
                  route='index'
                  replace
                  scroll={false}
                  params={getParams({ phase: active ? null : phase.key })}
                >
                  <Phase
                    t={t}
                    phase={phase.key}
                    disabled={activeFilterPhase && !active}
                  />
                </Link>
              )
            })}
          </div>
        )}

        <Table style={{ marginTop: templates && -15 }}>
          <thead>
            <Tr>
              <Th style={{ width: '28%' }}>{t('repo/table/col/title')}</Th>
              <Th style={{ width: '20%' }}>{t('repo/table/col/credits')}</Th>
              {orderFields.map(({ field, width }) => (
                <ThOrder
                  key={field}
                  route='index'
                  params={getParams({ field, order: true })}
                  activeDirection={orderDirection}
                  activeField={orderField}
                  field={field}
                  style={{ width }}
                >
                  {t(`repo/table/col/${field}`, undefined, field)}
                </ThOrder>
              ))}
              <Th style={{ width: '10%' }}>
                {!templates ? t('repo/table/col/phase') : ''}
              </Th>

              <Th style={{ width: 70 }} />
            </Tr>
          </thead>
          <tbody>
            {!(data.loading || data.error) &&
              data.repos &&
              data.repos.nodes.length === 0 && (
                <Tr>
                  <Td colSpan='8'>{t('repo/search/noResults')}</Td>
                </Tr>
              )}
            {data.repos &&
              data.repos.nodes
                .map(repo => ({ repo }))
                .sort((a, b) =>
                  orderCompare(orderAccessor(a.repo), orderAccessor(b.repo))
                )
                .map(({ repo }) => {
                  const {
                    id,
                    meta: { publishDate },
                    latestCommit: {
                      date,
                      author: { name: authorName },
                      message,
                      document: { meta }
                    },
                    currentPhase
                  } = repo

                  const label =
                    (meta.series && meta.series.title) ||
                    (meta.section &&
                      meta.section.meta &&
                      meta.section.meta.title) ||
                    (meta.format &&
                      meta.format.meta &&
                      meta.format.meta.title) ||
                    (meta.dossier &&
                      meta.dossier.meta &&
                      meta.dossier.meta.title) ||
                    (meta.template !== 'article' &&
                      t(
                        `repo/add/template/${meta.template}`,
                        null,
                        meta.template
                      ))

                  return (
                    <Tr key={id}>
                      <Td>
                        {label && (
                          <>
                            <Label>{label}</Label>
                            <br />
                          </>
                        )}
                        <Link
                          route='repo/tree'
                          params={{ repoId: id.split('/') }}
                        >
                          <a {...linkRule} title={id}>
                            {meta.title ||
                              id.replace(
                                [GITHUB_ORG, REPO_PREFIX || ''].join('/'),
                                ''
                              )}
                          </a>
                        </Link>
                      </Td>
                      <Td>
                        {meta.credits &&
                          intersperse(
                            renderMdast(
                              meta.credits.filter(link.matchMdast),
                              creditSchema
                            ),
                            () => ', '
                          )}
                      </Td>
                      <TdNum>
                        {displayDateTime(date)}
                        <br />
                        <Label>
                          {authorName}: «{message}»
                        </Label>
                      </TdNum>
                      <TdNum>
                        <EditMetaDate
                          value={publishDate}
                          onChange={value =>
                            editRepoMeta({ repoId: id, publishDate: value })
                          }
                        />
                      </TdNum>
                      <Td>
                        {!templates && <Phase t={t} phase={currentPhase} />}
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {repo.latestPublications
                          .filter(
                            publication =>
                              publication.document && publication.prepublication
                          )
                          .map(
                            ({
                              name,
                              document: {
                                meta: { path, slug }
                              }
                            }) => (
                              <a
                                key={name}
                                href={`${FRONTEND_BASE_URL}${path ||
                                  '/' + slug}`}
                              >
                                <LockIcon color={colors.primary} />
                              </a>
                            )
                          )}{' '}
                        {repo.latestPublications
                          .filter(
                            publication =>
                              publication.document &&
                              !publication.prepublication &&
                              publication.live
                          )
                          .map(
                            ({
                              name,
                              document: {
                                meta: { path, slug }
                              }
                            }) => (
                              <a
                                key={name}
                                href={`${FRONTEND_BASE_URL}${path ||
                                  '/' + slug}`}
                              >
                                <PublicIcon color={colors.primary} />
                              </a>
                            )
                          )}{' '}
                        <a href={`https://github.com/${id}`}>
                          <GithubIcon color={colors.primary} />
                        </a>
                      </Td>
                    </Tr>
                  )
                })}
            {(data.loading || data.error) && (
              <tr>
                <td colSpan='8'>
                  <Loader loading={data.loading} error={data.error} />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <PageInfo
          repos={data.repos}
          loading={data.loading}
          fetchMore={fetchMore}
        />
      </div>
    )
  }
}

const RepoListWithQuery = compose(
  withT,
  withRouter,
  graphql(filterAndOrderRepos, {
    options: ({ search, router }) => ({
      fetchPolicy: 'cache-and-network',
      ssr: false,
      notifyOnNetworkStatusChange: true,
      variables: {
        search:
          search && search.length >= SEARCH_MIN_LENGTH ? search : undefined,
        orderBy: { field: 'PUSHED_AT', direction: 'DESC' },
        isTemplate: !!router.query.templates,
        ...(router.query?.phase && { phases: [router.query.phase] })
      }
    }),
    props: ({ data, ownProps }) => ({
      data,
      fetchMore: ({ after }) =>
        data.fetchMore({
          variables: {
            after,
            search: ownProps.search
          },
          updateQuery: (
            previousResult,
            { fetchMoreResult, queryVariables }
          ) => {
            const nodes = [
              ...previousResult.repos.nodes,
              ...fetchMoreResult.repos.nodes
            ].filter(
              ({ id }, i, all) =>
                // deduplicate by id
                i === all.findIndex(repo => repo.id === id)
            )
            return {
              ...previousResult,
              totalCount: fetchMoreResult.repos.pageInfo.hasNextPage
                ? fetchMoreResult.repos.totalCount
                : nodes.length,
              repos: {
                ...previousResult.repos,
                ...fetchMoreResult.repos,
                nodes
              }
            }
          }
        })
    })
  }),
  graphql(editRepoMeta, {
    props: ({ mutate }) => ({
      editRepoMeta: variables => mutate({ variables })
    })
  })
)(RepoList)

RepoListWithQuery.defaultProps = {
  orderField: orderFields[0].field,
  orderDirection: 'DESC'
}

export default RepoListWithQuery
