import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'
import shortId from 'shortid'

export const getData = data => ({
  columns: 2,
  id: (data && data.id) || shortId(),
  ...data || {}
})

export const fromMdast = ({
  TYPE,
  subModules
}) => (node,
  index,
  parent,
  {
    visitChildren,
    context
  }
) => {
  const [ teaserModule ] = subModules

  const teaserSerializer = teaserModule.helpers.serializer

  const { module, ...data } = getData(node.data)

  const result = {
    kind: 'block',
    type: TYPE,
    data: {
      ...data,
      module: 'teasergroup'
    },
    nodes: node.children.map(
      v => teaserSerializer.fromMdast(v)
    )
  }
  return result
}

export const toMdast = ({
  TYPE,
  subModules
}) => (
  node,
  index,
  parent,
  {
    visitChildren,
    context
  }
) => {
  const [ teaserModule ] = subModules

  const mdastChildren = node.nodes.map(v =>
    teaserModule.helpers.serializer.toMdast(v)
  )
  const { module, ...data } = node.data
  return {
    type: 'zone',
    identifier: 'TEASERGROUP',
    children: mdastChildren,
    data
  }
}

const getSerializer = options => {
  return new MarkdownSerializer({
    rules: [
      {
        match: matchBlock(options.TYPE),
        matchMdast:
          options.rule.matchMdast,
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
