import { matchBlock } from '../utils'
import { findOrCreate } from '../utils/serialization'
import MarkdownSerializer from 'slate-mdast-serializer'

export default ({ rule, schemaType, subModules, TYPE }) => {
  const titleModule = subModules.find(m => m.name === 'headline')
  if (!titleModule) {
    throw new Error('Missing headline submodule')
  }
  const titleSerializer = titleModule.helpers.serializer

  const leadModule = subModules.find(m => m.name === 'paragraph')
  if (!leadModule) {
    throw new Error('Missing paragraph submodule')
  }
  const leadSerializer = leadModule.helpers.serializer

  const isCover = matchBlock(TYPE)

  const cover = {
    match: isCover,
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      // fault tolerant because markdown could have been edited outside
      const deepNodes = node.children.reduce(
        (children, child) =>
          children.concat(child).concat(child.children),
        []
      )
      const image = findOrCreate(deepNodes, { type: 'image' })
      const imageParagraph = node.children.find(
        child =>
          child.children && child.children.indexOf(image) !== -1
      )
      const title = findOrCreate(
        node.children,
        { type: 'heading', depth: 1 },
        { children: [] }
      )

      const lead = node.children.find(
        child =>
          child.type === 'paragraph' && child !== imageParagraph
      ) ||
        findOrCreate(
          node.children,
          { type: 'blockquote' },
          { children: [] }
        ).children[0] || {
        type: 'paragraph',
        children: []
      }

      return {
        object: 'block',
        type: TYPE,
        data: {
          src: image.url,
          alt: image.alt
        },
        nodes: [
          titleSerializer.fromMdast(title, 0, node, rest),
          leadSerializer.fromMdast(lead, 1, node, rest)
        ]
      }
    },
    toMdast: (object, index, ...args) => {
      return {
        type: 'zone',
        identifier: schemaType,
        children: [
          {
            type: 'image',
            alt: object.data.alt,
            url: object.data.src
          },
          titleSerializer.toMdast(
            findOrCreate(
              object.nodes,
              {
                object: 'block',
                type: titleModule.TYPE
              },
              { nodes: [] }
            ),
            1,
            ...args
          ),
          leadSerializer.toMdast(
            findOrCreate(
              object.nodes,
              {
                object: 'block',
                type: leadModule.TYPE
              },
              { nodes: [] }
            ),
            2,
            ...args
          )
        ]
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [cover]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
