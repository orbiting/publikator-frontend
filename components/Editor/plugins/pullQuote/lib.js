import { Block } from 'slate'
import Caption from '../caption'
import FigureImage from '../figureImage'

export const getNewPullQuoteFigure = () =>
  Block.create({
    type: 'pullQuoteFigure',
    nodes: [FigureImage.getNew(), Caption.getNew()]
  })

export const getNew = () =>
  Block.create({
    type: 'pullQuote',
    nodes: [
      getNewPullQuoteFigure(),
      Block.create({
        type: 'pullQuoteText'
      }),
      Block.create({
        type: 'pullQuoteCite'
      })
    ]
  })
