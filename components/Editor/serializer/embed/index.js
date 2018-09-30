import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'
import { findOrCreate } from '../utils/serialization'

const fromMdast = ({ TYPE }) => node => {
  const deepNodes = node.children.reduce(
    (children, child) =>
      children.concat(child).concat(child.children),
    []
  )
  const link = findOrCreate(deepNodes, {
    type: 'link'
  })
  return {
    object: 'block',
    type: TYPE,
    isVoid: true,
    data: {
      ...node.data,
      url: link.url
    }
  }
}

const toMdast = ({ TYPE }) => node => {
  const { url, ...data } = node.data
  return {
    type: 'zone',
    identifier:
      TYPE === 'twitterEmbed' ? 'EMBEDTWITTER' : 'EMBEDVIDEO',
    data,
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url,
            children: [
              {
                type: 'text',
                value: url
              }
            ]
          }
        ]
      }
    ]
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

const embedModule = options => {
  return {
    helpers: {
      serializer: getSerializer(options)
    }
  }
}

export const createEmbedVideoModule = embedModule

export const createEmbedTwitterModule = embedModule
