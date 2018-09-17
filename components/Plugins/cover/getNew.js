import Caption from '../caption'
import FigureImage from '../figureImage'
import { Block } from 'slate'

export default () =>
  Block.create({
    type: 'cover',
    nodes: [
      FigureImage.getNew(),
      Caption.getNew()
    ]
  })
