import { ifElse } from 'ramda'

import S from '../transform/slate'
import M from '../transform/mdast'
import { mergeResults } from '../transform/common'

const getNew = mergeResults(
  S.toBlock('figureImage'),
  () => ({
    data: {
      url: '',
      title: '',
      alt: '',
    },
  })
)

const fromMdast = ifElse(
  M.isImageParagraph,
  mergeResults(S.withImageParagraphData, getNew)
)

const toMdast = ifElse(
  S.isBlock('figureImage'),
  M.toImageParagraph
)

export default {
  fromMdast,
  toMdast,
  getNew,
}
