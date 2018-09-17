import {
  isNil,
  complement,
  uncurryN,
  compose,
  curry,
  unnest,
  filter,
  map,
  converge,
  mergeDeepLeft,
  reduce,
  over,
  both,
  equals,
  ifElse,
  lensProp,
  lensPath,
  view,
  always,
  prop,
} from 'ramda'

export const update = uncurryN(
  3,
  compose(
    over,
    lensProp
  )
)

export const prettyPrint = obj =>
  JSON.stringify(obj, null, 3)

export const log = curry((msg, v) => {
  console.log(msg, v)
  return v
})

export const notIsNil = complement(isNil)

export const safePath = uncurryN(2, path =>
  view(lensPath(path))
)

export const safeProp = uncurryN(
  2,
  ifElse(isNil, always, prop)
)

export const safePropEq = uncurryN(
  3,
  (key, val) =>
    compose(
      both(notIsNil, equals(val)),
      safeProp(key)
    )
)

export const cleanFlatMap = uncurryN(
  2,
  compose(
    unnest,
    filter(notIsNil),
    map
  )
)

export const mergeResults = compose(
  converge(
    compose(
      reduce(mergeDeepLeft, {}),
      Array.of
    )
  ),
  Array.of
)
