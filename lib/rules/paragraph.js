import { ifElse } from 'ramda'

import S from '../transform/slate'
import M from '../transform/mdast'
import { mergeResults } from '../transform/common'

const fromMdast = ifElse(
  M.isParagraph,
  mergeResults(
    S.toBlock('paragraph'),
    S.withNodes
  )
)

const toMdast = ifElse(
  S.isBlock('paragraph'),
  mergeResults(M.toParagraph, M.withChildren)
)

export default {
  fromMdast,
  toMdast,
}
