import { dissoc } from 'ramda'
import { connect } from 'react-redux'
import {
  getSelectionPath,
  isCompleteBlockSelected
} from '../lib/selection'
import { isType } from '../lib'

import { CHANGE } from './document'

export const DOM_NODE_ID = 'PUBLIKATOR_SELECTION_PATH'
export const SELECT_NODE = 'SELECT_NODE'

export const selectNode = node => ({
  type: SELECT_NODE,
  payload: { node }
})

const mapStateToSelectionStatusProps = (
  { selectionPath: { selectionPath, selectedNode } },
  { offset, isNode: typeOrFn }
) => {
  const isNode =
    typeof typeOrFn === 'string' ? isType(typeOrFn) : typeOrFn

  let node
  if (isNode(selectedNode)) {
    node = selectedNode
  } else if (offset && selectedNode) {
    const index = selectionPath.findIndex(n => n === selectedNode)
    node = selectionPath
      .take(index)
      .takeLast(offset)
      .find(isNode)
  }

  return {
    isSelected: !!node,
    node
  }
}

const cleanProps = dissoc('offset')

export const withSelectionStatus = ({ passProps = false } = {}) => {
  return connect(
    mapStateToSelectionStatusProps,
    null,
    (stateProps, dispatchProps, ownProps) => ({
      ...stateProps,
      ...((passProps && ownProps) || cleanProps(ownProps))
    })
  )
}

export const withApp = connect(
  state => ({
    selectionPath: state.selectionPath.selectionPath,
    selectedNode: state.selectionPath.selectedNode
  }),
  dispatch => ({
    onSelect: node => dispatch(selectNode(node))
  })
)

const initialState = {
  selectedNode: null,
  selectionPath: null,
  previousKeys: null
}

export const reducer = (state = initialState, { type, payload }) => {
  let value
  switch (type) {
    case CHANGE:
      value = payload.change.value
      if (!value.document) {
        return state
      }
      if (isCompleteBlockSelected(value)) {
        const selectionPath = getSelectionPath(value)

        const nextKeys = selectionPath.map(n => n.key).valueSeq()
        const haveKeysChanged = !nextKeys.equals(state.previousKeys)

        const selectedNode = haveKeysChanged
          ? selectionPath.last()
          : state.selectedNode &&
            value.document.getNode(state.selectedNode.key)

        return {
          selectionPath,
          selectedNode,
          previousKeys: nextKeys
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
