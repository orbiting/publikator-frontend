import {
  compose,
  when,
  uncurryN,
  allPass,
  head,
  type as typeOf,
  equals,
} from 'ramda'

import {
  notIsNil,
  safeProp,
  safePath,
  safePropEq,
  mergeResults,
} from './common'

export const getChildren = safeProp('children')

export const getFirstChild = compose(
  when(notIsNil, head),
  getChildren
)

export const isType = safePropEq('type')

export const hasIdentifier = safePropEq(
  'identifier'
)

export const hasDepth = safePropEq('depth')

export const isBreak = isType('break')

export const isParagraph = isType('paragraph')

export const isBlockquote = isType('blockquote')

export const isLink = isType('link')

export const isStrong = isType('strong')

export const isEmphasis = isType('emphasis')

export const isSub = isType('sub')

export const isSup = isType('sup')

export const isSpan = isType('span')

export const isList = isType('list')

export const isCode = isType('code')

export const isListItem = isType('listItem')

export const isRoot = isType('root')

export const isText = isType('text')

export const isZone = uncurryN(2, identifier =>
  allPass([
    isType('zone'),
    hasIdentifier(identifier),
  ])
)

export const isImageParagraph = allPass([
  notIsNil,
  compose(
    compose(
      equals('Array'),
      typeOf
    ),
    getChildren
  ),
  compose(
    isType('image'),
    getFirstChild
  ),
])

export const isHeading = uncurryN(2, depth =>
  allPass([hasDepth(depth), isType('heading')])
)

export const toType = type => () => ({
  type,
})

export const toParagraph = toType('paragraph')

export const toBlockquote = toType('blockquote')

export const toStrong = toType('strong')

export const toEmphasis = toType('emphasis')

export const toSub = toType('sub')

export const toBreak = toType('break')

export const toSup = toType('sup')

export const toRoot = mergeResults(
  toType('root'),
  node => ({
    meta: node.data,
  })
)

export const toZone = identifier => node => ({
  type: 'zone',
  identifier,
  data: node.data,
})

export const toLink = node => ({
  type: 'link',
  title: safePath(['data', 'title'], node),
  url: safePath(['data', 'url'], node),
})

export const toImageParagraph = node => ({
  type: 'paragraph',
  children: [
    {
      type: 'image',
      url: safePath(['data', 'url'], node),
      title: safePath(['data', 'title'], node),
      alt: safePath(['data', 'alt'], node),
    },
  ],
})

export const toHeading = depth => () => ({
  type: 'heading',
  depth,
})

export const toText = node => {
  return {
    type: 'text',
    value: safeProp('value', node),
  }
}

export const withChildren = (node, next) => ({
  children: next(node.nodes),
})

export const withNormalizedChildren = normalizer => (
  node,
  next
) => {
  return {
    children: normalizer(
      safeProp('nodes', node),
      next
    ),
  }
}

export default {
  isParagraph,
  isBreak,
  isBlockquote,
  isLink,
  isStrong,
  isEmphasis,
  isSub,
  isSup,
  isSpan,
  isList,
  isCode,
  isListItem,
  isRoot,
  isZone,
  isText,
  isImageParagraph,
  isHeading,
  toType,
  toZone,
  toLink,
  toText,
  toHeading,
  toImageParagraph,
  toParagraph,
  toBlockquote,
  toStrong,
  toEmphasis,
  toSub,
  toBreak,
  toSup,
  toRoot,
  withChildren,
  withNormalizedChildren,
  withChildren,
}
