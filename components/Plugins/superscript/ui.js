import { FaSuperscript as SupIcon } from 'react-icons/fa'
import ToggleMarkButton from '../../Editor/components/ToggleMarkButton'
import { withTheme } from '../../Editor/apps/theme'

export const SupButton = withTheme()(props => (
  <ToggleMarkButton
    mark={'sup'}
    {...props}
    {...props.styles.buttons.iconButton}
  >
    <SupIcon size={22} />
  </ToggleMarkButton>
))
