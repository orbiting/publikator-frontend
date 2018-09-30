import { parse } from '@orbiting/remark-preset'
import MarkdownSerializer from 'slate-mdast-serializer'
import { findOrCreate } from '../utils/serialization'

export default ({ rule, subModules, TYPE }) => {
  const coverModule = subModules.find(m => m.name === 'cover')
  if (!coverModule) {
    throw new Error('Missing cover submodule')
  }
  const centerModule = subModules.find(m => m.name === 'center')
  if (!centerModule) {
    throw new Error('Missing center submodule')
  }

  const coverSerializer = coverModule.helpers.serializer
  const centerSerializer = centerModule.helpers.serializer

  const documentRule = {
    match: object => object.object === 'document',
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      const cover = findOrCreate(
        node.children,
        {
          type: 'zone',
          identifier: 'FIGURE'
        },
        {
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'image' }]
            }
          ]
        }
      )

      let center = findOrCreate(
        node.children,
        {
          type: 'zone',
          identifier: 'CENTER'
        },
        {
          children: []
        }
      )

      const centerIndex = node.children.indexOf(center)
      const before = []
      const after = []
      node.children.forEach((child, i) => {
        if (child !== cover && child !== center) {
          if (i > centerIndex) {
            after.push(child)
          } else {
            before.push(child)
          }
        }
      })
      if (before.length || after.length) {
        center = {
          ...center,
          children: [...before, ...center.children, ...after]
        }
      }
      const documentNode = {
        data: node.meta,
        object: 'document',
        nodes: [
          coverSerializer.fromMdast(cover, 0, node, rest),
          centerSerializer.fromMdast(center, 1, node, rest)
        ]
      }

      return {
        document: documentNode,
        object: 'value'
      }
    },
    toMdast: (object, index, parent, rest) => {
      const cover = findOrCreate(object.nodes, {
        object: 'block',
        type: coverModule.TYPE
      })
      const center = findOrCreate(
        object.nodes,
        { object: 'block', type: centerModule.TYPE },
        { nodes: [] }
      )
      const centerIndex = object.nodes.indexOf(center)
      object.nodes.forEach((node, i) => {
        if (node !== cover && node !== center) {
          center.nodes[i > centerIndex ? 'push' : 'unshift'](node)
        }
      })
      return {
        type: 'root',
        meta: object.data,
        children: [
          coverSerializer.toMdast(cover, 0, object, rest),
          centerSerializer.toMdast(center, 1, object, rest)
        ]
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [documentRule]
  })

  const newDocument = ({ title }) =>
    serializer.deserialize(
      parse(
        `<section><h6>TITLE</h6>

# ${title}

<hr/></section>

<section><h6>CENTER</h6>

Ladies and Gentlemen,

<hr/></section>
`
      )
    )

  return {
    TYPE,
    helpers: {
      serializer,
      newDocument
    }
  }
}
