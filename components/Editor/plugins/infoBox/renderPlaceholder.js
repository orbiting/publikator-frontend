import Placeholder from '../../base/components/Placeholder'
import { isBlock } from '../../base/lib'

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
