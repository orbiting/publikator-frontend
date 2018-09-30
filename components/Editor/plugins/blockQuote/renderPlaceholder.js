import { isBlock } from '../../base/lib'
import { InlinePlaceholder } from '../../base/components/Placeholder'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('blockQuoteText', node)) {
    return <InlinePlaceholder>&para;</InlinePlaceholder>
  }
}
