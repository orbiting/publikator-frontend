import { ifElse } from 'ramda'
import S from '../transform/slate'
import M from '../transform/mdast'
import { mergeResults } from '../transform/common'

const fromMdast = ifElse(
  M.isStrong,
  mergeResults(S.toMark('bold'), S.withNodes)
)

const toMdast = ifElse(
  S.isMark('bold'),
  mergeResults(M.toStrong, M.withChildren)
)

export default {
  fromMdast,
  toMdast,
}
