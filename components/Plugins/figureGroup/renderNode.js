import React, { Fragment } from 'react'

import { SchemaComponent } from '../../Editor/components/Schema'

import { ifElse, compose, always } from 'ramda'
import {
  safeProp,
  isBlock,
} from '../../Editor/lib'

import { FigureGroupUI } from './ui'

export default compose(
  ifElse(
    compose(
      isBlock('figureGroup'),
      safeProp('node')
    ),
    ({ children, attributes, node, editor }) => {
      return (
        <Fragment>
          <FigureGroupUI
            key="ui"
            node={node}
            editor={editor}
          />
          <SchemaComponent
            name="figureGroup"
            key="content"
            size={node.data.get('size')}
            columns={node.data.get('columns')}
            {...attributes}
          >
            {children}
          </SchemaComponent>
        </Fragment>
      )
    }
  ),
  ifElse(
    compose(
      isBlock('figureGroupFigure'),
      safeProp('node')
    ),
    ({ attributes, children }) => (
      <SchemaComponent
        name="figureGroupFigure"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  )
)(always(undefined))
