import slugify from '../../../lib/utils/slug'
import { isBlock } from '../base/lib'

import Link from '../plugins/link'
import FigureGroup from '../plugins/figureGroup'
import Figure from '../plugins/figure'
import FigureImage from '../plugins/figureImage'
import Cover from '../plugins/cover'
import Caption from '../plugins/caption'
import Bold from '../plugins/bold'
import List from '../plugins/list'
import Superscript from '../plugins/superscript'
import InfoBox from '../plugins/infoBox'
import Subscript from '../plugins/subscript'
import Italic from '../plugins/italic'
import Paragraph from '../plugins/paragraph'
import Subhead from '../plugins/subhead'
import TitleBlock from '../plugins/titleBlock'
import Center from '../plugins/center'

import Meta from '../plugins/meta'
import AutoMeta from '../plugins/autoMeta'
import UI from '../plugins/ui'

const contentPlugins = [
  Bold,
  Center,
  FigureGroup,
  InfoBox,
  TitleBlock,
  Cover,
  Figure,
  FigureImage,
  Caption,
  Paragraph,
  Subhead,
  List,
  Link,
  Superscript,
  Subscript,
  Italic
]

const documentAutoMeta = change => {
  const documentNode = change.value.document
  const data = documentNode.data
  const autoMeta = !data || !data.size || data.get('auto')
  if (!autoMeta) {
    return null
  }
  const cover = documentNode.nodes.find(isBlock('cover'))
  if (!cover) {
    return null
  }

  const title = cover.nodes.first()
  const lead = cover.nodes.get(1)

  const newData = data
    .set('auto', true)
    .set('feed', true)
    .set('title', title ? title.text : '')
    .set('slug', title ? slugify(title.text) : '')
    .set('description', lead ? lead.text : '')
    .set('image', cover.data.get('src'))

  return data.equals(newData) ? null : newData
}

const documentPlainAutoMeta = change => {
  const documentNode = change.value.document
  const data = documentNode.data
  const autoMeta =
    !data || !data.delete('template').size || data.get('auto')
  if (!autoMeta) {
    return null
  }

  let newData = data
    .set('auto', true)
    .set('feed', true)
    .set('gallery', true)

  const title = documentNode.nodes.find(isBlock('titleBlock'))
  if (title) {
    const headline = title.nodes.first()
    const headlineText = headline ? headline.text : ''
    const subject = title.nodes.get(1)
    const lead = title.nodes.get(2)

    newData = newData
      .set('title', headlineText)
      .set('subject', subject ? subject.text : '')
      .set('description', lead ? lead.text : '')
      .set('slug', slugify(headlineText))
  }

  return data.equals(newData) ? null : newData
}

const getAutoMeta = schema => {
  const docType = schema.get('document').editorModule
  if (docType === 'documentPlain') {
    return documentPlainAutoMeta
  }
  return documentAutoMeta
}

export default ({ schema }) => ({
  plugins: [
    ...contentPlugins,
    Meta,
    AutoMeta(getAutoMeta(schema)),
    UI(contentPlugins)
  ]
})
