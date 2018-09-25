import { isBlock } from '../../base/lib'
import { InlinePlaceholder } from '../../base/components/Placeholder'

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
