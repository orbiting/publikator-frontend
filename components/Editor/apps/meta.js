import { compose, dissoc } from 'ramda'
import { updateMeta } from '../lib/changes'
import { connect } from 'react-redux'

const mapToFieldFromFactory = (
  fieldName,
  factory
) => (state, { editor }) =>
  factory(
    editor.value.document.data.get(fieldName),
    value => {
      editor.change(updateMeta, {
        [fieldName]: value,
      })
    }
  )

const mapFromFactory = factory => (
  state,
  { editor }
) =>
  factory(editor.value.document.data, value => {
    editor.change(updateMeta, value)
  })

const defaultFactory = (value, onChange) => ({
  value,
  onChange,
})

const cleanProps = compose(dissoc('editor'))

export const withMeta = ({
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
