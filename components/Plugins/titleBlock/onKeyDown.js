import {
  compose,
  complement,
  converge,
  both,
  ifElse,
  either,
  always,
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
        isBlock('title'),
        isBlock('subject'),
        isBlock('lead'),
        isBlock('credits'),
      ])
    ),
    compose(
      change => change.moveToEnd(),
      getChange
    )
  ),
  ifElse(
    isCollapsed,
    compose(
      ifElse(
        compose(
          isBlock('title'),
          getStartBlock
        ),
        ifElse(
          compose(
            isBlock('subject'),
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
                  type: 'subject',
                }),
              getEndBlock,
            ])
          )
        )
      ),
      ifElse(
        compose(
          isBlock('subject'),
          getStartBlock
        ),
        ifElse(
          compose(
            isBlock('lead'),
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
                  type: 'lead',
                }),
              getEndBlock,
            ])
          )
        )
      ),
      ifElse(
        compose(
          isBlock('lead'),
          getEndBlock
        ),
        compose(
          focusNext,
          getChange
        )
      ),
      ifElse(
        compose(
          isBlock('credits'),
          getEndBlock
        ),
        ifElse(
          both(
            isCollapsedAtStart,
            compose(
              complement(isBlock('lead')),
              getPreviousBlockOf(getStartBlock)
            )
          ),
          compose(
            focusPrevious,
            converge(insertBlockBefore, [
              getChange,
              () =>
                Block.create({
                  type: 'lead',
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

const onDeleteOrBackspace = compose(
  ifElse(
    both(notIsMixed, isExpanded),
    always(undefined)
  ),
  ifElse(
    both(
      isMixed,
      hasEdgeInSelection([
        isBlock('title'),
        isBlock('lead'),
        isBlock('credits'),
      ])
    ),
    compose(
      change => change.moveToStart(),
      getChange
    )
  )
)

const onBackspace = compose(
  onDeleteOrBackspace,
  ifElse(
    isCollapsedAtStart,
    compose(
      ifElse(
        compose(
          isBlock('title'),
          getStartBlock
        ),
        compose(
          focusPrevious,
          getChange
        )
      ),
      ifElse(
        compose(
          both(
            isBlock('lead'),
            complement(hasEmptyText)
          ),
          getStartBlock
        ),
        compose(
          focusPrevious,
          getChange
        )
      ),
      ifElse(
        compose(
          isBlock('credits'),
          getStartBlock
        ),
        compose(
          ifElse(
            compose(
              isBlock('title'),
              getPreviousBlockOf(getStartBlock)
            ),
            compose(
              focusPrevious,
              getChange
            )
          ),
          ifElse(
            compose(
              both(
                isBlock('lead'),
                complement(hasEmptyText)
              ),
              getPreviousBlockOf(getStartBlock)
            ),
            compose(
              focusPrevious,
              getChange
            )
          ),
          ifElse(
            compose(
              both(isBlock('lead'), hasEmptyText),
              getPreviousBlockOf(getStartBlock)
            ),
            converge(removeBlock, [
              getChange,
              getPreviousBlockOf(getStartBlock),
            ])
          )
        )(always(undefined))
      )
    )(always(undefined))
  )
)(always(undefined))

const onDelete = compose(
  onDeleteOrBackspace,
  ifElse(
    isCollapsedAtEnd,
    compose(
      ifElse(
        either(
          compose(
            either(
              isBlock('lead'),
              isBlock('credits')
            ),
            getEndBlock
          ),
          compose(
            both(
              complement(hasEmptyText),
              isBlock('lead')
            ),
            getNextBlockOf(getEndBlock)
          )
        ),
        getChange
      )
    )(always(undefined))
  )
)(always(undefined))

export default eventHandler(
  compose(
    ifElse(isEnter, onEnter),
    ifElse(isBackspace, onBackspace),
    ifElse(isDelete, onDelete)
  )(always(undefined))
)
