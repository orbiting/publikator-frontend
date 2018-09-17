import React, { Fragment } from 'react'
import { SchemaComponent } from '../../Editor/components/Schema'
import { compose, always, ifElse } from 'ramda'

import {
  safeProp,
  isBlock,
} from '../../Editor/lib'

import { CoverUI } from './ui'

export default ifElse(
  compose(
    isBlock('cover'),
    safeProp('node')
  ),
  ({ node, attributes, children, editor }) => (
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
  ),
  always(undefined)
)
