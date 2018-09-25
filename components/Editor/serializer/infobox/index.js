import MarkdownSerializer from 'slate-mdast-serializer'

import { matchBlock } from '../utils'

export default ({ rule, subModules, TYPE }) => {
  const titleModule = subModules.find(m => m.name === 'headline')
  if (!titleModule) {
    throw new Error('Missing headline submodule')
  }

  const paragraphModule = subModules.find(m => m.name === 'paragraph')
  if (!paragraphModule) {
    throw new Error('Missing paragraph submodule')
  }

  const figureModule = subModules.find(m => m.name === 'figure')

  const orderedSubModules = [
    titleModule,
    figureModule,
    paragraphModule
  ].filter(Boolean)

  const childSerializer = new MarkdownSerializer({
    rules: orderedSubModules.reduce(
      (a, m) => a.concat(
        m.helpers && m.helpers.serializer &&
        m.helpers.serializer.rules
      ),
      []
    ).filter(Boolean)
  })

  const serializerRule = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      return {
        object: 'block',
        type: TYPE,
        data: node.data,
        nodes: childSerializer.fromMdast(node.children, 0, node, rest)
      }
    },
    toMdast: (object, index, parent, rest) => {
      return {
        type: 'zone',
        identifier: TYPE,
        data: object.data,
        children: childSerializer.toMdast(object.nodes, 0, object, rest)
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      serializerRule
    ]
  })

  return {
    TYPE,
    helpers: {
      serializer
    }
  }
}
