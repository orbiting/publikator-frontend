import { uncurryN, identity, ifElse } from 'ramda'
import {
  withFlatMarks,
  withNestedMarks,
} from './slate'
import { log } from './common'
import { transform } from './transform'
import { isText } from './mdast'

const mdastNotFound = v =>
  log(
    'Skip value. No transformer found for MDAST node:\n',
    v
  ) && null

const slateNotFound = v =>
  log(
    'Skip value. No transformer found for Slate node:\n',
    v
  ) && null

export const deserialize = uncurryN(
  2,
  transformer =>
    transform(
      withFlatMarks(transformer(mdastNotFound))
    )
)

export const serialize = uncurryN(
  2,
  transformer =>
    transform(
      withNestedMarks(transformer(slateNotFound))
    )
)

const withTyped = transformer =>
  ifElse(isText, identity, transformer)

export const toTyped = uncurryN(2, transformer =>
  transform(withTyped(transformer(mdastNotFound)))
)
