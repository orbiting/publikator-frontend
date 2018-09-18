import React, { Fragment } from 'react'
import { SchemaComponent } from '../../Editor/components/Schema'

import { isBlock } from '../../Editor/lib'
import { CoverUI } from './ui'

export default ({
  node,
  attributes,
  children,
  editor,
}) => {
  if (isBlock('cover', node)) {
    return (
      <Fragment>
        <CoverUI
          key="ui"
          node={node}
          editor={editor}
        />
        <SchemaComponent
          name="cover"
          key="content"
          {...attributes}
          size={
            node.data.get('size') === 'edgeToEdge'
              ? undefined
              : node.data.get('size')
          }
        >
          {children}
        </SchemaComponent>
      </Fragment>
    )
  }
}
