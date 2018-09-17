import { compose, dissoc } from 'ramda'
import { updateData } from '../lib/changes'
import { connect } from 'react-redux'

const mapToFieldFromFactory = (
  fieldName,
  factory
) => (state, { editor, node }) =>
  factory(node.data.get(fieldName), value => {
    editor.change(updateData, node, {
      [fieldName]: value,
    })
  })

const mapFromFactory = factory => (
  state,
  { editor, node }
) =>
  factory(node.data, value => {
    editor.change(updateData, node, value)
  })

const defaultFactory = (value, onChange) => ({
  value,
  onChange,
})

const cleanProps = compose(
  dissoc('node'),
  dissoc('editor')
)

export const withNodeData = ({
  fieldName = null,
  factory = defaultFactory,
  passProps = false,
} = {}) => {
  const mapStateToProps = !fieldName
    ? mapFromFactory(factory)
    : mapToFieldFromFactory(fieldName, factory)

  return connect(
    mapStateToProps,
    null,
    (stateProps, dispatchProps, ownProps) => ({
      ...stateProps,
      ...((passProps && ownProps) ||
        cleanProps(ownProps)),
    })
  )
}
