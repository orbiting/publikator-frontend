import {
  removeBlock,
  insertBlockAfter,
  focusNext
} from '../../base/lib/changes'
import { getChildIndex } from '../../base/lib/selection'

import { isBlock } from '../../base/lib'

import Caption from '../caption'
import { getNewFigureGroupFigure } from './lib'

const selectableBlocks = [
  isBlock('figureImage'),
  isBlock('captionText'),
  isBlock('captionByline')
]

const isFigureEmpty = node =>
  node.text.trim() === '' &&
  !node.nodes.first().data.get('url')

const isFigureGroupEmpty = node =>
  // Has empty text
  node.text.trim() === '' &&
  // Has only one child, which is a figure
  (!node.nodes.size === 1 ||
    // Has two children, the second is the caption
    (node.nodes.size === 2 &&
      isBlock('caption', node.nodes.last())))

const onDeleteOrBackspace = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (!selection.isCollapsed) {
    return
  }

  if (
    !selectableBlocks.some(f =>
      f(value.startBlock)
    )
  ) {
    return
  }

  const figureGroup = document.getClosest(
    value.startBlock.key,
    isBlock('figureGroup')
  )

  if (!figureGroup) {
    return
  }

  if (isFigureGroupEmpty(figureGroup)) {
    return removeBlock(change, figureGroup)
  }

  const figureGroupFigure = document.getClosest(
    value.startBlock.key,
    isBlock('figureGroupFigure')
  )

  if (!figureGroupFigure) {
    return
  }

  if (isFigureEmpty(figureGroupFigure)) {
    return removeBlock(change, figureGroupFigure)
  }
}

const onEnter = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change
  if (!selection.isCollapsed) {
    return
  }

  const figureGroup = document.getClosest(
    value.startBlock.key,
    isBlock('figureGroup')
  )

  if (!figureGroup) {
    return
  }

  const figureGroupFigure = document.getClosest(
    value.startBlock.key,
    isBlock('figureGroupFigure')
  )

  if (!figureGroupFigure) {
    return
  }

  if (
    !isBlock('captionByline', value.startBlock)
  ) {
    return
  }

  const childIndex = getChildIndex(
    value,
    figureGroupFigure
  )

  if (childIndex === figureGroup.nodes.size - 1) {
    return focusNext(
      insertBlockAfter(
        change,
        Caption.getNew(),
        figureGroupFigure
      )
    )
  }

  return focusNext(
    insertBlockAfter(
      change,
      getNewFigureGroupFigure(),
      figureGroupFigure
    )
  )
}

export default (event, change) => {
  if (event.key === 'Enter') {
    return onEnter(event, change)
  }

  if (
    event.key === 'Backspace' ||
    event.key === 'Delete'
  ) {
    return onDeleteOrBackspace(event, change)
  }
}
