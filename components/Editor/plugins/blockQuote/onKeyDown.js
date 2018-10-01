import {
  focusNext,
  focusPrevious,
  removeBlock,
  insertBlockAfter
} from '../../base/lib/changes'

import { isBlock } from '../../base/lib'
import Caption from '../caption'

const isCaptionElement = node =>
  isBlock('captionText', node) || isBlock('captionByline', node)

const onEnter = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (!selection.isCollapsed) {
    return
  }

  if (!selection.end.isAtEndOfNode(value.startBlock)) {
    return
  }

  const blockQuote = document.getParent(value.startBlock.key)

  if (!isBlock('blockQuote', blockQuote)) {
    return
  }

  if (!isBlock('blockQuoteText', value.startBlock)) {
    return
  }

  const blockQuoteTexts = blockQuote.nodes.filter(
    isBlock('blockQuoteText')
  )

  if (blockQuoteTexts.last() !== value.startBlock) {
    return
  }

  const hasCaption = isCaptionElement(
    document.getNextBlock(value.startBlock.key)
  )
  let t = change
  if (!hasCaption) {
    t = insertBlockAfter(change, Caption.getNew(), value.startBlock)
  }
  if (
    value.startBlock.text.trim() === '' &&
    blockQuoteTexts.size > 1
  ) {
    t = removeBlock(t, value.startBlock)
  }
  return focusNext(t)
}

const onBackspace = (_, change) => {
  const {
    value,
    value: { selection, document }
  } = change

  if (!selection.isCollapsed) {
    return
  }

  const blockQuote = document.getParent(value.startBlock.key)

  if (!selection.start.isAtStartOfNode(value.startBlock)) {
    return
  }
  if (!isBlock('blockQuote', blockQuote)) {
    return
  }

  if (blockQuote.text.trim() === '') {
    return change.call(removeBlock, blockQuote).call(focusPrevious)
  }

  if (blockQuote.nodes.filter(isBlock('blockQuoteText')).size < 2) {
    return change.call(focusPrevious)
  }
}

export default (event, change) => {
  if (event.key === 'Enter') {
    return onEnter(event, change)
  }
  if (event.key === 'Backspace') {
    return onBackspace(event, change)
  }
}
