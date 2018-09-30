import { matchBlock } from '../utils'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ TYPE }) => {
  const figureImage = {
    match: matchBlock(TYPE),
    matchMdast: node => node.type === 'image',
    fromMdast: node => {
      return {
        object: 'block',
        type: TYPE,
        data: {
          alt: node.alt,
          src: node.url
        },
        isVoid: true,
        nodes: []
      }
    },
    toMdast: object => ({
      type: 'image',
      alt: object.data.alt,
      url: object.data.src
    })
  }

  const serializer = new MarkdownSerializer({
    rules: [figureImage]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
