import { ifElse, compose, always } from 'ramda'
import S from '../transform/slate'
import M from '../transform/mdast'

import { mergeResults } from '../transform/common'
import {
  normalize,
  getJust,
  getOrNew,
  getOrSkip,
  getMany,
} from '../transform/normalize'

import Caption from './caption'
import FigureImage from './figureImage'

const infoBoxFigureFromMdast = ifElse(
  M.isZone('FIGURE'),
  mergeResults(
    S.toBlock('infoBoxFigure'),
    always({ data: {} }),
    S.withNormalizedNodes(
      normalize(
        getOrNew(
          FigureImage.getNew,
          FigureImage.fromMdast
        ),
        getJust(Caption.fromMdast)
      )
    )
  )
)

const infoBoxFigureToMdast = ifElse(
  S.isBlock('infoBoxFigure'),
  mergeResults(M.toZone('FIGURE'), M.withChildren)
)

const infoBoxTitleFromMdast = ifElse(
  M.isHeading(3),
  mergeResults(
    S.toBlock('infoBoxTitle'),
    S.withNodes
  )
)

const infoBoxTextFromMdast = ifElse(
  M.isParagraph,
  mergeResults(
    S.toBlock('infoBoxText'),
    S.withNodes
  )
)

const fromMdast = ifElse(
  M.isZone('INFOBOX'),
  mergeResults(
    S.toBlock('infoBox'),
    S.withData,
    S.withNormalizedNodes(
      normalize(
        getOrNew(
          S.toBlock('title'),
          infoBoxTitleFromMdast
        ),
        getOrSkip(infoBoxFigureFromMdast),
        getMany(infoBoxTextFromMdast)
      )
    )
  )
)

const toMdast = compose(
  ifElse(
    S.isBlock('infoBox'),
    mergeResults(
      M.toZone('INFOBOX'),
      M.withChildren
    )
  ),
  ifElse(
    S.isBlock('infoBoxTitle'),
    mergeResults(M.toHeading(3), M.withChildren)
  ),
  ifElse(
    S.isBlock('infoBoxText'),
    mergeResults(M.toParagraph, M.withChildren)
  ),
  ifElse(
    S.isBlock('infoBoxFigure'),
    infoBoxFigureToMdast
  )
)

export default {
  fromMdast,
  toMdast,
}
