import {
  uncurryN,
  allPass,
  map,
  compose,
  defaultTo,
  append,
  pick,
  ifElse,
  reduce,
  __,
  equals,
  type as typeOf,
  concat,
  when,
  reduceRight,
  merge,
  both,
} from 'ramda'

import {
  update,
  notIsNil,
  safePropEq,
  safePath,
  safeProp,
  mergeResults,
} from './common'

export const isType = safePropEq('type')

export const isObject = safePropEq('object')

export const isBlock = uncurryN(2, type =>
  allPass([isType(type), isObject('block')])
)

export const isInline = uncurryN(2, type =>
  allPass([isType(type), isObject('inline')])
)

export const isMark = uncurryN(2, type =>
  allPass([isType(type), isObject('mark')])
)

export const isDocument = isObject('document')

export const isText = isObject('text')

export const applyMark = uncurryN(2, mark =>
  update(
    'leaves',
    compose(
      map(
        update(
          'marks',
          compose(
            append(pick(['type', 'data'], mark)),
            defaultTo([])
          )
        )
      ),
      defaultTo([])
    )
  )
)

export const handleMark = uncurryN(2, mark =>
  compose(
    ifElse(isObject('mark'), flattenMarks),
    ifElse(isText, applyMark(mark))
  )(update('nodes', map(handleMark(mark))))
)

export const flattenMarks = mark => {
  return reduce(
    uncurryN(2, nodes =>
      compose(
        ifElse(
          compose(
            equals('Array'),
            typeOf
          ),
          concat(__, nodes),
          append(__, nodes)
        ),
        handleMark(mark)
      )
    ),
    [],
    safeProp('nodes', mark)
  )
}

export const withFlatMarks = transformer =>
  compose(
    when(isObject('mark'), flattenMarks),
    transformer
  )

export const prepareLeaf = leaf =>
  compose(
    reduceRight(
      (parent, child) => {
        return merge(parent, {
          object: 'mark',
          nodes: [child],
        })
      },
      { object: 'text', value: leaf.text }
    ),
    defaultTo([]),
    safeProp('marks')
  )(leaf)

export const nestMarks = compose(
  map(prepareLeaf),
  safeProp('leaves')
)

export const withNestedMarks = transformer =>
  ifElse(
    both(
      isText,
      compose(
        notIsNil,
        safeProp('leaves')
      )
    ),
    (node, next) => next(nestMarks(node)),
    transformer
  )

export const toObject = object => () => ({
  object,
})

export const ofType = type => () => ({
  type,
})

export const toBlock = type =>
  mergeResults(toObject('block'), ofType(type))

export const toInline = type =>
  mergeResults(toObject('inline'), ofType(type))

export const toMark = type =>
  mergeResults(toObject('mark'), ofType(type))

export const toText = node => ({
  object: 'text',
  leaves: [
    {
      text: node.value,
    },
  ],
})

export const withNodes = (node, next) => {
  return {
    nodes: next(safeProp('children', node)),
  }
}

export const withNormalizedNodes = normalizer => (
  node,
  next
) => {
  return {
    nodes: normalizer(
      safeProp('children', node),
      next
    ),
  }
}

export const withData = node => ({
  data: node.data,
})

export const withLinkData = node => ({
  data: {
    title: node.title,
    url: node.url,
  },
})

export const withImageParagraphData = node => ({
  data: {
    url: safePath(['children', 0, 'url'], node),
    title: safePath(
      ['children', 0, 'title'],
      node
    ),
    alt: safePath(['children', 0, 'alt'], node),
  },
})

export default {
  isBlock,
  isInline,
  isMark,
  isDocument,
  isText,
  isObject,
  toObject,
  ofType,
  toText,
  toMark,
  toBlock,
  toInline,
  withNodes,
  withFlatMarks,
  withNestedMarks,
  withNormalizedNodes,
  withData,
  withLinkData,
  withImageParagraphData,
}
