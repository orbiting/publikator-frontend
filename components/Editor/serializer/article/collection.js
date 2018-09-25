import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export const getData = data => ({
  membersOnly: true,
  unauthorizedText: '',
  ...(data || {})
})

export const getSubmodules = options => {
  const [
    headerModule,
    articleGroupModule
  ] = options.subModules
  return {
    headerModule,
    articleGroupModule
  }
}

export const fromMdast = options => {
  const { TYPE } = options
  const { headerModule, articleGroupModule } = getSubmodules(options)

  return (node, index, parent, rest) => ({
    kind: 'block',
    type: TYPE,
    data: getData(node.data),
    nodes: [
      headerModule.helpers.serializer.fromMdast(node.children[0], 0, node, rest),
      articleGroupModule.helpers.serializer.fromMdast(node.children[1], 1, node, rest)
    ]
  })
}

export const toMdast = options => {
  const { headerModule, articleGroupModule } = getSubmodules(options)

  return (node, index, parent, rest) => ({
    type: 'zone',
    identifier: 'ARTICLECOLLECTION',
    data: {
      ...getData(node.data)
    },
    children: [
      headerModule.helpers.serializer.toMdast(node.nodes[0], 0, node, rest),
      articleGroupModule.helpers.serializer.toMdast(node.nodes[1], 1, node, rest)
    ]
  })
}

export const getSerializer = options => {
  return new MarkdownSerializer({ rules: [
    {
      matchMdast: options.rule.matchMdast,
      match: matchBlock(options.TYPE),
      fromMdast: fromMdast(options),
      toMdast: toMdast(options)
    }
  ] })
}

export default options => ({
  helpers: {
    serializer: getSerializer(options)
  }
})
