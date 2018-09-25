import { matchMark } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const {
    type,
    mdastType: mdastTypeOption
  } = rule.editorOptions
  const mdastType = mdastTypeOption || type
  if (!mdastType) {
    throw new Error(`Missing Mdast Type ${mdastType}`)
  }

  const markRule = {
    match: matchMark(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, { visitChildren }) => ({
      object: 'mark',
      type: TYPE,
      nodes: visitChildren(node)
    }),
    toMdast: (mark, index, parent, { visitChildren }) => ({
      type: mdastType,
      children: visitChildren(mark)
    })
  }

  const serializer = new MarkdownSerializer({
    rules: [
      markRule
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
