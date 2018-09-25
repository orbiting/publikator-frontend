import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

const getSerializer = options => {
  const [ bylineModule, ...subModules ] = options.subModules
  const inlineSerializer = new MarkdownSerializer(
    {
      rules: subModules
        .reduce(
          (a, m) =>
            a.concat(
              m.helpers &&
                m.helpers.serializer &&
                m.helpers.serializer
                  .rules
            ),
          []
        )
        .filter(Boolean)
        .concat({
          matchMdast: node =>
            node.type === 'break',
          fromMdast: () => ({
            object: 'text',
            leaves: [{ object: 'leaf', text: '\n', marks: [] }]
          })
        })
    }
  )

  const fromMdast = (
    node,
    index,
    parent,
    rest
  ) => {
    const captionNodes = node.children.filter(n => n.type !== 'emphasis')
    const byline = node.children.find(n => n.type === 'emphasis') ||
          { type: 'emphasis', children: [] }
    const bylineNodes = byline.children

    const res = {
      object: 'block',
      type: options.TYPE,
      nodes: [
        {
          object: 'block',
          type: 'CAPTION_TEXT',
          nodes: inlineSerializer.fromMdast(
            captionNodes,
            0,
            node,
            rest
          )
        },
        {
          object: 'block',
          type: bylineModule.TYPE,
          nodes: bylineModule.helpers.serializer.fromMdast(
            bylineNodes,
            0,
            node,
            rest
          )
        }
      ]
    }
    return res
  }

  const toMdast = (
    object,
    index,
    parent,
    rest
  ) => {
    const [
      caption,
      byline
    ] = object.nodes

    const children = [
      ...inlineSerializer.toMdast(
        caption.nodes,
        0,
        object,
        rest
      )
    ]
    const bylineChildren = bylineModule.helpers.serializer.toMdast(
      byline.nodes,
      1,
      object,
      rest
    )

    if (
      bylineChildren.length &&
      !(
        bylineChildren.length === 1 &&
        bylineChildren[0].value === ''
      )
    ) {
      children.push({
        type: 'emphasis',
        children: bylineChildren
      })
    }

    const res = {
      type: 'paragraph',
      children
    }
    return res
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
