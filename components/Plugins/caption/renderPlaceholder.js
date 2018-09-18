import { isBlock } from '../../Editor/lib'

import { InlinePlaceholder } from '../../Editor/components/Placeholder'

export default ({ node }) => {
  if (
    isBlock('captionText', node) &&
    node.text.trim() === ''
  ) {
    return (
      <InlinePlaceholder>
        Legende
      </InlinePlaceholder>
    )
  }
  if (
    isBlock('captionByline', node) &&
    node.text.trim() === ''
  ) {
    return (
      <InlinePlaceholder>
        Credits
      </InlinePlaceholder>
    )
  }
}
