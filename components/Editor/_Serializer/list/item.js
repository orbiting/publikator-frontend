import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export default ({ rule, subModules, TYPE }) => {
  const paragraphModule = subModules.find(m => m.name === 'paragraph')
  if (!paragraphModule) {
    throw new Error('Missing paragraph submodule')
  }
  const paragraphSerializer = paragraphModule.helpers.serializer

  const listItem = {
    match: matchBlock(TYPE),
    matchMdast: (node) => node.type === 'listItem',
    fromMdast: (node, index, parent, rest) => ({
      kind: 'block',
      type: TYPE,
      nodes: paragraphSerializer.fromMdast(node.children, 0, node, rest)
    }),
    toMdast: (object, index, parent, rest) => ({
      type: 'listItem',
      loose: !parent.data.compact,
      children: paragraphSerializer.toMdast(object.nodes, 0, object, rest)
    })
  }

  const serializer = new MarkdownSerializer({
    rules: [
      listItem
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
