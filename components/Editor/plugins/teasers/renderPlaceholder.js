import { InlinePlaceholder } from '../../base/components/Placeholder'
import { isBlock } from '../../base/lib'
import { isTeaserTitle } from './lib'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }

  if (isBlock('frontFormat', node)) {
    return <InlinePlaceholder>Format</InlinePlaceholder>
  }
  if (isTeaserTitle(node)) {
    return <InlinePlaceholder>Titel</InlinePlaceholder>
  }
  if (isBlock('frontSubject', node)) {
    return <InlinePlaceholder>Subject</InlinePlaceholder>
  }
  if (isBlock('frontLead', node)) {
    return <InlinePlaceholder>Lead</InlinePlaceholder>
  }
  if (isBlock('frontCredit', node)) {
    return <InlinePlaceholder>Credit</InlinePlaceholder>
  }
}
