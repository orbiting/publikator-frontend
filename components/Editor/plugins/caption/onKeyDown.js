import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  insertBlockBefore,
  removeBlock
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'

const selectableBlocks = [
  isBlock('captionText'),
  isBlock('captionByline')
]

const onEnter = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (
    selection.isExpanded &&
    selectableBlocks.some(
      f =>
        f(value.startBlock) || f(value.endBlock)
    )
  ) {
    return change.moveToEnd()
  }

  if (!selection.isCollapsed) {
    return
  }

  if (isBlock('captionText', value.startBlock)) {
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
      return focusNext(
        insertBlockAfter(
          change,
          Block.create({
            type: 'captionByline'
          }),
          value.startBlock
        )
      )
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
      return focusPrevious(
        insertBlockBefore(
          change,
          Block.create({
            type: 'captionText'
          }),
          value.startBlock
        )
      )
    }
    return focusNext(change)
  }
}

export const onDeleteOrBackspace = (
  _,
  change
) => {
  const {
    value,
    value: { selection, document }
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
    selectableBlocks.some(
      f =>
        f(value.startBlock) || f(value.endBlock)
    )
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
  const {
    value,
    value: { selection, document }
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
  const {
    value,
    value: { selection, document }
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
    return (
      onDeleteOrBackspace(event, change) ||
      onBackspace(event, change)
    )
  }
  if (event.key === 'Delete') {
    return (
      onDeleteOrBackspace(event, change) ||
      onDelete(event, change)
    )
  }
}
