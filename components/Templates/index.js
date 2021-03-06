import React from 'react'
import newsletterSchema from '@project-r/template-newsletter'
import editorialNewsletterSchema from '@project-r/styleguide/lib/templates/EditorialNewsletter/web'
import neutrumSchema from './Neutrum'

import createArticleSchema from '@project-r/styleguide/lib/templates/Article'
import createPageSchema from '@project-r/styleguide/lib/templates/Page'
import createFrontSchema from '@project-r/styleguide/lib/templates/Front'
import createFormatSchema from '@project-r/styleguide/lib/templates/Format'
import createSectionSchema from '@project-r/styleguide/lib/templates/Section'
import createDiscussionSchema from '@project-r/styleguide/lib/templates/Discussion'
import createDossierSchema from '@project-r/styleguide/lib/templates/Dossier'

import { t } from '../../lib/withT'

import dynamicComponentRequire from '../editor/modules/dynamiccomponent/require'
import dynamicComponentIdentifiers from '../editor/modules/dynamiccomponent/identifiers'
import * as withArticleData from './withArticleData'
import * as withFrontData from './withFrontData'

const NoOpLink = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    onClick: e => {
      e.preventDefault()
    }
  })

const schemas = {
  // first is default schema for the editor
  // - for Project R this should be the newsletter
  newsletter: newsletterSchema,
  editorialNewsletter: editorialNewsletterSchema(),
  neutrum: neutrumSchema,
  article: createArticleSchema({
    t,
    dynamicComponentRequire,
    dynamicComponentIdentifiers,
    ...withArticleData
  }),
  front: createFrontSchema({
    Link: NoOpLink,
    CommentLink: NoOpLink,
    DiscussionLink: NoOpLink,
    t,
    ...withFrontData
  }),
  format: createFormatSchema({
    t,
    dynamicComponentRequire,
    dynamicComponentIdentifiers
  }),
  section: createSectionSchema({
    t,
    dynamicComponentRequire,
    dynamicComponentIdentifiers
  }),
  discussion: createDiscussionSchema({
    t,
    dynamicComponentRequire,
    dynamicComponentIdentifiers
  }),
  dossier: createDossierSchema({
    t,
    dynamicComponentRequire,
    dynamicComponentIdentifiers
  }),
  page: createPageSchema({
    t,
    dynamicComponentRequire,
    dynamicComponentIdentifiers
  })
}

export const getSchema = template => {
  const key = template || Object.keys(schemas)[0]
  const schema = schemas[key] || (key === 'editorial' && schemas.article)

  if (!schema) {
    throw new Error(`Unkown Schema ${key}`)
  }
  return schema
}

export default schemas
