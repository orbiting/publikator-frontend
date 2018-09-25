import React from 'react'
import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'

export default ({
  node,
  children,
  attributes
}) => {
  if (isBlock('caption', node)) {
    return (
      <SchemaComponent
        name='caption'
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('captionText', node)) {
    return (
      <span key='content' {...attributes}>
        {children}
      </span>
    )
  }

  if (isBlock('captionByline', node)) {
    return (
      <SchemaComponent
        name='captionByline'
        key='content'
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }
}
