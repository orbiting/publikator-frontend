import React, { Fragment } from 'react'
import { ifElse, compose, always } from 'ramda'
import { SchemaComponent } from '../../Editor/components/Schema'
import onKeyDown from './onKeyDown'

import {
  isBlock,
  safeProp,
} from '../../Editor/lib'

import { ListUI } from './ui'

export default {
  onKeyDown,
  renderNode: compose(
    ifElse(
      compose(
        isBlock('list'),
        safeProp('node')
      ),
      ({
        node,
        children,
        attributes,
        editor,
      }) => (
        <Fragment>
          <ListUI
            key="ui"
            node={node}
            editor={editor}
          />
          <SchemaComponent
            name="list"
            key="content"
            data={node.data.toJS()}
            {...attributes}
          >
            {children}
          </SchemaComponent>
        </Fragment>
      )
    ),
    ifElse(
      compose(
        isBlock('listItem'),
        safeProp('node')
      ),
      ({ children, attributes }) => (
        <SchemaComponent
          name="listItem"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    )
  )(always(undefined)),
}
