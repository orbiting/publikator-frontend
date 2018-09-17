import {
  compose,
  equals,
  complement,
  converge,
  both,
  ifElse,
  either,
  always,
  allPass,
} from 'ramda'

import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  insertBlockBefore,
  removeBlock,
} from '../../Editor/lib/changes'

import {
  isBlock,
  isExpanded,
  notIsMixed,
  isMixed,
  hasEdgeInSelection,
  getChange,
  isCollapsed,
  getEndBlock,
  getNextBlockOf,
  isCollapsedAtStart,
  isCollapsedAtEnd,
  getNumNodes,
  getParentOf,
  getStartBlock,
  hasEmptyText,
  getPreviousBlockOf,
  eventHandler,
  isEnter,
  isDelete,
  isBackspace,
} from '../../Editor/lib'

const onEnter = compose(
  ifElse(
    both(
      isExpanded,
      hasEdgeInSelection([
        isBlock('captionText'),
        isBlock('captionByline'),
      ])
    ),
    compose(
      change => change.moveToStart(),
      getChange
    )
  ),
  ifElse(
    isCollapsed,
    compose(
      ifElse(
        compose(
          isBlock('captionText'),
          getStartBlock
        ),
        ifElse(
          compose(
            isBlock('captionByline'),
            getNextBlockOf(getEndBlock)
          ),
          compose(
            focusNext,
            getChange
          ),
          compose(
            focusNext,
            converge(insertBlockAfter, [
              getChange,
              () =>
                Block.create({
                  type: 'captionByline',
                }),
              getEndBlock,
            ])
          )
        )
      ),
      ifElse(
        compose(
          isBlock('captionByline'),
          getStartBlock
        ),
        ifElse(
          both(
            isCollapsedAtStart,
            compose(
              complement(isBlock('captionText')),
              getPreviousBlockOf(getEndBlock)
            )
          ),
          compose(
            focusPrevious,
            converge(insertBlockBefore, [
              getChange,
              () =>
                Block.create({
                  type: 'captionText',
                }),
              getStartBlock,
            ])
          ),
          compose(
            focusNext,
            getChange
          )
        )
      )
    )(always(undefined))
  )
)(always(undefined))

export const onDeleteOrBackspace = compose(
  ifElse(
    both(notIsMixed, isExpanded),
    always(undefined)
  ),
  ifElse(
    both(
      isMixed,
      hasEdgeInSelection([
        isBlock('captionText'),
        isBlock('captionByline'),
      ])
    ),
    compose(
      change => change.moveToStart(),
      getChange
    )
  ),
  ifElse(
    compose(
      allPass([
        hasEmptyText,
        isBlock('caption'),
        compose(
          equals(1),
          getNumNodes
        ),
      ]),
      getParentOf(getStartBlock)
    ),
    converge(removeBlock, [
      getChange,
      getParentOf(getStartBlock),
    ])
  )
)

export const onBackspace = compose(
  onDeleteOrBackspace,
  ifElse(
    isCollapsedAtStart,
    compose(
      ifElse(
        compose(
          both(
            isBlock('caption'),
            compose(
              equals(1),
              getNumNodes
            )
          ),
          getParentOf(getStartBlock)
        ),
        compose(
          focusPrevious,
          getChange
        )
      ),
      ifElse(
        compose(
          both(
            isBlock('captionText'),
            hasEmptyText
          ),
          getStartBlock
        ),
        compose(
          focusNext,
          converge(removeBlock, [
            getChange,
            getStartBlock,
          ])
        )
      ),
      ifElse(
        both(
          compose(
            either(
              isBlock('captionByline'),
              isBlock('captionText')
            ),
            getPreviousBlockOf(getStartBlock)
          ),
          compose(
            complement(isBlock('captionByline')),
            getStartBlock
          )
        ),
        compose(
          focusPrevious,
          getChange
        )
      )
    )(always(undefined))
  )
)(always(undefined))

export const onDelete = compose(
  // onDeleteOrBackspace,
  ifElse(
    allPass([
      isCollapsedAtEnd,

      compose(
        either(
          isBlock('captionByline'),
          isBlock('captionText')
        ),
        getEndBlock
      ),
      compose(
        complement(isBlock('captionByline')),
        getNextBlockOf(getEndBlock)
      ),
    ]),
    getChange
  )
)(always(undefined))

export default eventHandler(
  compose(
    ifElse(isEnter, onEnter),
    ifElse(isBackspace, onBackspace),
    ifElse(isDelete, onDelete)
  )(always(undefined))
)
