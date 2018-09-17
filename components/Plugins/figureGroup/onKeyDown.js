import {
  compose,
  converge,
  both,
  ifElse,
  always,
  allPass,
  either,
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
  getClosestOf,
} from '../../Editor/lib'

const onDeleteOrBackspace = compose(
  ifElse(
    allPass([
      isCollapsed,
      compose(
        either(
          isBlock('figureImage'),
          isBlock('caption')
        ),
        getStartBlock
      ),
      compose(
        both(
          isBlock('figureGroupFigure'),
          hasEmptyText
        ),
        getParentOf(getStartBlock)
      ),
      compose(
        both(
          isBlock('figureGroup'),
          n => n.nodes.size === 1
        ),
        getClosestOf(
          isBlock('figureGroup'),
          getStartBlock
        )
      ),
    ]),
    converge(removeBlock, [
      getChange,
      getParentOf(getStartBlock),
      always({ url: '' }),
    ])
  ),
  ifElse(
    allPass([
      isCollapsed,
      compose(
        isBlock('figureImage'),
        getStartBlock
      ),
      compose(
        both(
          isBlock('figureGroupFigure'),
          hasEmptyText
        ),
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
