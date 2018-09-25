import {
  createStore,
  combineReducers
} from 'redux'

import { reducer as document } from './apps/document'
import { reducer as selectionPath } from './apps/selectionPath'
import { reducer as editMode } from './apps/editMode'
import { reducer as theme } from './apps/theme'

export const reducer = combineReducers({
  selectionPath,
  document,
  editMode,
  theme
})

export default initialState => {
  return createStore(
    reducer,
    initialState
  )
}
