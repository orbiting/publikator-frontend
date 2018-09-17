import { compose, ifElse } from 'ramda'

import S from '../../../lib/transform/slate'
import M from '../../../lib/transform/mdast'
import { mergeResults } from '../../../lib/transform/common'
import {
  normalize,
  getOrSkip,
  getMany,
  getOrNew,
} from '../../../lib/transform/normalize'

import Bold from '../../../lib/rules/bold'
import Italic from '../../../lib/rules/italic'
import Center from '../../../lib/rules/center'
import Figure from '../../../lib/rules/figure'
import Link from '../../../lib/rules/link'
import Paragraph from '../../../lib/rules/paragraph'
import Subhead from '../../../lib/rules/subhead'
import Subscript from '../../../lib/rules/subscript'
import Superscript from '../../../lib/rules/superscript'
import Text from '../../../lib/rules/text'
import TitleBlock from '../../../lib/rules/titleBlock'
import InfoBox from '../../../lib/rules/infoBox'
import Caption from '../../../lib/rules/caption'
import HTML from '../../../lib/rules/html'
import FigureGroup from '../../../lib/rules/figureGroup'
import Cover from '../../../lib/rules/cover'
import FigureImage from '../../../lib/rules/figureImage'
import List from '../../../lib/rules/list'

const articleFromMdast = ifElse(
  M.isRoot,
  mergeResults(
    S.toObject('document'),
    S.withNormalizedNodes(
      normalize(
        getOrSkip(Cover.fromMdast),
        getOrNew(
          TitleBlock.getNew,
          TitleBlock.fromMdast
        ),
        getMany(
          compose(
            Figure.fromMdast,
            Center.fromMdast
          )
        )
      )
    ),
    node => ({
      data: node.meta,
    })
  )
)

const articleToMdast = ifElse(
  S.isDocument,
  mergeResults(M.toRoot, M.withChildren)
)

export default {
  fromMdast: compose(
    Bold.fromMdast,
    Italic.fromMdast,
    Center.fromMdast,
    articleFromMdast,
    Figure.fromMdast,
    Link.fromMdast,
    List.fromMdast,
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
    articleToMdast,
    Figure.toMdast,
    Link.toMdast,
    List.toMdast,
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
