import { removeBlock } from '../../Editor/lib/changes'

import { isBlock } from '../../Editor/lib'

const onDeleteOrBackspace = (_, change) => {
  const {
    value,
    value: { document, selection },
  } = change

  if (
    selection.isCollapsed &&
    isBlock('figureImage', value.startBlock) &&
    value.startBlock.data.get('url') === ''
  ) {
    let parent = document.getParent(
      value.startBlock.key
    )
    if (
      isBlock('figure', parent) &&
      parent.text.trim() === ''
    ) {
      return removeBlock(change, parent)
    }
  }
}

export default (event, change) => {
  if (
    event.key === 'Delete' ||
    event.key === 'Backspace'
  ) {
    return onDeleteOrBackspace(event, change)
  }
}
