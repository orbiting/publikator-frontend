import { FaBold as BoldIcon } from 'react-icons/fa'
import ToggleMarkButton from '../../base/components/ToggleMarkButton'
import { withTheme } from '../../base/apps/theme'

export const BoldButton = withTheme()(props => (
  <ToggleMarkButton
    mark={'bold'}
    {...props}
    {...props.styles.buttons.iconButton}
  >
    <BoldIcon size={22} />
  </ToggleMarkButton>
))
