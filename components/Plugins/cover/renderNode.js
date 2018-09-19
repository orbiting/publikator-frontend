import React from 'react'
import { SchemaComponent } from '../../Editor/components/Schema'

import { isBlock } from '../../Editor/lib'

export default ({
  node,
  attributes,
  children,
}) => {
  if (isBlock('cover', node)) {
    return (
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
    )
  }
}
