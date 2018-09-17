import {
  compose,
  converge,
  both,
  ifElse,
  always,
  allPass,
} from 'ramda'

import { removeBlock } from '../../Editor/lib/changes'

import {
  getChange,
  isCollapsed,
  getParentOf,
  getStartBlock,
  hasEmptyText,
  eventHandler,
  isDelete,
  isBackspace,
  isBlock,
} from '../../Editor/lib'

const onDeleteOrBackspace = compose(
  ifElse(
    allPass([
      isCollapsed,
      compose(
        isBlock('figureImage'),
        getStartBlock
      ),
      compose(
        both(isBlock('figure'), hasEmptyText),
        getParentOf(getStartBlock)
      ),
    ]),
    converge(removeBlock, [
      getChange,
      getParentOf(getStartBlock),
      always({ url: '' }),
    ])
  )
)

const onBackspace = onDeleteOrBackspace(
  always(undefined)
)

const onDelete = onDeleteOrBackspace(
  always(undefined)
)

export default eventHandler(
  compose(
    ifElse(isBackspace, onBackspace),
    ifElse(isDelete, onDelete)
  )(always(undefined))
)
