import { isBlock } from '../../Editor/lib'
import { InlinePlaceholder } from '../../Editor/components/Placeholder'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }

  if (isBlock('captionText', node)) {
    return (
      <InlinePlaceholder>
        Legende
      </InlinePlaceholder>
    )
  }
  if (isBlock('captionByline', node)) {
    return (
      <InlinePlaceholder>
        Credits
      </InlinePlaceholder>
    )
  }
}
