import {
  curry,
  compose,
  ifElse,
  flip,
  equals,
  type as typeOf,
} from 'ramda'

import { cleanFlatMap, log } from './common'

export const transformObject = curry(
  (transformer, v) =>
    transformer(v, transform(transformer))
)

export const transformList = curry(
  (transformer, list) =>
    cleanFlatMap(
      transformObject(transformer),
      list
    )
)

export const transform = compose(
  ifElse(
    flip(
      compose(
        equals('Array'),
        typeOf
      )
    ),
    transformList
  ),
  ifElse(
    flip(
      compose(
        equals('Object'),
        typeOf
      )
    ),
    transformObject
  )
)(n => {
  log(`Invalid data type ${typeOf(n)}found:\n`, n)
})
