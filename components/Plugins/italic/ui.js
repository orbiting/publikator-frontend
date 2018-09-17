import { FaItalic as ItalicIcon } from 'react-icons/fa'
import ToggleMarkButton from '../../Editor/components/ToggleMarkButton'
import { withTheme } from '../../Editor/apps/theme'

export const ItalicButton = withTheme()(props => (
  <ToggleMarkButton
    mark={'italic'}
    {...props}
    {...props.styles.buttons.iconButton}
  >
    <ItalicIcon size={22} />
  </ToggleMarkButton>
))
