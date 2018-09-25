import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, subModules, TYPE }) => {
  const {
    identifier = 'DYNAMIC_COMPONENT'
  } = rule.editorOptions || {}

  const mdastRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node) => {
      const html = node.children.find(c => c.type === 'code' && c.lang === 'html')

      return ({
        kind: 'block',
        type: TYPE,
        data: {
          ...node.data,
          html: html
            ? html.value
            : ''
        },
        isVoid: true,
        nodes: []
      })
    },
    toMdast: (object) => {
      const { html, ...data } = object.data
      return {
        type: 'zone',
        identifier,
        data,
        children: html ? [{
          type: 'code',
          lang: 'html',
          value: html
        }] : []
      }
    }
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
