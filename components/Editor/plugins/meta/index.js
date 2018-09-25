import React from 'react'
import { SchemaValue } from '../../base/components/Schema'

import MetaData from './ui'

export default {
  renderEditor ({ value, children }, editor) {
    return (
      <SchemaValue name='schema'>
        {({ schema }) => (
          <SchemaValue name='meta'>
            {({ meta }) => (
              <div>
                {children}
                <MetaData
                  value={value}
                  editor={editor}
                  {...meta.editorOptions}
                  mdastSchema={schema}
                  contextMeta={value && value.document.data.toJS()}
                />
              </div>
            )}
          </SchemaValue>
        )}
      </SchemaValue>
    )
  }
}
