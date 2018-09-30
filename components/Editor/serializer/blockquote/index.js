import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export const getSubmodules = options => {
  const [paragraphModule, captionModule] = options.subModules
  return {
    paragraphModule,
    captionModule
  }
}

export const fromMdast = options => {
  const { paragraphModule, captionModule } = getSubmodules(options)
  return (node, index, parent, rest) => {
    const caption = node.children.filter(
      captionModule.rule.matchMdast
    )
    const blockquotes = node.children.filter(
      paragraphModule.rule.matchMdast
    )
    const serializedBlockQuotes = blockquotes.length
      ? paragraphModule.helpers.serializer.fromMdast(
        blockquotes.map(n => ({
          ...n,
          children:
              n.children && n.children.length
                ? n.children[0].children
                : [
                  {
                    type: 'text',
                    value: ''
                  }
                ]
        }))
      )
      : [{ object: 'block', type: paragraphModule.TYPE }]

    const serializedCaption = captionModule.helpers.serializer.fromMdast(
      caption.length
        ? caption
        : [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: '' },
              {
                type: 'emphasis',
                children: [{ type: 'text', value: '' }]
              }
            ]
          }
        ]
    )

    return {
      object: 'block',
      type: options.TYPE,
      data: node.data,
      nodes: [...serializedBlockQuotes, ...serializedCaption]
    }
  }
}

export const toMdast = options => {
  const { paragraphModule, captionModule } = getSubmodules(options)

  return (node, index, parent, rest) => {
    const blockquotes = node.nodes.filter(
      n => n.type === 'blockQuoteText'
    )
    const caption = node.nodes.filter(n => n.type === 'caption')
    return {
      type: 'zone',
      identifier: 'BLOCKQUOTE',
      children: [
        ...paragraphModule.helpers.serializer
          .toMdast(blockquotes)
          .map(n => ({ type: 'blockquote', children: [n] })),
        ...captionModule.helpers.serializer.toMdast(caption)
      ]
    }
  }
}

export const getSerializer = options => {
  return new MarkdownSerializer({
    rules: [
      {
        match: matchBlock(options.TYPE),
        matchMdast: options.rule.matchMdast,
        fromMdast: fromMdast(options),
        toMdast: toMdast(options)
      }
    ]
  })
}

export default options => ({
  helpers: {
    serializer: getSerializer(options)
  }
})
