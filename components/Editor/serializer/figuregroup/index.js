import MarkdownSerializer from 'slate-mdast-serializer'
import { Block } from 'slate'
import { matchBlock } from '../utils'

export const getData = data => ({
  columns: 2,
  module: 'figuregroup',
  ...(data || {})
})

export const getNewBlock = options => () => {
  const [figureModule, captionModule] = options.subModules

  return Block.create({
    type: options.TYPE,
    data: getData(),
    nodes: [
      figureModule.helpers.newBlock(),
      figureModule.helpers.newBlock(),
      Block.create({ type: captionModule.TYPE })
    ]
  })
}

export const fromMdast = ({ TYPE, subModules }) => node => {
  const [figureModule, captionModule] = subModules

  const figureSerializer = figureModule.helpers.serializer

  const data = getData(node.data)

  const caption = captionModule.helpers.serializer.fromMdast(
    node.children[node.children.length - 1]
  )

  const figures = (caption
    ? node.children.slice(0, -1)
    : node.children
  ).map(v => ({
    ...figureSerializer.fromMdast(v),
    type: 'figureGroupFigure'
  }))
  const nodes = figures.concat(caption)
  return {
    object: 'block',
    type: TYPE,
    data,
    nodes
  }
}

export const toMdast = ({ subModules }) => node => {
  const [figureModule, captionModule] = subModules

  const caption = captionModule.helpers.serializer.toMdast(
    node.nodes[node.nodes.length - 1]
  )

  const nodes = caption ? node.nodes.slice(0, -1) : node.nodes

  const mdastChildren = nodes
    .map(v => ({ ...v, type: figureModule.TYPE }))
    .map(v => figureModule.helpers.serializer.toMdast(v))
    .concat(caption)

  return {
    type: 'zone',
    identifier: 'FIGUREGROUP',
    children: mdastChildren,
    data: node.data
  }
}

const getSerializer = options =>
  new MarkdownSerializer({
    rules: [
      {
        match: matchBlock(options.TYPE),
        matchMdast: options.rule.matchMdast,
        fromMdast: fromMdast(options),
        toMdast: toMdast(options)
      }
    ]
  })

export default options => ({
  helpers: {
    serializer: getSerializer(options)
  }
})
