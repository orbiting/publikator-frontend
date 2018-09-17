import { ifElse, compose, map, head } from 'ramda'
import S from '../transform/slate'
import M from '../transform/mdast'
import {
  normalize,
  getMany,
} from '../transform/normalize'
import {
  mergeResults,
  safeProp,
  safePath,
  notIsNil,
} from '../transform/common'

import Paragraph from './paragraph'

const listItemFromMdast = ifElse(
  M.isListItem,
  mergeResults(
    S.toBlock('listItem'),
    S.withNormalizedNodes(
      compose(
        map(
          compose(
            head,
            safeProp('nodes')
          )
        ),
        normalize(getMany(Paragraph.fromMdast))
      )
    )
  )
)

const fromMdast = ifElse(
  M.isList,
  mergeResults(
    S.toBlock('list'),
    S.withNormalizedNodes(
      normalize(getMany(listItemFromMdast))
    ),
    node => ({
      data: {
        ordered: safeProp('ordered', node),
        compact: !safeProp('loose', node),
      },
    })
  )
)
const listItemToMdast = loose =>
  ifElse(
    S.isBlock('listItem'),
    mergeResults(
      M.toType('listItem'),
      (node, next) => ({
        loose,
        children: safeProp('nodes', node)
          ? node.nodes.map(n => ({
              ...M.toParagraph(),
              children: next([n]),
            }))
          : 0,
        ordered: safePath(
          ['data', 'ordered'],
          node
        ),
      })
    )
  )

const listToMdast = loose =>
  ifElse(S.isBlock('list'), (node, next) => {
    const isLoose = notIsNil(loose)
      ? loose
      : !safePath(['data', 'compact'], node)

    const decoratedNext = compose(
      listItemToMdast(isLoose),
      listToMdast(isLoose)
    )(next)

    return {
      type: 'list',
      children: safeProp('nodes', node)
        ? node.nodes.map(n =>
            decoratedNext(n, next)
          )
        : [],
      loose: isLoose,
      ordered: safePath(
        ['data', 'ordered'],
        node
      ),
    }
  })

export default {
  fromMdast,
  toMdast: listToMdast(),
}
