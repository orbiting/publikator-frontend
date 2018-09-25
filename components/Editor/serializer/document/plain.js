import { parse } from '@orbiting/remark-preset'

import { swissTime } from '../../../../lib/utils/format'
import MarkdownSerializer from 'slate-mdast-serializer'

const pubDateFormat = swissTime.format('%-d. %B %Y')

export default ({ rule, subModules, TYPE }) => {
  const centerModule = subModules.find(m => m.name === 'center')
  if (!centerModule) {
    throw new Error('Missing center submodule')
  }
  const titleModule = subModules.find(m => m.name === 'title')

  const childSerializer = new MarkdownSerializer({
    rules: subModules.reduce(
      (a, m) => a.concat(
        m.helpers && m.helpers.serializer &&
        m.helpers.serializer.rules
      ),
      []
    ).filter(Boolean)
  })

  const documentRule = {
    match: object => object.object === 'document',
    matchMdast: rule.matchMdast,
    fromMdast: (node, index, parent, rest) => {
      node.children.forEach((child, index) => {
        // ToDo: match against rule.rules.matchMdast and wrap in center if no match
      })

      const documentNode = {
        data: node.meta,
        object: 'document',
        nodes: childSerializer.fromMdast(node.children, 0, node, {
          context: {
            ...rest.context,
            // pass format to title through context
            format: node.format
          }
        })
      }

      return {
        document: documentNode,
        object: 'value'
      }
    },
    toMdast: (object, index, parent, rest) => {
      return {
        type: 'root',
        meta: object.data,
        children: childSerializer.toMdast(object.nodes, 0, object, rest)
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      documentRule
    ]
  })

  const newDocument = ({ title, template }, me) => serializer.deserialize(parse(
    `---
template: ${template}
---
${titleModule ? `
<section><h6>${titleModule.TYPE}</h6>

# ${title}

Lead

Von ${me ? `[${me.name}](/~${me.id})` : '[Autor](<>)'} (Text) und Kollaborator, ${pubDateFormat(new Date())}

<hr/></section>

` : ''}
<section><h6>${centerModule.TYPE}</h6>

${titleModule ? 'Text' : title}

<hr/></section>
`
  ))

  return {
    TYPE,
    helpers: {
      serializer,
      newDocument
    }
  }
}
