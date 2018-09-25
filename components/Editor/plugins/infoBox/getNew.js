import { Block } from 'slate'
import Caption from '../caption'
import FigureImage from '../figureImage'

export const getNewInfoboxFigure = () =>
  Block.create({
    type: 'infoBoxFigure',
    nodes: [
      FigureImage.getNew(),
      Caption.getNew()
    ]
  })

export default () =>
  Block.create({
    type: 'infoBox',
    nodes: [
      Block.create({
        type: 'infoBoxTitle'
      }),
      getNewInfoboxFigure(),
      Block.create({
        type: 'infoBoxText'
      })
    ]
  })
