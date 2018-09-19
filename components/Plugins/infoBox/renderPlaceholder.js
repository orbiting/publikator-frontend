import Placeholder from '../../Editor/components/Placeholder'
import { isBlock } from '../../Editor/lib'

export default ({ node }) => {
  if (node.text.trim() !== '') {
    return
  }
  if (isBlock('infoBoxTitle')) {
    return <Placeholder>Titel</Placeholder>
  }

  if (isBlock('infoBoxText')) {
    return <Placeholder>Text</Placeholder>
  }
}
