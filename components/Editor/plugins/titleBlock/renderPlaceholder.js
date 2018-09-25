import { isBlock } from '../../base/lib'

import Placeholder from '../../base/components/Placeholder'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('title', node)) {
    return <Placeholder>Titel</Placeholder>
  }

  if (isBlock('subject', node)) {
    return <Placeholder>Spitzmarke</Placeholder>
  }
  if (isBlock('lead', node)) {
    return <Placeholder>Lead</Placeholder>
  }
  if (isBlock('credit', node)) {
    return (
      <Placeholder>Autoren, Datum</Placeholder>
    )
  }
}
