import { FaItalic as ItalicIcon } from 'react-icons/fa'
import ToggleMarkButton from '../../base/components/ToggleMarkButton'
import { withTheme } from '../../base/apps/theme'

export const ItalicButton = withTheme()(props => (
  <ToggleMarkButton
    mark={'italic'}
    {...props}
    {...props.styles.buttons.iconButton}
  >
    <ItalicIcon size={22} />
  </ToggleMarkButton>
))
