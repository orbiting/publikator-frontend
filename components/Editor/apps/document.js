import { connect } from 'react-redux'
import { Value } from 'slate'

export const CHANGE = 'CHANGE'
export const REVERT = 'REVERT'
export const COMMIT = 'COMMIT'
export const RESET = 'RESET'

export const change = t => ({
  type: CHANGE,
  payload: { change: t },
})

export const revert = () => ({
  type: REVERT,
})

export const commit = () => ({
  type: COMMIT,
})

export const reset = value => ({
  type: RESET,
  payload: { value },
})

export const withEditor = connect(
  ({ document }, { value: valueFromProps }) => {
    return {
      value:
        document.current ||
        valueFromProps ||
        Value.create(),
    }
  },
  (dispatch, { onChange = () => {} }) => {
    return {
      onChange: t => {
        let mutated = onChange && onChange(t)
        dispatch(change(mutated || t))
      },
    }
  }
)

export const withValue = connect(
  ({ document }) => {
    return { value: document.current }
  },
  () => ({})
)

export const withDocumentStatus = connect(
  ({ document }) => ({
    hasDocumentChanged:
      document.current.document !==
      document.initial.document,
  }),
  dispatch => ({
    commit: dispatch(commit()),
    revert: dispatch(revert()),
    reset: value => dispatch(reset(value)),
  })
)

const initialState = {
  current: null,
  initial: null,
}

export const reducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case CHANGE:
      return {
        initial: !state.initial
          ? payload.change.value
          : state.initial,
        current: payload.change.value,
      }
    case REVERT:
      return {
        initial: state.initial,
        current: state.initial,
      }
    case COMMIT:
      return {
        initial: state.current,
        current: state.current,
      }
    case RESET:
      return {
        initial: payload.value,
        current: payload.value,
      }
    default:
      return state
  }
}
