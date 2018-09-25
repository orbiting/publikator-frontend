import { Block } from 'slate'

export default () =>
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
