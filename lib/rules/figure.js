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
} from 'ramda'

import {
  normalize,
  getJust,
  getOrNew,
} from '../transform/normalize'

import S from '../transform/slate'
import M from '../transform/mdast'
import {
  mergeResults,
  safePath,
} from '../transform/common'

import Caption from './caption'
import FigureImage from './figureImage'

const fromMdast = ifElse(
  M.isZone('FIGURE'),
  mergeResults(
    S.toBlock('figure'),
    compose(
      objOf('data'),
      objOf('size'),
      when(
        either(
          isNil,
          complement(equals('breakout'))
        ),
        always(null)
      ),
      safePath(['data', 'size'])
    ),
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

const toMdast = compose(
  ifElse(
    S.isBlock('figure'),
    mergeResults(
      M.toZone('FIGURE'),
      M.withChildren
    )
  )
)

export default {
  fromMdast,
  toMdast,
}
