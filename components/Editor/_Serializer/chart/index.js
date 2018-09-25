import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export default ({ rule, subModules, TYPE }) => {
  const canvasModule = subModules.find(m => m.name === 'chartCanvas')
  if (!canvasModule) {
    throw new Error('Missing chartCanvas submodule')
  }

  const CANVAS_TYPE = canvasModule.TYPE

  const childSerializer = new MarkdownSerializer({
    rules: subModules.reduce(
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
        kind: 'block',
        type: TYPE,
        data: node.data,
        nodes: childSerializer.fromMdast(node.children, 0, node, rest)
      }
    },
    toMdast: (object, index, parent, rest) => {
      const canvas = object.nodes.find(matchBlock(CANVAS_TYPE))
      return {
        type: 'zone',
        identifier: 'CHART',
        data: canvas.data.config,
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
