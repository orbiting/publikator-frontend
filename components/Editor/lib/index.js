import {
  compose,
  zipObj,
  equals,
  complement,
  converge,
  both,
  tap,
  either,
  anyPass,
  trim,
  curry,
  identity,
  times,
  reduce,
  invoker,
  uncurryN,
  when,
} from 'ramda'

import {
  log,
  safePropEq,
  safePath,
  safeProp,
  notIsNil,
  mergeResults,
} from '../../../lib/transform/common'

import {
  isBlock,
  isMark,
  isInline,
  isDocument,
} from '../../../lib/transform/slate'

export {
  log,
  safePropEq,
  safePath,
  safeProp,
  notIsNil,
  mergeResults,
}

export { isBlock, isMark, isInline, isDocument }

const getIn = invoker(1, 'getIn')

export const iSafePath = uncurryN(2, path =>
  when(notIsNil, getIn(path))
)

export const preventDefault = tap(
  compose(
    e => e.preventDefault(),
    safeProp('event')
  )
)

export const eventHandler = handler =>
  compose(
    handler,
    zipObj(['event', 'change', 'editor']),
    Array.of
  )

export const getText = safeProp('text')

export const getChange = safeProp('change')

export const getValue = compose(
  safeProp('value'),
  getChange
)

export const getDocument = compose(
  safeProp('document'),
  getValue
)

export const getSelection = compose(
  safeProp('selection'),
  getValue
)

export const getEvent = safeProp('event')

export const getEditor = safeProp('editor')

export const getNumNodes = safePath([
  'nodes',
  'size',
])

export const getFurthestOf = curry(
  (filter, getter) =>
    converge(
      (doc, target) =>
        doc.getFurthest(target, filter),
      [
        getDocument,
        compose(
          safeProp('key'),
          getter
        ),
      ]
    )
)

export const getClosestOf = curry(
  (filter, getter) =>
    converge(
      (doc, target) =>
        doc.getClosest(target, filter),
      [
        getDocument,
        compose(
          safeProp('key'),
          getter
        ),
      ]
    )
)

export const getChildIndexOf = getter =>
  converge(
    (doc, target) =>
      doc.getParent(target).nodes.findIndex(
        compose(
          equals(target),
          safeProp('key')
        )
      ),
    [
      getDocument,
      compose(
        safeProp('key'),
        getter
      ),
    ]
  )

export const getNextBlockOf = getter =>
  converge(
    (doc, target) => doc.getNextBlock(target),
    [
      getDocument,
      compose(
        safeProp('key'),
        getter
      ),
    ]
  )

export const getPreviousBlockOf = getter =>
  converge(
    (doc, target) => doc.getPreviousBlock(target),
    [
      getDocument,
      compose(
        safeProp('key'),
        getter
      ),
    ]
  )

export const getParentOf = getter =>
  converge(
    (doc, target) => doc.getParent(target),
    [
      getDocument,
      compose(
        safeProp('key'),
        getter
      ),
    ]
  )

export const getNthAncestorOf = curry(
  (n, getter) =>
    converge(
      (doc, target) =>
        reduce(
          node =>
            doc.getParent(safeProp('key', node)),
          target,
          times(identity, n)
        ),
      [getDocument, getter]
    )
)

export const getStartBlock = compose(
  safeProp('startBlock'),
  getValue
)

export const getEndBlock = compose(
  safeProp('endBlock'),
  getValue
)

export const isCollapsed = compose(
  safePropEq('isCollapsed', true),
  getSelection
)

export const isExpanded = compose(
  safePropEq('isExpanded', true),
  getSelection
)

export const isMixed = complement(
  converge(equals, [getStartBlock, getEndBlock])
)

export const hasEmptyText = compose(
  equals(''),
  trim,
  getText
)

export const notIsMixed = complement(isMixed)

export const hasEdgeInSelection = predicates =>
  either(
    compose(
      anyPass(predicates),
      getStartBlock
    ),
    compose(
      anyPass(predicates),
      getEndBlock
    )
  )

export const isCollapsedAtStartOf = getter =>
  both(
    isCollapsed,
    converge(
      (selection, block) =>
        selection.start.isAtStartOfNode(block),
      [getSelection, getter]
    )
  )

export const isCollapsedAtEndOf = getter =>
  both(
    isCollapsed,
    converge(
      (selection, block) =>
        selection.end.isAtEndOfNode(block),
      [getSelection, getter]
    )
  )

export const isCollapsedAtStart = isCollapsedAtStartOf(
  getStartBlock
)

export const isCollapsedAtEnd = isCollapsedAtEndOf(
  getEndBlock
)

export const isKey = key =>
  compose(
    equals(key),
    safePath(['event', 'key'])
  )

export const isEnter = isKey('Enter')
export const isBackspace = isKey('Backspace')
export const isDelete = isKey('Delete')
