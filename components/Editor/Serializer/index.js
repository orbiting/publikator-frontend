import createDocumentModule from './document'
import createDocumentPlainModule from './document/plain'
import createCoverModule from './cover'
import createCenterModule from './center'
import createHeadlineModule from './headline'
import createParagraphModule from './paragraph'
import createBlockTextModule from './blocktext'
import createLinkModule from './link'
import createMarkModule from './mark'
import createListModule from './list'
import createListItemModule from './list/item'
import createFigureModule from './figure'
import createFigureImageModule from './figure/image'
import createFigureCaptionModule from './figure/caption'
import createFigureGroupModule from './figuregroup'
import createFrontModule from './front'
import createTeaserModule from './teaser'
import createTeaserGroupModule from './teasergroup'
import {
  createEmbedVideoModule,
  createEmbedTwitterModule
} from './embed'
import createBlockQuoteModule from './blockquote'
import createLogbookModule from './logbook'
import createSpecialModule from './special'
import createTitleModule from './title'
import createInfoBoxModule from './infobox'
import createQuoteModule from './quote'
import createHtmlModule from './html'
import createLineModule from './line'
import createFrontDossier from './dossier/front'
import createDossierIntro from './dossier/intro'
import createArticleCollection from './article/collection'
import createArticleGroup from './article/group'
import createChartModule from './chart'
import createChartCanvasModule from './chart/canvas'
import createDynamicComponentModule from './dynamiccomponent'

const moduleCreators = {
  embedVideo: createEmbedVideoModule,
  embedTwitter: createEmbedTwitterModule,
  document: createDocumentModule,
  documentPlain: createDocumentPlainModule,
  cover: createCoverModule,
  center: createCenterModule,
  headline: createHeadlineModule,
  paragraph: createParagraphModule,
  link: createLinkModule,
  mark: createMarkModule,
  // for @project-r/template-newsletter compat
  // - change when updating project r
  blockquote: createBlockQuoteModule,
  blocktext: createBlockTextModule,
  list: createListModule,
  listItem: createListItemModule,
  figure: createFigureModule,
  figureImage: createFigureImageModule,
  figureCaption: createFigureCaptionModule,
  figuregroup: createFigureGroupModule,
  special: createSpecialModule,
  logbook: createLogbookModule,
  meta: () => ({}),
  specialchars: () => ({}),
  title: createTitleModule,
  infobox: createInfoBoxModule,
  quote: createQuoteModule,
  front: createFrontModule,
  teaser: createTeaserModule,
  teasergroup: createTeaserGroupModule,
  html: createHtmlModule,
  line: createLineModule,
  articleGroup: createArticleGroup,
  frontDossier: createFrontDossier,
  dossierIntro: createDossierIntro,
  articleCollection: createArticleCollection,
  chart: createChartModule,
  chartCanvas: createChartCanvasModule,
  dynamiccomponent: createDynamicComponentModule
}
const initModule = (rule, context = {}) => {
  const { editorModule, editorOptions = {} } = rule
  if (editorModule) {
    const create = moduleCreators[editorModule]
    if (!create) {
      throw new Error(`Missing editorModule ${editorModule}`)
    }
    const TYPE = (editorOptions.type || editorModule).toUpperCase()
    const subModules = (rule.rules || [])
      .map(r => initModule(r, context))
      .filter(Boolean)
    const module = create({
      TYPE,
      rule,
      subModules: subModules,
      context
    })

    module.TYPE = TYPE
    module.name = editorModule
    module.subModules = subModules

    return module
  }
}

export const getSerializer = schema => {
  const rootRule = schema.rules[0]
  const rootModule = initModule(rootRule, {
    mdastSchema: schema
  })

  return {
    serializer: rootModule.helpers.serializer,
    newDocument: rootModule.helpers.newDocument
  }
}
