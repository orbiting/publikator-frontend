
import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const mdastRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent) => {
      return ({
        object: 'block',
        type: TYPE,
        data: {
          config: parent.data,
          values: node.value
        },
        isVoid: true,
        nodes: []
      })
    },
    toMdast: (object) => ({
      type: 'code',
      value: object.data.values
    })
  }

  const serializer = new MarkdownSerializer({
    rules: [
      mdastRule
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
