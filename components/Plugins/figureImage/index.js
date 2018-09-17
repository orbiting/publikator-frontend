import { Block } from 'slate'
import renderNode from './renderNode'
import onKeyDown from './onKeyDown'

const getNew = () =>
  Block.create({
    type: 'figureImage',
    isVoid: true,
    data: {
      url: '',
      title: '',
      alt: '',
    },
  })

export default {
  onKeyDown,
  renderNode,
  schema: {
    blocks: {
      figureImage: {
        isVoid: true,
      },
    },
  },
  getNew,
}
