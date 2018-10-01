import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'

const selectableBlocks = [
  isBlock('infoBoxTitle'),
  isBlock('infoBoxText')
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

  const chart = document.getClosest(
    value.startBlock.key,
    isBlock('chart')
  )

  if (!chart) {
    return
  }

  if (
    isBlock('chartLead', value.startBlock) ||
    isBlock('chartNote', value.startBlock)
  ) {
    return focusNext(change)
  }

  const nextBlock = document.getNextBlock(value.startBlock.key)

  if (isBlock('chartTitle', value.startBlock)) {
    if (isBlock('chartLead', nextBlock)) {
      return focusNext(change)
    }
    return focusNext(
      insertBlockAfter(
        change,
        Block.create({ type: 'chartLead' }),
        value.startBlock
      )
    )
  }

  if (isBlock('chartCanvas', value.startBlock)) {
    if (isBlock('chartNote', nextBlock)) {
      return focusNext(change)
    }
    return focusNext(
      insertBlockAfter(
        change,
        Block.create({ type: 'chartNote' }),
        value.startBlock
      )
    )
  }
}

const onDeleteOrBackspace = (_, change) => {
  const {
    value,
    value: { selection }
  } = change

  if (
    selection.isExpanded &&
    selectableBlocks.some(
      f => f(value.startBlock) || f(value.endBlock)
    )
  ) {
    return change.moveToStart()
  }

  if (isBlock('chartCanvas', value.startBlock)) {
    return change
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

  if (isBlock('chartTitle', value.startBlock)) {
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

  if (isBlock('chartTitle', value.startBlock)) {
    const nextBlock = document.getNextBlock(value.startBlock.key)
    if (
      isBlock('chartLead', nextBlock) &&
      nextBlock.text.trim() === ''
    ) {
      return
    }
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
