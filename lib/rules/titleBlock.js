import { ifElse, compose } from 'ramda'
import S from '../transform/slate'
import M from '../transform/mdast'
import { mergeResults } from '../transform/common'
import {
  normalize,
  getOrNew,
  getOrSkip,
  getOrSkipAt,
} from '../transform/normalize'

const titleFromMdast = ifElse(
  M.isHeading(1),
  mergeResults(S.toBlock('title'), S.withNodes)
)

const leadFromMdast = ifElse(
  M.isParagraph,
  mergeResults(S.toBlock('lead'), S.withNodes)
)

const subjectFromMdast = ifElse(
  M.isHeading(2),
  mergeResults(S.toBlock('subject'), S.withNodes)
)

const creditsFromMdast = ifElse(
  M.isParagraph,
  mergeResults(S.toBlock('credits'), S.withNodes)
)

const getNew = mergeResults(
  S.toBlock('titleBlock'),
  () => ({
    nodes: [
      S.toBlock('title')(),
      S.toBlock('lead')(),
      S.toBlock('credits')(),
    ],
  })
)

const fromMdast = ifElse(
  M.isZone('TITLE'),
  mergeResults(
    S.toBlock('titleBlock'),
    S.withData,
    S.withNormalizedNodes(
      normalize(
        getOrNew(
          S.toBlock('title'),
          titleFromMdast
        ),
        getOrSkip(subjectFromMdast),
        getOrSkipAt(-1, leadFromMdast),
        getOrNew(
          S.toBlock('credits'),
          creditsFromMdast
        )
      )
    )
  )
)

const toMdast = compose(
  ifElse(
    S.isBlock('titleBlock'),
    mergeResults(
      M.toZone('TITLE'),
      M.withChildren
    )
  ),
  ifElse(
    S.isBlock('title'),
    mergeResults(M.toHeading(1), M.withChildren)
  ),
  ifElse(
    S.isBlock('subject'),
    mergeResults(M.toHeading(2), M.withChildren)
  ),
  ifElse(
    S.isBlock('lead'),
    mergeResults(M.toParagraph, M.withChildren)
  ),
  ifElse(
    S.isBlock('credits'),
    mergeResults(M.toParagraph, M.withChildren)
  )
)

export default {
  getNew,
  fromMdast,
  toMdast,
}
