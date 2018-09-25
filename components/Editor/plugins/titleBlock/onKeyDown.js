import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  removeBlock
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'

const selectableBlocks = [
  isBlock('title'),
  isBlock('subject'),
  isBlock('lead'),
  isBlock('credit')
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

  const nextBlock = document.getNextBlock(
    value.startBlock.key
  )

  if (
    isBlock('title', value.startBlock) &&
    !isBlock('subject', nextBlock)
  ) {
    return focusNext(
      insertBlockAfter(
        change,
        Block.create({
          type: 'subject'
        }),
        value.startBlock
      )
    )
  }
  if (
    isBlock('subject', value.startBlock) &&
    !isBlock('lead', nextBlock)
  ) {
    return focusNext(
      insertBlockAfter(
        change,
        Block.create({
          type: 'lead'
        }),
        value.startBlock
      )
    )
  }

  if (
    selectableBlocks.some(f =>
      f(value.startBlock)
    )
  ) {
    return focusNext(change)
  }
}

const onDeleteOrBackspace = (_, change) => {
  const {
    value,
    value: { selection }
  } = change

  if (
    selection.isExpanded &&
    value.startBlock === value.endBlock
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
}

const onBackspace = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (!selection.isCollapsed) {
    return
  }

  if (
    !selection.start.isAtStartOfNode(
      value.startBlock
    )
  ) {
    return
  }

  const previousBlock = document.getPreviousBlock(
    value.startBlock.key
  )

  if (isBlock('title', value.startBlock)) {
    return focusPrevious(change)
  }

  if (isBlock('subject', value.startBlock)) {
    if (value.startBlock.text.trim() !== '') {
      return focusPrevious(change)
    }
    return removeBlock(change, value.startBlock)
  }

  if (isBlock('lead', value.startBlock)) {
    if (value.startBlock.text.trim() !== '') {
      return focusPrevious(change)
    }
    return removeBlock(change, value.startBlock)
  }

  if (isBlock('credit', value.startBlock)) {
    if (isBlock('title', previousBlock)) {
      return focusPrevious(change)
    }

    if (
      isBlock('lead', previousBlock) ||
      isBlock('subject', previousBlock)
    ) {
      if (previousBlock.text.trim() !== '') {
        return focusPrevious(change)
      }

      return removeBlock(change, previousBlock)
    }
  }

  if (isBlock('credit', previousBlock)) {
    return focusPrevious(change)
  }
}

const onDelete = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (!selection.isCollapsed) {
    return
  }

  if (
    !selection.end.isAtEndOfNode(value.endBlock)
  ) {
    return
  }

  if (
    isBlock('lead', value.endBlock) ||
    isBlock('credit', value.endBlock)
  ) {
    return change
  }

  const nextBlock = document.getNextBlock(
    value.endBlock.key
  )

  if (
    isBlock('lead', nextBlock) &&
    nextBlock.text.trim() !== ''
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
