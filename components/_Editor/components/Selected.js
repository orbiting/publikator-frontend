import { Fragment } from 'react'
import { withSelectionStatus } from '../apps/selectionPath'

export default withSelectionStatus()(
  ({ children, isSelected }) => {
    return (
      (isSelected && (
        <Fragment>{children}</Fragment>
      )) ||
      null
    )
  }
)
