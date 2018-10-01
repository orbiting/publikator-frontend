import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export default ({ rule, subModules, TYPE }) => {
  const editorOptions = rule.editorOptions || {}

  const { identifier = 'TITLE' } = editorOptions

  const childSerializer = new MarkdownSerializer({
    rules: subModules
      .reduce(
        (a, m) =>
          a.concat(
            m.helpers &&
              m.helpers.serializer &&
              m.helpers.serializer.rules
          ),
        []
      )
      .filter(Boolean)
  })

  const serializerRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      // if there's only pne paragraph -> no lead.
      const hasLead =
        node.children.filter(v => v.type === 'paragraph').length > 1

      let nodes = childSerializer.fromMdast(
        node.children,
        0,
        node,
        rest
      )

      const { format } = rest.context
      if (format) {
        // enhance all immediate children with format
        // - needed for headline
        nodes = nodes.map(n => ({
          ...n,
          data: { ...n.data, format }
        }))
      }

      // Lead rule comes first, so make it a credit.
      if (!hasLead) {
        nodes = nodes.map(
          v =>
            (matchBlock('lead')(v) && { ...v, type: 'credit' }) || v
        )
      }

      return {
        object: 'block',
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
        children: childSerializer.toMdast(
          object.nodes,
          0,
          object,
          rest
        )
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [serializerRule]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
