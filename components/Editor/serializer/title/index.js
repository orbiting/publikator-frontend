import MarkdownSerializer from 'slate-mdast-serializer'
import { findNode } from '../utils/serialization'
import { matchBlock } from '../utils'

export default ({ rule, subModules, TYPE }) => {
  const editorOptions = rule.editorOptions || {}

  const {
    identifier = 'TITLE'
  } = editorOptions

  const childSerializer = new MarkdownSerializer({
    rules: subModules.reduce(
      (a, m) => a.concat(
        m.helpers && m.helpers.serializer &&
        m.helpers.serializer.rules
      ),
      []
    ).filter(Boolean)
  })

  const serializerRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      const subject = findNode(
        node.children,
        { type: 'heading', depth: 2 }
      )

      // if there's no subject yet, add one after the headline.
      const writableNode = { ...node, children: [...node.children] }
      if (!subject) {
        writableNode.children.splice(1, 0, {
          type: 'heading',
          depth: 2,
          children: []
        })
      }

      let nodes = childSerializer.fromMdast(writableNode.children, 0, writableNode, rest)
      const { format } = rest.context
      if (format) {
        // enhance all immediate children with format
        // - needed for headline
        nodes = nodes.map(node => ({ ...node, data: { ...node.data, format } }))
      }

      return {
        kind: 'block',
        type: TYPE,
        data: {
          ...node.data,
          format
        },
        nodes
      }
    },
    toMdast: (object, index, parent, rest) => {
      // omit format
      const { format, ...data } = object.data
      return {
        type: 'zone',
        identifier,
        data,
        children: childSerializer.toMdast(object.nodes, 0, object, rest)
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      serializerRule
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
