import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const itemModule = subModules.find(m => m.name === 'listItem')
  if (!itemModule) {
    throw new Error('Missing listItem submodule')
  }
  const itemSerializer = itemModule.helpers.serializer

  const list = {
    match: matchBlock(TYPE),
    matchMdast: (node) => node.type === 'list',
    fromMdast: (node, index, parent, rest) => ({
      kind: 'block',
      type: TYPE,
      data: {
        ordered: node.ordered,
        start: node.start,
        compact: !node.loose
      },
      nodes: itemSerializer.fromMdast(node.children, 0, node, rest)
    }),
    toMdast: (object, index, parent, rest) => {
      const res = ({
        type: 'list',
        loose: !object.data.compact,
        ordered: object.data.ordered,
        start: object.data.start || 1,
        children: itemSerializer.toMdast(object.nodes, 0, object, rest)
      })
      return res
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      list
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
