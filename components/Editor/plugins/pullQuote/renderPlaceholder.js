import { InlinePlaceholder } from '../../base/components/Placeholder'
import { isBlock } from '../../base/lib'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('pullQuoteText', node)) {
    return <InlinePlaceholder>Zitat</InlinePlaceholder>
  }

  if (isBlock('pullQuoteCite', node)) {
    return (
      <InlinePlaceholder>Quellenangabe / Autor</InlinePlaceholder>
    )
  }
}
