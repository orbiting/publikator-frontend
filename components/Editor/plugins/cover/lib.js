import Caption from '../caption'
import FigureImage from '../figureImage'
import { Block } from 'slate'

export const getNew = () =>
  Block.create({
    type: 'cover',
    nodes: [
      FigureImage.getNew(),
      Caption.getNew()
    ]
  })
