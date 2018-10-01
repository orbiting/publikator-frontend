import { InlinePlaceholder } from '../../base/components/Placeholder'
import { isBlock } from '../../base/lib'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('chartTitle', node)) {
    return <InlinePlaceholder>Titel</InlinePlaceholder>
  }

  if (isBlock('chartLead', node)) {
    return <InlinePlaceholder>Lead</InlinePlaceholder>
  }
  if (isBlock('chartNote', node)) {
    return <InlinePlaceholder>Quelle</InlinePlaceholder>
  }
}
