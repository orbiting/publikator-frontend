import React, { Component, useState, useMemo } from 'react'
import { Router } from '../../lib/routes'
import slugify from '../../lib/utils/slug'
import schemas from '../Templates'
import { css } from 'glamor'
import withT from '../../lib/withT'

import {
  Interaction,
  Field,
  Button,
  Dropdown,
  Autocomplete,
  mediaQueries,
  colors,
  Loader
} from '@project-r/styleguide'

import { GITHUB_ORG, TEMPLATES, REPO_PREFIX } from '../../lib/settings'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'next/router'
import SearchIcon from 'react-icons/lib/md/search'

const getTemplateRepos = gql`
  query templateListSearch {
    reposSearch(isTemplate: true) {
      totalCount
      nodes {
        id
        latestCommit {
          id
          document {
            id
            meta {
              title
              slug
              template
            }
          }
        }
      }
    }
  }
`

let schemaKeys = Object.keys(schemas)
if (TEMPLATES) {
  const allowedSchemas = TEMPLATES.split(',')
  schemaKeys = schemaKeys.filter(key => allowedSchemas.indexOf(key) !== -1)
}

const styles = {
  new: css({
    maxWidth: 600,
    paddingBottom: 60
  }),
  form: css({
    display: 'flex',
    justifyContent: 'space-between',
    flexFlow: 'row wrap',
    margin: '0 auto'
  }),
  select: css({
    width: '100%',
    marginTop: 10
  }),
  input: css({
    width: '100%',
    [mediaQueries.mUp]: {
      marginRight: 10,
      marginBottom: 0,
      width: '58%'
    }
  }),
  button: css({
    width: '100%',
    [mediaQueries.mUp]: {
      width: '38%',
      minWidth: 160
    }
  })
}

const TemplatePicker = compose(
  withT,
  withRouter,
  graphql(getTemplateRepos, {
    options: () => ({
      fetchPolicy: 'network-only'
    }),
    skip: ({ isTemplate }) => isTemplate
  })
)(({ t, data, schema, onChange, isTemplate }) => {
  const [schemaOptions] = useState(
    schemaKeys.map(key => ({
      value: key,
      text: t(`repo/add/template/${key}`, null, key)
    }))
  )
  const [templateFilter, setTemplateFilter] = useState('')
  const [template, setTemplate] = useState({
    value: schema,
    text: t(`repo/add/template/${schema}`, null, schema)
  })

  const templateOptions = useMemo(() => {
    return schemaOptions
      .concat(
        (data?.reposSearch?.nodes || []).map(repo => ({
          value: repo.latestCommit.document.meta.template,
          text:
            repo.latestCommit.document.meta.title ||
            repo.id.split('/')[1].replace('-', ' '),
          repoId: repo.id,
          slug: repo.latestCommit.document.meta.slug || repo.id.split('/')[1]
        }))
      )
      .filter(
        ({ text }) =>
          !templateFilter ||
          text.toLowerCase().includes(templateFilter.toLowerCase())
      )
  }, [data, templateFilter])

  return isTemplate ? (
    <Dropdown
      label='Vorlage'
      items={schemaOptions}
      value={schema}
      onChange={item => {
        onChange({
          schema: item.value,
          templateRepoId: undefined,
          templatePrefix: undefined
        })
      }}
    />
  ) : (
    <Loader
      error={data.error}
      loading={data.loading}
      render={() => (
        <Autocomplete
          label='Vorlage'
          value={template}
          filter={templateFilter}
          items={templateOptions}
          onChange={newTemplate => {
            setTemplate(newTemplate)
            setTemplateFilter('')
            onChange({
              schema: newTemplate.value,
              templateRepoId: newTemplate.repoId,
              templatePrefix: newTemplate.slug.replace('template-', '') + '-'
            })
          }}
          onFilterChange={newFilter => {
            if (!template || template.text !== newFilter) {
              setTemplateFilter(newFilter)
            }
          }}
          icon={<SearchIcon size={30} style={{ color: colors.lightText }} />}
        />
      )}
    />
  )
})

class RepoAdd extends Component {
  constructor(props) {
    super(props)
    const schema = schemaKeys.includes('article') ? 'article' : schemaKeys[0]
    this.state = {
      schema,
      title: ''
    }
  }
  getSlug() {
    const { title, schema, templatePrefix } = this.state
    const { isTemplate } = this.props
    const prefix = (isTemplate
      ? [REPO_PREFIX, 'template-']
      : [REPO_PREFIX, templatePrefix || schemas[schema]?.repoPrefix]
    )
      .filter(Boolean)
      .join('')
    return [prefix, slugify(title)].join('')
  }

  goToEdit({ slug }) {
    const { title, schema, templateRepoId } = this.state
    const { isTemplate } = this.props
    Router.replaceRoute('repo/edit', {
      repoId: [GITHUB_ORG, slug],
      commitId: 'new',
      title,
      schema,
      templateRepoId,
      isTemplate
    }).then(() => {
      window.scrollTo(0, 0)
    })
  }

  onSubmit(event) {
    event.preventDefault()

    const { title, error } = this.state
    const { isTemplate } = this.props
    const slug = this.getSlug()
    const maxSlugLength = isTemplate ? 30 : 100
    if (error || !title || slug.length > maxSlugLength) {
      this.handleTitle(title, true, maxSlugLength)
      return
    }
    this.goToEdit({ slug })
  }

  handleTitle(value, shouldValidate, maxSlugLength = 100) {
    const { t } = this.props

    const slug = this.getSlug(value)
    this.setState({
      slug,
      title: value,
      dirty: shouldValidate,
      error:
        (value.trim().length <= 0 && t('repo/add/titleField/error')) ||
        (slug.length > maxSlugLength && t('repo/add/titleField/error/tooLong'))
    })
  }
  render() {
    const { t, isTemplate } = this.props
    const { title, schema, dirty, error } = this.state

    return (
      <div {...styles.new}>
        <Interaction.H2>
          {t(`repo/add${isTemplate ? '/template/' : '/'}title`)}
        </Interaction.H2>
        <form
          {...styles.form}
          onSubmit={e => this.onSubmit(e)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              this.onSubmit(e)
            }
          }}
        >
          <div {...styles.select}>
            <TemplatePicker
              isTemplate={isTemplate}
              schema={schema}
              onChange={this.setState.bind(this)}
            />
          </div>
          <div {...styles.input}>
            <Field
              label={t('repo/add/titleField/label')}
              value={title}
              onChange={(_, value, shouldValidate) => {
                this.handleTitle(value, shouldValidate)
              }}
              error={dirty && error}
            />
          </div>
          <div {...styles.button}>
            <Button type='submit' block>
              {t('repo/add/submit')}
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

export default compose(withT, withRouter)(RepoAdd)
