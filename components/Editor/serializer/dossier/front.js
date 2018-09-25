import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export const getSubmodules = options => {
  const [
    introTeaserModule,
    articleCollectionModule,
    outroTextModule
  ] = options.subModules
  return {
    introTeaserModule,
    articleCollectionModule,
    outroTextModule
  }
}

export const getData = data => ({
  url: null,
  textPosition: 'topleft',
  color: '',
  bgColor: '',
  center: false,
  image: null,
  kind: 'editorial',
  titleSize: 'standard',
  teaserType: 'frontImage',
  reverse: false,
  portrait: true,
  showImage: true,
  onlyImage: false,
  ...data || {}
})
export const fromMdast = options => {
  const { TYPE } = options
  const { introTeaserModule, articleCollectionModule, outroTextModule } = getSubmodules(options)

  return (node, index, parent, rest) => {
    return ({
      kind: 'block',
      type: TYPE,
      data: getData(node.data),
      nodes: [
        introTeaserModule.helpers.serializer.fromMdast(node.children[0], 0, node, rest),
        articleCollectionModule.helpers.serializer.fromMdast(node.children[1], 1, node, rest),
        outroTextModule.helpers.serializer.fromMdast(
          node.children[2] || { type: 'paragraph', children: [{ type: 'text', value: '' }] },
          2, node, rest)
      ]
    })
  }
}

export const toMdast = options => {
  const { introTeaserModule, articleCollectionModule, outroTextModule } = getSubmodules(options)

  return (node, index, parent, rest) => {
    return ({
      type: 'zone',
      identifier: 'TEASER',
      data: node.data,
      children: [
        introTeaserModule.helpers.serializer.toMdast(node.nodes[0], 0, node, rest),
        articleCollectionModule.helpers.serializer.toMdast(node.nodes[1], 1, node, rest),
        outroTextModule.helpers.serializer.toMdast(node.nodes[2], 2, node, rest)
      ]
    })
  }
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
