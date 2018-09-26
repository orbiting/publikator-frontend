import { curry, propEq, uncurryN, both } from 'ramda'

const safePropEq = curry(
  (prop, val, node) => node && propEq(prop, val, node)
)

export const isType = safePropEq('type')

export const isObject = safePropEq('object')

export const isBlock = uncurryN(2, type =>
  both(isType(type), isObject('block'))
)

export const isInline = uncurryN(2, type =>
  both(isType(type), isObject('inline'))
)

export const isMark = uncurryN(2, type =>
  both(isType(type), isObject('mark'))
)

export const isDocument = isObject('document')

export const isText = isObject('text')
