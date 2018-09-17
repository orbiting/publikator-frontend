import {
  compose,
  equals,
  converge,
  both,
  ifElse,
  add,
  always,
  allPass,
} from 'ramda'

import {
  focusNext,
  removeBlock,
} from '../../Editor/lib/changes'

import {
  getChange,
  getParentOf,
  getStartBlock,
  hasEmptyText,
  eventHandler,
  isEnter,
  isBlock,
  getNumNodes,
  getChildIndexOf,
  isCollapsedAtStart,
} from '../../Editor/lib'

const onEnter = compose(
  ifElse(
    allPass([
      isCollapsedAtStart,
      compose(
        both(isBlock('listItem'), hasEmptyText),
        getStartBlock
      ),
      converge(equals, [
        getChildIndexOf(getStartBlock),
        compose(
          add(-1),
          getNumNodes,
          getParentOf(getStartBlock)
        ),
      ]),
    ]),
    compose(
      focusNext,
      converge(removeBlock, [
        getChange,
        getStartBlock,
      ])
    )
  )
)(always(undefined))

export default eventHandler(
  compose(ifElse(isEnter, onEnter))(
    always(undefined)
  )
)
