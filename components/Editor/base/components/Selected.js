import { withSelectionStatus } from '../apps/selectionPath'

export default withSelectionStatus()(
  ({ children, isSelected, node }) => {
    return (
      (isSelected && children({ node })) || null
    )
  }
)
