import { removeBlock } from '../../Editor/lib/changes'

import { isBlock } from '../../Editor/lib'

const onDeleteOrBackspace = (_, change) => {
  const {
    value,
    value: { document, selection },
  } = change

  if (!selection.isCollapsed) {
    return
  }

  if (!isBlock('figureImage', value.startBlock)) {
    return
  }

  const parent = document.getParent(
    value.startBlock.key
  )

  if (!isBlock('figure', parent)) {
    return
  }
  if (
    value.startBlock.data.get('url') === '' &&
    parent.text.trim() === ''
  ) {
    return removeBlock(change, parent)
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
