import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const schemaRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: () => {
      return ({
        object: 'block',
        type: TYPE,
        isVoid: true,
        nodes: []
      })
    },
    toMdast: () => ({
      type: 'thematicBreak'
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
