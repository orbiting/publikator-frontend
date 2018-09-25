import { connect } from 'react-redux'

export const CHANGE = 'CHANGE'

export const change = t => ({
  type: CHANGE,
  payload: { change: t }
})

export const withEditor = connect(
  ({ document }, { value: valueFromProps }) => {
    return {
      value:
        valueFromProps
    }
  },
  (dispatch, { onChange, valueFromProps }) => {
    return {
      onChange: t => {
        dispatch(change(t))
        onChange && onChange(t)
      }
    }
  }
)

export const withValue = connect(
  ({ document }) => {
    return { value: document.current }
  },
  () => ({})
)

const initialState = {
  current: null,
  initial: null
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
        current: payload.change.value
      }
    default:
      return state
  }
}
