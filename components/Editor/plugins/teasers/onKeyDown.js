import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  insertBlockBefore,
  removeBlock
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'
import { isTeaserElement, isTeaserTitle } from './lib'

const selectableBlocks = [isTeaserElement]

const onEnter = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (
    selection.isExpanded &&
    selectableBlocks.some(
      f => f(value.startBlock) || f(value.endBlock)
    )
  ) {
    return change.moveToEnd()
  }

  if (!selection.isCollapsed) {
    return
  }

  const nextBlock = document.getNextBlock(value.startBlock.key)

  if (isTeaserTitle(value.startBlock)) {
    if (value.selection.start.isAtStartOfNode(value.startBlock)) {
      const previousBlock = document.getPreviousBlock(
        value.startBlock.key
      )
      if (!previousBlock) {
        return focusPrevious(
          insertBlockBefore(
            change,
            Block.create({
              type: 'frontFormat'
            }),
            value.startBlock
          )
        )
      }
    }

    if (!isBlock('frontSubject', nextBlock)) {
      return focusNext(
        insertBlockAfter(
          change,
          Block.create({
            type: 'frontSubject'
          }),
          value.startBlock
        )
      )
    }
  }
  if (
    isBlock('frontSubject', value.startBlock) &&
    !isBlock('frontLead', nextBlock)
  ) {
    return focusNext(
      insertBlockAfter(
        change,
        Block.create({
          type: 'frontLead'
        }),
        value.startBlock
      )
    )
  }

  if (selectableBlocks.some(f => f(value.startBlock))) {
    return focusNext(change)
  }
}

const onDeleteOrBackspace = (_, change) => {
  const {
    value,
    value: { selection }
  } = change

  if (selection.isExpanded && value.startBlock === value.endBlock) {
    return
  }

  if (
    selection.isExpanded &&
    selectableBlocks.some(
      f => f(value.startBlock) || f(value.endBlock)
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

  if (!selection.start.isAtStartOfNode(value.startBlock)) {
    return
  }

  const previousBlock = document.getPreviousBlock(
    value.startBlock.key
  )

  if (isTeaserTitle(value.startBlock)) {
    return focusPrevious(change)
  }

  if (isBlock('frontSubject', value.startBlock)) {
    if (value.startBlock.text.trim() !== '') {
      return focusPrevious(change)
    }
    return removeBlock(change, value.startBlock)
  }

  if (isBlock('frontLead', value.startBlock)) {
    if (value.startBlock.text.trim() !== '') {
      return focusPrevious(change)
    }
    return removeBlock(change, value.startBlock)
  }

  if (isBlock('frontCredit', value.startBlock)) {
    if (isTeaserTitle(previousBlock)) {
      return focusPrevious(change)
    }

    if (
      isBlock('frontLead', previousBlock) ||
      isBlock('frontSubject', previousBlock)
    ) {
      if (previousBlock.text.trim() !== '') {
        return focusPrevious(change)
      }

      return removeBlock(change, previousBlock)
    }
  }

  if (isBlock('frontCredit', previousBlock)) {
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

  if (!selection.end.isAtEndOfNode(value.endBlock)) {
    return
  }

  if (
    isBlock('frontLead', value.endBlock) ||
    isBlock('frontCredit', value.endBlock)
  ) {
    return change
  }

  const nextBlock = document.getNextBlock(value.endBlock.key)

  if (
    isBlock('frontLead', nextBlock) &&
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
      onDeleteOrBackspace(event, change) || onBackspace(event, change)
    )
  }
  if (event.key === 'Delete') {
    return (
      onDeleteOrBackspace(event, change) || onDelete(event, change)
    )
  }
}
