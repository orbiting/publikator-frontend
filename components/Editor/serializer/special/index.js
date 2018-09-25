import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const zone = {
    match: matchBlock(TYPE),
    matchMdast: (node) => node.type === 'zone',
    fromMdast: (node) => {
      return {
        kind: 'block',
        type: TYPE,
        data: {
          identifier: node.identifier,
          ...node.data
        },
        isVoid: true
      }
    },
    toMdast: (object) => {
      const { identifier, ...data } = object.data
      return {
        type: 'zone',
        identifier,
        data: data,
        children: []
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      zone
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
