import { isBlock } from '../base/lib'
import { SchemaComponent } from '../base/components/Schema'
import Placeholder from '../base/components/Placeholder'
import Link from '../plugins/link'
import FigureGroup from '../plugins/figureGroup'
import BlockQuote from '../plugins/blockQuote'
import PullQuote from '../plugins/pullQuote'
import Figure from '../plugins/figure'
import FigureImage from '../plugins/figureImage'
import Cover from '../plugins/cover'
import Caption from '../plugins/caption'
import Embeds from '../plugins/embeds'
import Bold from '../plugins/bold'
import HTML from '../plugins/html'
import List from '../plugins/list'
import Superscript from '../plugins/superscript'
import InfoBox from '../plugins/infoBox'
import Subscript from '../plugins/subscript'
import Italic from '../plugins/italic'
import Chart from '../plugins/chart'
import Paragraph from '../plugins/paragraph'
import Subhead from '../plugins/subhead'
import DynamicComponent from '../plugins/dynamicComponent'
import Center from '../plugins/center'

import Meta from '../plugins/meta'
import AutoMeta from '../plugins/autoMeta'
import UI from '../plugins/ui'

import autoMeta from './autoMeta'

const TitleBlock = {
  renderNode ({ node, attributes, children }) {
    if (isBlock('titleBlock', node)) {
      return (
        <SchemaComponent attributes={attributes} name='titleBlock'>
          {children}
        </SchemaComponent>
      )
    }
    if (isBlock('title', node)) {
      return (
        <SchemaComponent attributes={attributes} name='title'>
          {children}
        </SchemaComponent>
      )
    }
  },
  renderPlaceholder ({ node }) {
    if (node.text.trim() !== '') {
      return
    }
    if (isBlock('title', node)) {
      return <Placeholder>Titel</Placeholder>
    }
  },
  schema: {
    blocks: {
      titleBlock: {
        nodes: [{ match: { type: 'title' }, min: 1, max: 1 }],
        normalize (change) {
          return change.undo()
        }
      }
    }
  }
}

const contentPlugins = [
  Bold,
  Center,
  FigureGroup,
  InfoBox,
  TitleBlock,
  BlockQuote,
  Embeds,
  Cover,
  Figure,
  HTML,
  Chart,
  DynamicComponent,
  PullQuote,
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

export default () => ({
  plugins: [
    ...contentPlugins,
    Meta,
    AutoMeta(autoMeta),
    UI(contentPlugins)
  ]
})
