import { isBlock } from '../../Editor/lib'

import Placeholder from '../../Editor/components/Placeholder'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('title')) {
    return <Placeholder>Titel</Placeholder>
  }

  if (isBlock('subject')) {
    return <Placeholder>Spitzmarke</Placeholder>
  }
  if (isBlock('lead')) {
    return <Placeholder>Lead</Placeholder>
  }
  if (isBlock('credits')) {
    return (
      <Placeholder>Autoren, Datum</Placeholder>
    )
  }
}
