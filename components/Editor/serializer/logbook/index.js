import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

export const getSubmodules = options => {
  const [titleModule, creditsModule] = options.subModules
  return {
    titleModule,
    creditsModule
  }
}

const fromMdast = options => {
  const { titleModule, creditsModule } = getSubmodules(options)
  return (node, index, parent, rest) => {
    const title = node.children.filter(titleModule.rule.matchMdast)
    const credits = node.children.filter(creditsModule.rule.matchMdast)

    const deserializedTitle = (title && titleModule.helpers.serializer.fromMdast(title)) ||
      [{
        object: 'block',
        type: titleModule.TYPE
      }]

    const deserializedCredits = (credits && creditsModule.helpers.serializer.fromMdast(credits)) ||
      [{
        object: 'block',
        type: creditsModule.TYPE
      }]

    return {
      object: 'block',
      type: options.TYPE,
      data: node.data,
      nodes: [
        ...deserializedTitle,
        ...deserializedCredits
      ]
    }
  }
}

const toMdast = options => {
  const { titleModule, creditsModule } = getSubmodules(options)
  return (node, index, parent, rest) => {
    const [title, credits] = node.nodes

    return {
      type: 'zone',
      identifier: 'LOGBOOK',
      children: [
        titleModule.helpers.serializer.toMdast(title),
        creditsModule.helpers.serializer.toMdast(credits)
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
