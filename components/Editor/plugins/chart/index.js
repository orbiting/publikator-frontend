import { getNew } from './lib'
import renderNode from './renderNode'
import renderPlaceholder from './renderPlaceholder'
import onKeyDown from './onKeyDown'

export default {
  getNew,
  renderNode,
  renderPlaceholder,
  onKeyDown,
  schema: {
    blocks: {
      chartCanvas: {
        isVoid: true
      }
    }
  }
}
