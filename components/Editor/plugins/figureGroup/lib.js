import Caption from '../caption'
import FigureImage from '../figureImage'
import { Block } from 'slate'

export const getNewFigureGroupFigure = () =>
  Block.create({
    type: 'figureGroupFigure',
    nodes: [
      FigureImage.getNew(),
      Caption.getNew()
    ]
  })

export const getNew = () =>
  Block.create({
    type: 'figureGroup',
    nodes: [
      getNewFigureGroupFigure(),
      getNewFigureGroupFigure(),
      Caption.getNew()
    ]
  })
