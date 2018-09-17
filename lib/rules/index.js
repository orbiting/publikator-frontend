import { compose } from 'ramda'

import Bold from './bold'
import Italic from './italic'
import Center from './center'
import Document from './document'
import Figure from './figure'
import Link from './link'
import Paragraph from './paragraph'
import Subhead from './subhead'
import Subscript from './subscript'
import Superscript from './superscript'
import Text from './text'
import TitleBlock from './titleBlock'
import InfoBox from './infoBox'
import Caption from './caption'
import HTML from './html'
import FigureGroup from './figureGroup'
import Cover from './cover'
import FigureImage from './figureImage'

export default {
  fromMdast: compose(
    Bold.fromMdast,
    Italic.fromMdast,
    Center.fromMdast,
    Document.fromMdast,
    Figure.fromMdast,
    Link.fromMdast,
    Paragraph.fromMdast,
    Subhead.fromMdast,
    Subscript.fromMdast,
    Superscript.fromMdast,
    Text.fromMdast,
    InfoBox.fromMdast,
    HTML.fromMdast,
    FigureGroup.fromMdast
  ),
  toMdast: compose(
    Bold.toMdast,
    Italic.toMdast,
    Center.toMdast,
    Document.toMdast,
    Figure.toMdast,
    Link.toMdast,
    Paragraph.toMdast,
    Subhead.toMdast,
    Subscript.toMdast,
    Superscript.toMdast,
    Text.toMdast,
    TitleBlock.toMdast,
    Caption.toMdast,
    InfoBox.toMdast,
    HTML.toMdast,
    Cover.toMdast,
    FigureImage.toMdast,
    FigureGroup.toMdast
  ),
}
