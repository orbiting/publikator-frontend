import { isBlock } from '../../base/lib'

import Placeholder, {
  InlinePlaceholder
} from '../../base/components/Placeholder'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('title', node)) {
    return <Placeholder>Titel</Placeholder>
  }

  if (isBlock('subject', node)) {
    return <InlinePlaceholder>Spitzmarke</InlinePlaceholder>
  }
  if (isBlock('lead', node)) {
    return <InlinePlaceholder>Lead</InlinePlaceholder>
  }
  if (isBlock('credit', node)) {
    return <Placeholder>Autoren, Datum</Placeholder>
  }
}
