import onKeyDown from './onKeyDown'
import renderNode from './renderNode'
import { renderUI } from './ui'

export default {
  renderNode,
  onKeyDown,
  renderUI,
  schema: {
    blocks: {
      videoEmbed: {
        isVoid: true
      },
      twitterEmbed: {
        isVoid: true
      }
    }
  }
}
