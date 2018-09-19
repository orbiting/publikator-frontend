import Placeholder from '../../Editor/components/Placeholder'
import { isBlock } from '../../Editor/lib'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('infoBoxTitle', node)) {
    return <Placeholder>Titel</Placeholder>
  }

  if (isBlock('infoBoxText', node)) {
    return <Placeholder>Text</Placeholder>
  }
}
