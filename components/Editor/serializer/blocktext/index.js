import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const paragraphModule = subModules.find(m => m.name === 'paragraph')
  if (!paragraphModule) {
    throw new Error('Missing paragraph submodule')
  }
  const paragraphSerializer = paragraphModule.helpers.serializer

  const {
    mdastType = 'blockquote',
    identifier
  } = rule.editorOptions || {}

  const schemaRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => ({
      object: 'block',
      type: TYPE,
      data: node.data,
      nodes: paragraphSerializer.fromMdast(node.children, 0, node, rest)
    }),
    toMdast: (object, index, parent, rest) => ({
      type: mdastType,
      identifier,
      data: object.data,
      children: paragraphSerializer.toMdast(object.nodes, 0, object, rest)
    })
  }

  const serializer = new MarkdownSerializer({
    rules: [
      schemaRule
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
