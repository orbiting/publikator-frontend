import React, { Fragment } from 'react'

import { SchemaComponent } from '../../Editor/components/Schema'
import { isBlock } from '../../Editor/lib'

import {
  CaptionTextUI,
  CaptionBylineUI,
} from './ui'

export default ({
  node,
  children,
  attributes,
  editor,
}) => {
  if (isBlock('caption', node)) {
    return (
      <SchemaComponent
        name="caption"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('captionText', node)) {
    return (
      <Fragment>
        <CaptionTextUI
          key="ui"
          node={node}
          editor={editor}
        />
        <span key="content" {...attributes}>
          {children}
        </span>
      </Fragment>
    )
  }

  if (isBlock('captionByline', node)) {
    return (
      <Fragment>
        <CaptionBylineUI
          key="ui"
          node={node}
          editor={editor}
        />
        <SchemaComponent
          name="captionByline"
          key="content"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      </Fragment>
    )
  }
}
