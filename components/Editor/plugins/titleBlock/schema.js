import { Block } from 'slate'
import { isBlock } from '../../base/lib'

import {
  focusPrevious,
  insertBlockBefore
} from '../../base/lib/changes'

export default {
  blocks: {
    lead: {
      nodes: [{ match: { object: 'text' } }],
      normalize: (change, { child }) => {
        return change.unwrapInlineByKey(child.key, { type: 'link' })
      }
    },
    titleBlock: {
      nodes: [
        {
          match: { type: 'title' },
          min: 1,
          max: 1
        },
        {
          match: { type: 'subject' },
          min: 0,
          max: 1
        },
        {
          match: { type: 'lead' },
          min: 0,
          max: 1
        },
        {
          match: { type: 'credit' },
          min: 1,
          max: 1
        }
      ],
      normalize (change, error) {
        const { code, node, child, index } = error
        switch (code) {
          case 'child_required':
            if (index > 0) {
              return change.insertNodeByKey(
                node.key,
                node.nodes.size,
                Block.create({ type: 'credit' })
              )
            }
            break
          case 'child_unknown':
            if (isBlock('credit', child)) {
              const nextBlock = change.value.document.getNextBlock(
                child.key
              )
              return change.undo().moveToStartOfNode(nextBlock)
            }
            break
          case 'child_type_invalid':
            if (index === 0) {
              return change
                .call(
                  insertBlockBefore,
                  Block.create({ type: 'title' }),
                  child
                )
                .call(focusPrevious)
            }

            if (isBlock('title', child)) {
              return change.setNodeByKey(child.key, {
                type: 'subject'
              })
            }

            if (isBlock('subject', child)) {
              const nextBlock = change.value.document.getNextBlock(
                child.key
              )
              if (isBlock('lead', nextBlock)) {
                return change.undo().moveToStartOfNode(nextBlock)
              }
              return change.setNodeByKey(child.key, {
                type: 'lead'
              })
            }

            if (isBlock('lead', child)) {
              const nextBlock = change.value.document.getNextBlock(
                child.key
              )
              if (nextBlock.text.trim() === '') {
                return change
                  .setNodeByKey(child.key, { type: 'credit' })
                  .removeNodeByKey(nextBlock.key)
              }
              return change.undo().moveToStartOfNode(nextBlock)
            }
            break
        }
        console.log(code, node, child, index)
      }
    }
  }
}
