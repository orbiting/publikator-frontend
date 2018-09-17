import {
  compose,
  unnest,
  filter,
  mapAccum,
  always,
  ifElse,
  nth,
} from 'ramda'

import { notIsNil } from './common'

export const getJust = rule => (
  nodes,
  index,
  next
) => [
  index + 1,
  rule(always(null))(nodes[index], next),
]

export const getOrNew = (constructFn, rule) => (
  nodes,
  index,
  next
) => [
  index + 1,
  rule(constructFn)(nodes[index], next),
]

export const getOrSkip = rule => (
  nodes,
  index,
  next
) => {
  const ret = rule(always(null))(
    nodes[index],
    next
  )
  return [!ret ? index : index + 1, ret]
}

export const getOrSkipAt = (
  indexToSkip,
  rule
) => (nodes, index, next) => {
  const cleanIndexToSkip =
    indexToSkip > 0
      ? indexToSkip
      : nodes.length + indexToSkip
  if (index === cleanIndexToSkip) {
    return [index, null]
  }
  return getJust(rule)(nodes, index, next)
}

export const getMany = rule => (
  nodes,
  startIndex,
  next
) => {
  const transformer = rule(always(null))
  let index = startIndex
  let res = []
  let ret = transformer(nodes[index], next)
  while (ret) {
    res = res.concat(ret)
    index = index + 1
    ret =
      nodes[index] &&
      transformer(nodes[index], next)
  }
  return [index, res]
}

export const getIfNotEmpty = (
  isEmptyFn,
  rule
) => (nodes, index, next) => [
  index + 1,
  ifElse(
    isEmptyFn,
    always(null),
    rule(always(null))
  )(nodes[index], next),
]

export const normalize = (...normalizers) => (
  nodes,
  next
) =>
  compose(
    unnest,
    filter(notIsNil),
    nth(1),
    mapAccum(
      (index, normalizer) =>
        normalizer(nodes, index, next),
      0
    )
  )(normalizers)
