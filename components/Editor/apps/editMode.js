import { connect } from 'react-redux'

export const START_EDITING = 'START_EDITING'
export const FINISH_EDITING = 'FINISH_EDITING'

export const startEditing = namespace => ({
  type: START_EDITING,
  payload: { namespace },
})

export const finishEditing = namespace => ({
  type: FINISH_EDITING,
  payload: { namespace },
})

export const withEditMode = ({ namespace }) =>
  connect(
    ({ editMode: state }) => {
      return {
        isInEditMode:
          typeof state[namespace] !==
            'undefined' && state[namespace],
      }
    },
    dispatch => {
      return {
        startEditing: () =>
          dispatch(startEditing(namespace)),
        finishEditing: () =>
          dispatch(finishEditing(namespace)),
      }
    }
  )

export const reducer = (
  state = {},
  { type, payload }
) => {
  switch (type) {
    case START_EDITING:
      return {
        ...state,
        [payload.namespace]: true,
      }
    case FINISH_EDITING:
      return {
        ...state,
        [payload.namespace]: false,
      }
    default:
      return state
  }
}
