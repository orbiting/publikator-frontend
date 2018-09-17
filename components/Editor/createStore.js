import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import { reducer as form } from 'redux-form'
import { reducer as document } from './apps/document'
import { reducer as selectionPath } from './apps/selectionPath'
import { reducer as editMode } from './apps/editMode'
import { reducer as theme } from './apps/theme'

export const reducer = combineReducers({
  form,
  selectionPath,
  document,
  editMode,
  theme,
})

export default initialState => {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware)
    )
  )
}
