import { matchInline } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const link = {
    match: matchInline(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, { visitChildren, context }) => ({
      kind: 'inline',
      type: TYPE,
      data: {
        title: node.title,
        href: node.url,
        color: context.color
      },
      nodes: visitChildren(node)
    }),
    toMdast: (object, index, parent, { visitChildren }) => ({
      type: 'link',
      title: object.data.title,
      url: object.data.href,
      children: visitChildren(object)
    })
  }

  const serializer = new MarkdownSerializer({
    rules: [
      link
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
