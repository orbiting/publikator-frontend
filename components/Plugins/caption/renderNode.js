import React, { Fragment } from 'react'
import { SchemaComponent } from '../../Editor/components/Schema'

import { compose, always, ifElse } from 'ramda'

import {
  safeProp,
  isBlock,
} from '../../Editor/lib'

import {
  CaptionTextUI,
  CaptionBylineUI,
} from './ui'

export default compose(
  ifElse(
    compose(
      isBlock('caption'),
      safeProp('node')
    ),
    ({ children, attributes }) => (
      <SchemaComponent
        name="caption"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  ),
  ifElse(
    compose(
      isBlock('captionText'),
      safeProp('node')
    ),
    ({ node, children, attributes, editor }) => (
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
  ),
  ifElse(
    compose(
      isBlock('captionByline'),
      safeProp('node')
    ),
    ({ node, children, attributes, editor }) => (
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
  )
)(always(undefined))
