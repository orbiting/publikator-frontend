import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  removeBlock
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'

import { getNewInfoboxFigure } from './lib'

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
      f =>
        f(value.startBlock) || f(value.endBlock)
    )
  ) {
    if (
      value.blocks.every(isBlock('infoBoxText'))
    ) {
      return
    }

    return change.moveToEnd()
  }

  if (!selection.isCollapsed) {
    return
  }

  const infoBox = document.getClosest(
    value.startBlock.key,
    isBlock('infoBox')
  )

  if (!infoBox) {
    return
  }

  const nextBlock = document.getNextBlock(
    value.startBlock.key
  )

  if (isBlock('infoBoxTitle', value.startBlock)) {
    if (isBlock('figureImage', nextBlock)) {
      return focusNext(change)
    }
    return focusNext(
      insertBlockAfter(
        change,
        getNewInfoboxFigure(),
        value.startBlock
      )
    )
  }

  if (
    isBlock('captionByline', value.startBlock)
  ) {
    if (isBlock('infoBoxText', nextBlock)) {
      return focusNext(change)
    }

    return focusNext(
      insertBlockAfter(
        change,
        Block.create({
          type: 'infoBoxText'
        }),
        infoBox.nodes.last()
      )
    )
  }

  if (!isBlock('infoBoxText', value.startBlock)) {
    return
  }

  if (
    !selection.start.isAtStartOfNode(
      value.startBlock
    ) ||
    value.startBlock.text.trim() !== ''
  ) {
    return
  }

  if (infoBox.nodes.last() === value.startBlock) {
    return focusNext(
      removeBlock(change, value.startBlock)
    )
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
      f =>
        f(value.startBlock) || f(value.endBlock)
    )
  ) {
    if (
      value.blocks.every(
        isBlock('infoBoxText')
      ) ||
      value.startBlock === value.endBlock
    ) {
      return
    }
    return change.moveToStart()
  }

  if (!selection.isCollapsed) {
    return
  }

  const infoBox = document.getClosest(
    value.startBlock.key,
    isBlock('infoBox')
  )

  if (!infoBox) {
    return
  }

  const parent = document.getParent(
    value.startBlock.key
  )

  if (
    isBlock('figureImage', value.startBlock) &&
    isBlock('infoBoxFigure', parent) &&
    parent.text.trim() === ''
  ) {
    return removeBlock(change, parent)
  }

  if (
    !selection.start.isAtStartOfNode(
      value.startBlock
    )
  ) {
    return
  }

  if (
    infoBox.text.trim() === '' &&
    infoBox.nodes.size === 1
  ) {
    return removeBlock(change, infoBox)
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

  if (isBlock('infoBoxTitle', value.startBlock)) {
    return focusPrevious(change)
  }

  if (
    !isBlock('infoBoxText', value.startBlock) ||
    value.startBlock.text.trim() !== ''
  ) {
    return
  }

  const previousBlock = document.getPreviousBlock(
    value.startBlock.key
  )
  if (
    isBlock('captionText', previousBlock) ||
    isBlock('captionByline', previousBlock)
  ) {
    return removeBlock(change, value.startBlock)
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

  if (isBlock('infoBoxTitle', value.endBlock)) {
    return change
  }

  if (
    !isBlock('captionText', value.endBlock) &&
    !isBlock('captionByline', value.endBlock)
  ) {
    return
  }

  const nextBlock = document.getNextBlock(
    value.endBlock.key
  )

  if (
    isBlock('infoBoxText', nextBlock) &&
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
