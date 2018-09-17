import React from 'react'
import PropTypes from 'prop-types'
import { Editor as SlateEditor } from 'slate-react'

import { withEditor } from '../apps/document'
import { SchemaProvider } from './Schema'

const Editor = withEditor(SlateEditor)

const PublikatorEditor = ({
  schema,
  plugins,
  value,
  onChange,
  readOnly,
}) => (
  <SchemaProvider schema={schema}>
    <Editor
      spellCheck={false}
      autoFocus={false}
      plugins={plugins}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </SchemaProvider>
)

PublikatorEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object.isRequired,
  plugins: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
}

export default PublikatorEditor
