import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  insertBlockBefore,
  removeBlock
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'

import { getNewPullQuoteFigure } from './lib'

const selectableBlocks = [
  isBlock('pullQuoteText'),
  isBlock('pullQuoteCite')
]

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

  const pullQuote = document.getClosest(
    value.startBlock.key,
    isBlock('pullQuote')
  )

  if (!pullQuote) {
    return
  }

  const nextBlock = document.getNextBlock(value.startBlock.key)

  if (isBlock('pullQuoteText', value.startBlock)) {
    if (selection.start.isAtStartOfNode(value.startBlock)) {
      const previousBlock = document.getPreviousBlock(
        value.startBlock.key
      )
      if (!isBlock('captionByline', previousBlock)) {
        return focusPrevious(
          insertBlockBefore(
            change,
            getNewPullQuoteFigure(),
            value.startBlock
          )
        )
      }
    }

    if (isBlock('pullQuoteCite', nextBlock)) {
      return focusNext(change)
    }

    return focusNext(
      insertBlockAfter(
        change,
        Block.create({ type: 'pullQuoteCite' }),
        value.startBlock
      )
    )
  }

  if (!isBlock('pullQuoteCite', value.startBlock)) {
    return focusNext(change)
  }
}

const onDeleteOrBackspace = (_, change) => {
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
    return change.moveToStart()
  }

  if (!selection.isCollapsed) {
    return
  }

  const pullQuote = document.getClosest(
    value.startBlock.key,
    isBlock('pullQuote')
  )

  if (!pullQuote) {
    return
  }

  const parent = document.getParent(value.startBlock.key)

  if (
    isBlock('figureImage', value.startBlock) &&
    isBlock('pullQuoteFigure', parent) &&
    parent.text.trim() === ''
  ) {
    return removeBlock(change, parent)
  }

  if (!selection.start.isAtStartOfNode(value.startBlock)) {
    return
  }

  if (pullQuote.text.trim() === '' && pullQuote.nodes.size === 1) {
    return removeBlock(change, pullQuote)
  }
}

const onBackspace = (_, change) => {
  const {
    value,
    value: { selection }
  } = change

  if (!selection.isCollapsed) {
    return
  }

  if (!selection.start.isAtStartOfNode(value.startBlock)) {
    return
  }

  if (isBlock('pullQuoteText', value.startBlock)) {
    return focusPrevious(change)
  }

  if (isBlock('pullQuoteCite', value.startBlock)) {

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

  if (isBlock('pullQuoteText', value.endBlock)) {
    return change
  }

  if (isBlock('pullQuoteCite', value.endBlock)) {
    return change
  }

  const nextBlock = document.getNextBlock(value.endBlock.key)

  if (
    isBlock('pullQuoteCite', nextBlock) &&
    nextBlock.text.trim() === ''
  ) {
    return removeBlock(change, nextBlock)
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
