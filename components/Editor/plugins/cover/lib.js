import Caption from '../caption'
import FigureImage from '../figureImage'
import { Block } from 'slate'

export const getNew = () =>
  Block.create({
    type: 'cover',
    data: {
      size: 'center'
    },
    nodes: [FigureImage.getNew(), Caption.getNew()]
  })
