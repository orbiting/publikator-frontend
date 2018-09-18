import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  insertBlockBefore,
  removeBlock,
} from '../../Editor/lib/changes'

import { isBlock } from '../../Editor/lib'

const onEnter = (_, change) => {
  const {
    value,
    value: { selection, document },
  } = change
  let c

  if (
    selection.isExpanded &&
    (isBlock('captionText', value.startBlock) ||
      isBlock(
        'captionByline',
        value.startBlock
      ) ||
      isBlock('captionText', value.endBlock) ||
      isBlock('captionByline', value.endBlock))
  ) {
    return change.moveToStart()
  }

  if (selection.isCollapsed) {
    if (
      isBlock('captionText', value.startBlock)
    ) {
      if (
        isBlock(
          'captionByline',
          document.getNextBlock(
            value.startBlock.key
          )
        )
      ) {
        return focusNext(change)
      } else {
        c = insertBlockAfter(
          change,
          Block.create({
            type: 'captionByline',
          }),
          value.startBlock
        )
        return focusNext(c)
      }
    }
    if (
      isBlock('captionByline', value.startBlock)
    ) {
      if (
        selection.start.isAtStartOfNode(
          value.startBlock
        ) &&
        !isBlock(
          'captionText',
          document.getPreviousBlock(
            value.startBlock.key
          )
        )
      ) {
        c = insertBlockBefore(
          change,
          Block.create({
            type: 'captionText',
          }),
          value.startBlock
        )
        return focusPrevious(c)
      }
      return focusNext(change)
    }
  }
}

export const onDeleteOrBackspace = (
  _,
  change
) => {
  const {
    value,
    value: { selection, document },
  } = change
  let n

  if (
    value.startBlock === value.endBlock &&
    selection.isExpanded
  ) {
    return
  }

  if (
    selection.isExpanded &&
    (isBlock('captionText', value.startBlock) ||
      isBlock(
        'captionByline',
        value.startBlock
      ) ||
      isBlock('captionText', value.endBlock) ||
      isBlock('captionByline', value.endBlock))
  ) {
    return change.moveToStart()
  }

  n = document.getParent(value.startBlock.key)
  if (
    isBlock('caption', n) &&
    n.text.trim() === '' &&
    n.nodes.size === 1
  ) {
    return removeBlock(change, n)
  }
}

export const onBackspace = (_, change) => {
  let handled = onDeleteOrBackspace(_, change)
  if (handled) {
    return handled
  }

  const {
    value,
    value: { selection, document },
  } = change
  let n
  let c

  if (
    selection.start.isAtStartOfNode(
      value.startBlock
    )
  ) {
    n = document.getParent(value.startBlock.key)
    if (
      isBlock('caption', n) &&
      n.nodes.size === 1
    ) {
      return focusPrevious(change)
    }
    if (
      isBlock('caption', n) &&
      n.nodes.size === 1
    ) {
      return focusPrevious(change)
    }

    if (
      isBlock('captionText', value.startBlock) &&
      value.startBlock.text.trim() === ''
    ) {
      c = removeBlock(change, value.startBlock)
      return focusNext(c)
    }

    n = document.getPreviousBlock(
      value.startBlock.key
    )
    if (
      (isBlock('captionByline', n) ||
        isBlock('captionText', n)) &&
      !isBlock('captionByline', value.startBlock)
    ) {
      return focusPrevious(change)
    }
  }
}

export const onDelete = (_, change) => {
  let handled = onDeleteOrBackspace(_, change)
  if (handled) {
    return handled
  }

  const {
    value,
    value: { selection, document },
  } = change

  if (
    selection.end.isAtEndOfNode(value.endBlock) &&
    (isBlock('captionByline', value.endBlock) ||
      isBlock('captionText', value.endBlock)) &&
    !isBlock(
      'captionByline',
      document.getNextBlock(value.endBlock.key)
    )
  ) {
    return change
  }
}

export default (event, change) => {
  if (event.key === 'Enter') {
    return onEnter(event, change)
  }
  if (event.key === 'Backspace') {
    return onBackspace(event, change)
  }
  if (event.key === 'Delete') {
    return onDelete(event, change)
  }
}
