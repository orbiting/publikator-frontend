import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export const fromMdast = ({
  TYPE,
  subModules
}) => {
  const [ teaserModule ] = subModules
  const teaserSerializer = teaserModule.helpers.serializer
  return (
    node,
    index,
    parent,
    rest
  ) => ({
    object: 'block',
    type: TYPE,
    nodes: node.children.map(
      (v, i) => teaserSerializer.fromMdast(v, i, node, rest)
    )
  })
}

export const toMdast = ({
  TYPE,
  subModules
}) => {
  const [ teaserModule ] = subModules
  const teaserSerializer = teaserModule.helpers.serializer
  return (
    node,
    index,
    parent,
    rest
  ) => ({
    type: 'zone',
    identifier: 'TEASERGROUP',
    children: node.nodes.map(v =>
      teaserSerializer.toMdast(v)
    )
  })
}

const getSerializer = options => {
  return new MarkdownSerializer({
    rules: [
      {
        match: matchBlock(options.TYPE),
        matchMdast:
          options.rule.matchMdast,
        fromMdast: fromMdast(options),
        toMdast: toMdast(options)
      }
    ]
  })
}

export default options => ({
  helpers: {
    serializer: getSerializer(options)
  },
  rule: getSerializer(options).rules[0]
})
