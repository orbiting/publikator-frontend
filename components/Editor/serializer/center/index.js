import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const paragraphModule = subModules.find(m => m.name === 'paragraph')
  if (!paragraphModule) {
    throw new Error('Missing paragraph submodule')
  }

  const childSerializer = new MarkdownSerializer({
    rules: subModules.reduce(
      (a, m) => a.concat(
        m.helpers && m.helpers.serializer &&
        m.helpers.serializer.rules
      ),
      []
    ).filter(Boolean)
  })

  const center = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => ({
      object: 'block',
      type: TYPE,
      nodes: childSerializer.fromMdast(node.children, 0, node, rest)
    }),
    toMdast: (object, index, parent, rest) => ({
      type: 'zone',
      identifier: 'CENTER',
      children: childSerializer.toMdast(object.nodes, 0, object, rest)
    })
  }

  const serializer = new MarkdownSerializer({
    rules: [
      center
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
