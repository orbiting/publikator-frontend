
import MarkdownSerializer from 'slate-mdast-serializer'
import {
  matchBlock
} from '../utils'

export default ({ rule, subModules, TYPE }) => {
  const {
    depth
  } =
    rule.editorOptions || {}

  const inlineSerializer = new MarkdownSerializer({
    rules: subModules
      .reduce(
        (a, m) => a.concat(
          m.helpers && m.helpers.serializer &&
          m.helpers.serializer.rules
        ),
        []
      ).filter(Boolean)
  })

  const title = {
    match: matchBlock(TYPE),
    matchMdast: node =>
      node.type === 'heading' && node.depth === depth,
    fromMdast: (
      node,
      index,
      parent,
      rest
    ) => {
      return ({
        object: 'block',
        type: TYPE,
        nodes: inlineSerializer.fromMdast(node.children, 0, node, rest)
      })
    },
    toMdast: (
      object,
      index,
      parent,
      rest
    ) => {
      return ({
        type: 'heading',
        depth,
        children: inlineSerializer.toMdast(
          object.nodes,
          0,
          object,
          rest
        )
      })
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [title]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
