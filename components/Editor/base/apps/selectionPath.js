import { dissoc } from 'ramda'
import { connect } from 'react-redux'
import {
  getSelectionPath,
  isCompleteBlockSelected
} from '../lib/selection'

import { CHANGE } from './document'

export const DOM_NODE_ID =
  'PUBLIKATOR_SELECTION_PATH'
export const SELECT_NODE = 'SELECT_NODE'

export const selectNode = node => ({
  type: SELECT_NODE,
  payload: { node }
})

const mapStateToSelectionStatusProps = (
  { selectionPath },
  { offset, nodeType }
) => {
  let node
  if (
    selectionPath.selectedNode &&
    selectionPath.selectedNode.type === nodeType
  ) {
    node = selectionPath.selectedNode
  } else if (
    offset &&
    selectionPath.selectionPath
  ) {
    node = selectionPath.selectionPath
      .skipLast(1)
      .takeLast(offset)
      .find(n => n.type === nodeType)
  }

  return {
    isSelected: !!node,
    node
  }
}

const cleanProps = dissoc('offset')

export const withSelectionStatus = ({
  passProps = false
} = {}) => {
  return connect(
    mapStateToSelectionStatusProps,
    null,
    (stateProps, dispatchProps, ownProps) => ({
      ...stateProps,
      ...((passProps && ownProps) ||
        cleanProps(ownProps))
    })
  )
}

export const withApp = connect(
  state => ({
    selectionPath:
      state.selectionPath.selectionPath,
    selectedNode:
      state.selectionPath.selectedNode
  }),
  dispatch => ({
    onSelect: node => dispatch(selectNode(node))
  })
)

const initialState = {
  selectedNode: null,
  selectionPath: null
}

export const reducer = (
  state = initialState,
  { type, payload }
) => {
  let value
  switch (type) {
    case CHANGE:
      value = payload.change.value
      if (!value.document) {
        return state
      }
      if (isCompleteBlockSelected(value)) {
        const selectionPath = getSelectionPath(
          value
        )

        return {
          selectionPath,
          selectedNode: selectionPath.last()
        }
      }
      return state
    case SELECT_NODE:
      return {
        ...state,
        selectedNode: payload.node
      }
    default:
      return state
  }
}
