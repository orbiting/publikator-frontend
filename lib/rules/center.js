import { ifElse } from 'ramda'

import S from '../transform/slate'
import M from '../transform/mdast'
import { mergeResults } from '../transform/common'

const fromMdast = ifElse(
  M.isZone('CENTER'),
  mergeResults(S.toBlock('center'), S.withNodes)
)

const toMdast = ifElse(
  S.isBlock('center'),
  mergeResults(M.toZone('CENTER'), M.withChildren)
)

export default {
  fromMdast,
  toMdast,
}
