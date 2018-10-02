import { isBlock } from '../base/lib'
import { anyPass } from 'ramda'
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
import TitleBlock from '../plugins/titleBlock'
import DynamicComponent from '../plugins/dynamicComponent'
import Center from '../plugins/center'
import Meta from '../plugins/meta'

import Toolbar from '../plugins/toolbar'
import AutoMeta from '../plugins/autoMeta'
import UI from '../plugins/ui'

import autoMeta from './autoMeta'

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

const CenterToolbar = Toolbar({
  isNode: isBlock('center'),
  offset: 1,
  isChildNode: anyPass([
    isBlock('paragraph'),
    isBlock('infoBox'),
    isBlock('figure'),
    isBlock('subhead'),
    isBlock('list'),
    isBlock('figureGroup'),
    isBlock('pullQuote'),
    isBlock('html'),
    isBlock('chart'),
    isBlock('dynamicComponent')
  ]),
  insertItems: [
    { text: 'Infobox', value: InfoBox.getNew },
    { text: 'Figure', value: Figure.getNew },
    { text: 'Figure Group', value: FigureGroup.getNew },
    { text: 'Pull Quote', value: PullQuote.getNew },
    { text: 'HTML Element', value: HTML.getNew },
    { text: 'Chart', value: Chart.getNew },
    { text: 'Dynamic Component', value: DynamicComponent.getNew }
  ]
})

export default () => ({
  plugins: [
    ...contentPlugins,
    Meta,
    AutoMeta(autoMeta),
    UI([...contentPlugins, { renderUI: CenterToolbar }])
  ]
})
