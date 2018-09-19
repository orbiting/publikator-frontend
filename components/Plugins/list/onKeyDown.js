import {
  focusNext,
  removeBlock,
} from '../../Editor/lib/changes'

import { isBlock } from '../../Editor/lib'

const onEnter = (_, change) => {
  const {
    value,
    value: { selection, document },
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

  const list = document.getParent(
    value.startBlock.key
  )

  if (!list) {
    return
  }

  if (
    isBlock('listItem', value.startBlock) &&
    value.startBlock.text.trim() === ''
  ) {
    if (list.nodes.last() === value.startBlock) {
      return focusNext(
        removeBlock(change, value.startBlock)
      )
    }
  }
}

export default (event, change) => {
  if (event.key === 'Enter') {
    return onEnter(event, change)
  }
}
