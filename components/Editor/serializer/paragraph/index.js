import MarkdownSerializer from 'slate-mdast-serializer'
import { matchBlock } from '../utils'

const removeMarksFromSpace = node => {
  return !node.leaves
    ? node
    : {
      ...node,
      leaves: node.leaves.map(
        leaf => {
          return leaf.text &&
        leaf.text.trim() === '' &&
        leaf.marks &&
        leaf.marks.length
            ? { ...leaf, marks: [] }
            : leaf
        }
      )
    }
}

export default ({ rule, subModules, TYPE }) => {
  const {
    mdastPlaceholder
  } = rule.editorOptions || {}

  const inlineSerializer = new MarkdownSerializer({
    rules: subModules.reduce(
      (a, m) => a.concat(
        m.helpers && m.helpers.serializer &&
        m.helpers.serializer.rules
      ),
      []
    ).filter(Boolean).concat({
      matchMdast: (node) => node.type === 'break',
      fromMdast: () => ({
        object: 'text',
        leaves: [{ object: 'leaf', text: '\n', marks: [] }]
      })
    })
  })

  const paragraph = {
    match: matchBlock(TYPE),
    matchMdast: rule.matchMdast || ((node) => node.type === 'paragraph'),
    fromMdast: (node, index, parent, rest) => {
      let children = node.children
      if (mdastPlaceholder) {
        if (
          children &&
          children.length === 1 &&
          children[0].type === 'text' &&
          children[0].value === mdastPlaceholder
        ) {
          children = [{ type: 'text', value: '' }]
        }
      }

      return {
        object: 'block',
        type: TYPE,
        nodes: inlineSerializer.fromMdast(children, 0, node, rest)
      }
    },
    toMdast: (object, index, parent, rest) => {
      let children = inlineSerializer.toMdast(
        object.nodes.map(removeMarksFromSpace),
        0,
        object,
        rest
      )

      if (mdastPlaceholder) {
        if (
          !children ||
          !children.length ||
          (
            children.length === 1 &&
            children[0].type === 'text' &&
            !(children[0].value || '').trim()
          )
        ) {
          children = [{ type: 'text', value: mdastPlaceholder }]
        }
      }

      return {
        type: 'paragraph',
        children: children
      }
    }
  }

  const serializer = new MarkdownSerializer({
    rules: [
      paragraph
    ]
  })

  return {
    TYPE,
    rule,
    helpers: {
      serializer
    }
  }
}
