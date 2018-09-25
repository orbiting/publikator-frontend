import { matchBlock } from '../utils'
import { findOrCreate } from '../utils/serialization'
import MarkdownSerializer from 'slate-mdast-serializer'

export default options => {
  const { rule, subModules, TYPE } = options
  // Define submodule and serializers
  const imageModule = subModules.find(m => m.name === 'figureImage')
  if (!imageModule) {
    throw new Error('Missing figureImage submodule')
  }
  const imageSerializer = imageModule.helpers.serializer

  const captionModule = subModules.find(m => m.name === 'figureCaption')
  if (!captionModule) {
    throw new Error('Missing figureCaption submodule')
  }
  const captionSerializer = captionModule.helpers.serializer

  const FIGURE_IMAGE = imageModule.TYPE
  const FIGURE_CAPTION = captionModule.TYPE

  const {
    identifier = 'FIGURE'
  } = rule.editorOptions || {}

  const figure = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      const deepNodes = node.children.reduce(
        (children, child) => children
          .concat(child)
          .concat(child.children),
        []
      )
      const image = findOrCreate(deepNodes, { type: 'image' })
      const imageParagraph = node.children.find(n => n.children && n.children.indexOf(image) !== -1)

      const caption = (
        node.children.find(child => child.type === 'paragraph' && child !== imageParagraph) ||
        ({
          type: 'paragraph',
          children: [
            { type: 'text', value: '' },
            {
              type: 'emphasis',
              children: [
                { type: 'text', value: '' }
              ]
            }
          ]
        })
      )

      return {
        kind: 'block',
        type: TYPE,
        data: {
          float: node.data.float,
          size: node.data.size,
          excludeFromGallery: node.data.excludeFromGallery === true
        },
        nodes: [
          imageSerializer.fromMdast(image, 0, node, rest),
          captionSerializer.fromMdast(caption, 1, node, rest)
        ]
      }
    },
    toMdast: (object, index, parent, rest) => {
      const image = findOrCreate(object.nodes, {
        kind: 'block',
        type: FIGURE_IMAGE
      }, { isVoid: true, data: {} })
      const caption = findOrCreate(object.nodes, {
        kind: 'block',
        type: FIGURE_CAPTION
      }, { nodes: [], data: {} })

      return {
        type: 'zone',
        identifier,
        data: {
          ...object.data,
          ...caption.data
        },
        children: [
          imageSerializer.toMdast(image, 0, object, rest),
          captionSerializer.toMdast(caption, 1, object, rest)
        ]
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      figure
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
