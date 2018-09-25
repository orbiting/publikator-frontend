import React from 'react'
import { SchemaComponent } from '../../base/components/Schema'
import { css } from 'glamor'

import { isBlock } from '../../base/lib'

const styles = {
  edgeToEdge: css({
    width: '100vw',
    marginLeft: '-15px',
    [`@media only screen and (min-width: 665px)`]: {
      marginLeft: `calc(-100vw / 2 + 665px / 2)`,
      marginRight: `calc(-100vw / 2 + 665px / 2)`
    }
  })
}

export default ({
  node,
  attributes,
  children
}) => {
  if (isBlock('figure', node)) {
    return node.data.get('size') ===
      'edgeToEdge' ? (
        <div
          key='content-edgeToEdge'
          {...styles.edgeToEdge}
        >
          <SchemaComponent
            name='figure'
            {...attributes}
          >
            {children}
          </SchemaComponent>
        </div>
      ) : (
        <SchemaComponent
          name='figure'
          key='content'
          {...attributes}
          size={node.data.get('size')}
        >
          {children}
        </SchemaComponent>
      )
  }
}
