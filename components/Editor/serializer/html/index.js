import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

import {
  matchImage
} from 'mdast-react-render/lib/utils'

export default ({ rule, subModules, TYPE }) => {
  const {
    identifier = 'HTML'
  } = rule.editorOptions || {}

  const mdastRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node) => {
      const deepNodes = node.children.reduce(
        (children, child) => children
          .concat(child)
          .concat(child.children),
        []
      ).filter(Boolean)
      const images = deepNodes.filter(matchImage).map(image => ({
        ref: image.alt,
        url: image.url
      }))

      const code = node.children.find(c => c.type === 'code')

      return ({
        object: 'block',
        type: TYPE,
        data: {
          images,
          code: code
            ? code.value
            : ''
        },
        isVoid: true,
        nodes: []
      })
    },
    toMdast: (object) => {
      const { images, code } = object.data
      return {
        type: 'zone',
        identifier,
        children: images.map(({ ref, url }) => ({
          type: 'image',
          url,
          alt: ref
        })).concat({
          type: 'code',
          lang: 'html',
          value: code
        })
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
