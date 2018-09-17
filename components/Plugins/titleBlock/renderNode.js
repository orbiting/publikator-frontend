import React, { Fragment } from 'react'
import { SchemaComponent } from '../../Editor/components/Schema'
import { withMeta } from '../../Editor/apps/meta'
import { compose, ifElse, always } from 'ramda'

import {
  safeProp,
  isBlock,
} from '../../Editor/lib'

import { CreditsUI } from './ui'

const withMetaFormat = withMeta({
  fieldName: 'format',
})

const TitleBlock = withMetaFormat(
  ({ children, attributes, value: format }) => {
    return (
      <SchemaComponent
        name="titleBlock"
        {...attributes}
      >
        {format && (
          <SchemaComponent
            name="format"
            contentEditable={false}
          >
            {format}
          </SchemaComponent>
        )}

        {children}
      </SchemaComponent>
    )
  }
)

export default compose(
  ifElse(
    compose(
      isBlock('title'),
      safeProp('node')
    ),
    ({ children, attributes }) => (
      <SchemaComponent
        name="title"
        style={{ position: 'relative' }}
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  ),
  ifElse(
    compose(
      isBlock('subject'),
      safeProp('node')
    ),
    ({ children, attributes }) => (
      <SchemaComponent
        name="subject"
        style={{ position: 'relative' }}
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  ),
  ifElse(
    compose(
      isBlock('lead'),
      safeProp('node')
    ),
    ({ children, attributes }) => (
      <SchemaComponent
        name="lead"
        style={{ position: 'relative' }}
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  ),
  ifElse(
    compose(
      isBlock('credits'),
      safeProp('node')
    ),
    ({ children, attributes, editor, node }) => (
      <Fragment>
        <CreditsUI
          key="ui"
          node={node}
          editor={editor}
        />
        <SchemaComponent
          name="credits"
          key="content"
          style={{ position: 'relative' }}
          {...attributes}
        >
          {children}
        </SchemaComponent>
      </Fragment>
    )
  ),
  ifElse(
    compose(
      isBlock('titleBlock'),
      safeProp('node')
    ),
    props => <TitleBlock {...props} />
  )
)(always(undefined))
