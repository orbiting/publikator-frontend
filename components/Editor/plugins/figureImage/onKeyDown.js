import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  updateData
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'

import Caption from '../caption'

const onEnter = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (
    selection.isExpanded &&
    (isBlock('figureImage', value.startBlock) ||
      isBlock('figureImage', value.endBlock))
  ) {
    return change.moveToEnd()
  }

  if (!selection.isCollapsed) {
    return
  }

  if (!isBlock('figureImage', value.startBlock)) {
    return
  }

  const nextBlock = document.getNextBlock(
    value.startBlock.key
  )

  const delta =
    document.getDepth(value.startBlock.key) -
    document.getDepth(nextBlock.key)

  if (
    (isBlock('captionText', nextBlock) ||
      isBlock('captionByline', nextBlock)) &&
    delta <= 1
  ) {
    return focusNext(change)
  }

  return focusNext(
    insertBlockAfter(
      change,
      Caption.getNew(),
      value.startBlock
    )
  )
}

const onDeleteOrBackspace = (_, change) => {
  const {
    value,
    value: { selection }
  } = change

  if (
    selection.isExpanded &&
    (isBlock('figureImage', value.startBlock) ||
      isBlock('figureImage', value.endBlock))
  ) {
    return change.moveToStart()
  }

  if (!selection.isCollapsed) {
    return
  }

  if (!isBlock('figureImage', value.startBlock)) {
    return
  }

  if (value.startBlock.data.get('url') !== '') {
    return updateData(change, value.startBlock, {
      url: ''
    })
  }

  return focusPrevious(change)
}

export default (event, change) => {
  if (event.key === 'Enter') {
    return onEnter(event, change)
  }
  if (
    event.key === 'Delete' ||
    event.key === 'Backspace'
  ) {
    return onDeleteOrBackspace(event, change)
  }
}
