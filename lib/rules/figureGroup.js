import {
  ifElse,
  compose,
  objOf,
  when,
  either,
  isNil,
  complement,
  equals,
  always,
  min,
  max,
  defaultTo,
} from 'ramda'

import {
  normalize,
  getJust,
  getOrNew,
  getMany,
} from '../transform/normalize'

import S from '../transform/slate'
import M from '../transform/mdast'
import {
  mergeResults,
  safeProp,
} from '../transform/common'
import Caption from './caption'
import FigureImage from './figureImage'

const figureGroupFigureFromMdast = ifElse(
  M.isZone('FIGURE'),
  mergeResults(
    S.toBlock('figureGroupFigure'),
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

const figureGroupFigureToMdast = ifElse(
  S.isBlock('figureGroupFigure'),
  mergeResults(M.toZone('FIGURE'), M.withChildren)
)

const fromMdast = ifElse(
  M.isZone('FIGUREGROUP'),
  mergeResults(
    S.toBlock('figureGroup'),
    compose(
      objOf('data'),
      mergeResults(
        compose(
          objOf('columns'),
          min(4),
          max(2),
          defaultTo(2),
          safeProp('columns')
        ),
        compose(
          objOf('size'),
          when(
            either(
              isNil,
              complement(equals('breakout'))
            ),
            always(null)
          ),
          safeProp('size')
        )
      ),
      safeProp('data')
    ),
    S.withNormalizedNodes(
      normalize(
        getMany(figureGroupFigureFromMdast),
        getJust(Caption.fromMdast)
      )
    )
  )
)

const toMdast = compose(
  ifElse(
    S.isBlock('figureGroup'),
    mergeResults(
      M.toZone('FIGUREGROUP'),
      M.withChildren
    )
  ),
  figureGroupFigureToMdast
)

export default {
  fromMdast,
  toMdast,
}
