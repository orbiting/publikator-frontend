import {
  compose,
  equals,
  converge,
  both,
  ifElse,
  either,
  add,
  always,
  allPass,
} from 'ramda'

import { Block } from 'slate'

import {
  focusNext,
  focusPrevious,
  insertBlockAfter,
  removeBlock,
} from '../../Editor/lib/changes'

import {
  isMixed,
  isExpanded,
  hasEdgeInSelection,
  getChange,
  isCollapsed,
  getEndBlock,
  getNextBlockOf,
  getParentOf,
  getStartBlock,
  hasEmptyText,
  eventHandler,
  isEnter,
  isDelete,
  isBackspace,
  isBlock,
  getNthAncestorOf,
  getNumNodes,
  getChildIndexOf,
  getClosestOf,
  notIsNil,
  isCollapsedAtStart,
  isCollapsedAtEnd,
  getPreviousBlockOf,
} from '../../Editor/lib'

import { getNewInfoboxFigure } from './getNew'

const onEnter = compose(
  ifElse(
    both(
      isExpanded,
      hasEdgeInSelection([
        isBlock('infoBoxTitle'),
      ])
    ),
    compose(
      change => change.moveToEnd(),
      getChange
    )
  ),
  ifElse(
    both(
      isMixed,
      hasEdgeInSelection([isBlock('infoBoxText')])
    ),
    compose(
      change => change.moveToEnd(),
      getChange
    )
  ),
  ifElse(
    both(
      isCollapsed,
      compose(
        isBlock('infoBoxTitle'),
        getStartBlock
      )
    ),
    ifElse(
      compose(
        isBlock('figureImage'),
        getNextBlockOf(getStartBlock)
      ),
      compose(
        focusNext,
        getChange
      ),
      compose(
        focusNext,
        converge(insertBlockAfter, [
          getChange,
          getNewInfoboxFigure,
          getStartBlock,
        ])
      )
    )
  ),
  ifElse(
    allPass([
      isCollapsed,
      compose(
        isBlock('captionByline'),
        getStartBlock
      ),
      compose(
        isBlock('infoBox'),
        getNthAncestorOf(3, getStartBlock)
      ),
    ]),
    ifElse(
      compose(
        isBlock('infoBoxText'),
        getNextBlockOf(getStartBlock)
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
              type: 'infoBoxText',
            }),
          getStartBlock,
        ])
      )
    )
  ),
  ifElse(
    allPass([
      isCollapsedAtStart,
      compose(
        both(
          isBlock('infoBoxText'),
          hasEmptyText
        ),
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

const onDeleteOrBackspace = compose(
  ifElse(
    allPass([
      isCollapsed,
      compose(
        isBlock('figureImage'),
        getStartBlock
      ),
      compose(
        both(
          isBlock('infoBoxFigure'),
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
  ),
  ifElse(
    both(
      isMixed,
      hasEdgeInSelection([
        isBlock('infoBoxText'),
        isBlock('infoBoxTitle'),
      ])
    ),
    compose(
      change => change.moveToStart(),
      getChange
    )
  ),
  ifElse(
    both(
      isCollapsedAtStart,
      compose(
        allPass([
          notIsNil,
          hasEmptyText,
          compose(
            equals(1),
            getNumNodes
          ),
        ]),
        getClosestOf(
          isBlock('infoBox'),
          getStartBlock
        )
      )
    ),
    converge(removeBlock, [
      getChange,
      getClosestOf(
        isBlock('infoBox'),
        getStartBlock
      ),
    ])
  )
)

const onBackspace = compose(
  onDeleteOrBackspace,
  ifElse(
    both(
      isCollapsedAtStart,
      compose(
        isBlock('infoBoxTitle'),
        getStartBlock
      )
    ),
    compose(
      focusPrevious,
      getChange
    )
  ),
  ifElse(
    allPass([
      isCollapsedAtStart,
      compose(
        both(
          isBlock('infoBoxText'),
          hasEmptyText
        ),
        getStartBlock
      ),
      compose(
        either(
          isBlock('captionText'),
          isBlock('captionByline')
        ),
        getPreviousBlockOf(getStartBlock)
      ),
    ]),
    converge(removeBlock, [
      getChange,
      getStartBlock,
    ])
  )
)(always(undefined))

const onDelete = compose(
  onDeleteOrBackspace,
  ifElse(
    both(
      isCollapsedAtEnd,
      compose(
        isBlock('infoBoxTitle'),
        getEndBlock
      )
    ),
    getChange
  ),
  ifElse(
    allPass([
      isCollapsedAtEnd,
      compose(
        both(
          isBlock('infoBoxText'),
          hasEmptyText
        ),
        getNextBlockOf(getEndBlock)
      ),
      compose(
        either(
          isBlock('captionText'),
          isBlock('captionByline')
        ),
        getStartBlock
      ),
    ]),
    converge(removeBlock, [
      getChange,
      getStartBlock,
    ])
  )
)(always(undefined))

export default eventHandler(
  compose(
    ifElse(isEnter, onEnter),
    ifElse(isBackspace, onBackspace),
    ifElse(isDelete, onDelete)
  )(always(undefined))
)
