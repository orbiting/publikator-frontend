import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

const getSerializer = options => {
  const [bylineModule, ...subModules] = options.subModules
  const inlineSerializer = new MarkdownSerializer({
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
      .concat({
        matchMdast: node => node.type === 'break',
        fromMdast: () => ({
          object: 'text',
          leaves: [{ object: 'leaf', text: '\n', marks: [] }]
        })
      })
  })

  const fromMdast = (node, index, parent, rest) => {
    const lastChild = node.children[node.children.length - 1]
    const byline = lastChild.type === 'emphasis' && lastChild
    const text =
      byline && node.children.length === 1
        ? null
        : byline
          ? node.children.slice(0, -1)
          : node.children

    const nodes = [
      text && {
        object: 'block',
        type: 'captionText',
        nodes: inlineSerializer.fromMdast(text, 0, node, rest)
      },
      byline && {
        object: 'block',
        type: bylineModule.TYPE,
        nodes: bylineModule.helpers.serializer.fromMdast(
          byline.children,
          0,
          node,
          rest
        )
      }
    ].filter(Boolean)

    return {
      object: 'block',
      type: options.TYPE,
      nodes
    }
  }

  const toMdast = (object, index, parent, rest) => {
    const text = object.nodes.find(n => n.type === 'captionText')
    const byline = object.nodes.find(n => n.type === 'captionByline')

    const children = [
      ...(text
        ? inlineSerializer.toMdast(text.nodes, 0, object, rest)
        : []),
      byline && {
        type: 'emphasis',
        children: bylineModule.helpers.serializer.toMdast(
          byline.nodes,
          0,
          byline,
          rest
        )
      }
    ].filter(Boolean)

    return {
      type: 'paragraph',
      children
    }
  }

  return new MarkdownSerializer({
    rules: [
      {
        match: matchBlock(options.TYPE),
        matchMdast: options.rule.matchMdast,
        fromMdast,
        toMdast
      }
    ]
  })
}

export default options => ({
  TYPE: options.TYPE,
  rule: options.rule,
  helpers: {
    serializer: getSerializer(options)
  }
})
