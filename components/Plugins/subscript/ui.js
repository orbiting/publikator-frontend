import { FaSubscript as SubIcon } from 'react-icons/fa'
import ToggleMarkButton from '../../Editor/components/ToggleMarkButton'
import { withTheme } from '../../Editor/apps/theme'

export const SubButton = withTheme()(props => (
  <ToggleMarkButton
    mark={'sub'}
    {...props}
    {...props.styles.buttons.iconButton}
  >
    <SubIcon size={22} />
  </ToggleMarkButton>
))
