import { Block } from 'slate'
import Caption from '../caption'

export const getNew = () =>
  Block.create({
    type: 'blockQuote',
    nodes: [
      Block.create({
        type: 'blockQuoteText'
      }),
      Caption.getNew()
    ]
  })
