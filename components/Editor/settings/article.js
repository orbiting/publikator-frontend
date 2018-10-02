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

export default () => ({
  plugins: [
    ...contentPlugins,
    Meta,
    AutoMeta(autoMeta),
    UI(contentPlugins)
  ]
})
