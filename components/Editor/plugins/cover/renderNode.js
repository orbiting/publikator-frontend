import React from 'react'
import { SchemaComponent } from '../../base/components/Schema'

import { isBlock } from '../../base/lib'

export default ({
  node,
  attributes,
  children
}) => {
  if (isBlock('cover', node)) {
    return (
      <SchemaComponent
        name='cover'
        key='content'
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
