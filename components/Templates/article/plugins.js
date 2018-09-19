import Link from '../../Plugins/link'
import FigureGroup from '../../Plugins/figureGroup'
import Figure from '../../Plugins/figure'
import FigureImage from '../../Plugins/figureImage'
import Cover from '../../Plugins/cover'
import Caption from '../../Plugins/caption'
import Bold from '../../Plugins/bold'
import List from '../../Plugins/list'
import Superscript from '../../Plugins/superscript'
import Subscript from '../../Plugins/subscript'
import Italic from '../../Plugins/italic'
import Paragraph from '../../Plugins/paragraph'
import Subhead from '../../Plugins/subhead'
import TitleBlock from '../../Plugins/titleBlock'

import Infobox from '../../Plugins/infoBox'
import Meta from '../../Plugins/meta'

import Center from '../../Plugins/center'
import UI from '../../Plugins/ui'

const plugins = [
  Bold,
  Center,
  FigureGroup,
  Infobox,
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
  Italic,
  Meta,
]

export default [...plugins, UI(plugins)]
