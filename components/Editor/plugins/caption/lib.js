import { Block } from 'slate'

export const getNew = () =>
  Block.create({
    type: 'caption',
    nodes: [
      Block.create({
        type: 'captionText'
      }),
      Block.create({
        type: 'captionByline'
      })
    ]
  })
