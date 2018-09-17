import { ifElse } from 'ramda'

import S from '../transform/slate'
import M from '../transform/mdast'
import { mergeResults } from '../transform/common'

const fromMdast = ifElse(
  M.isEmphasis,
  mergeResults(S.toBlock('italic'), S.withNodes)
)

const toMdast = ifElse(
  S.isMark('italic'),
  mergeResults(M.toEmphasis, M.withChildren)
)

export default {
  fromMdast,
  toMdast,
}
