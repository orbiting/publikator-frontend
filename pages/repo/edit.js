import { compose } from 'redux'
import { withRouter } from 'next/router'

import withAuthorization from '../../components/Auth/withAuthorization'
import EditPage from '../../components/Repo/Edit'

export default compose(
  withAuthorization(['editor']),
  withRouter
)(EditPage)
