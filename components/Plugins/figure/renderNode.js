import React, { Fragment } from 'react'
import { SchemaComponent } from '../../Editor/components/Schema'
import { css } from 'glamor'

import { isBlock } from '../../Editor/lib'

const styles = {
  edgeToEdge: css({
    width: '100vw',
    marginLeft: '-15px',
    [`@media only screen and (min-width: 665px)`]: {
      marginLeft: `calc(-100vw / 2 + 665px / 2)`,
      marginRight: `calc(-100vw / 2 + 665px / 2)`,
    },
  }),
}

import { FigureUI } from './ui'

export default ({
  node,
  attributes,
  children,
  editor,
}) => {
  if (isBlock('figure', node)) {
    return (
      <Fragment>
        <FigureUI
          key="ui"
          node={node}
          editor={editor}
        />
        {node.data.get('size') ===
        'edgeToEdge' ? (
          <div
            key="content-edgeToEdge"
            {...styles.edgeToEdge}
          >
            <SchemaComponent
              name="figure"
              {...attributes}
            >
              {children}
            </SchemaComponent>
          </div>
        ) : (
          <SchemaComponent
            name="figure"
            key="content"
            {...attributes}
            size={node.data.get('size')}
          >
            {children}
          </SchemaComponent>
        )}
      </Fragment>
    )
  }
}
