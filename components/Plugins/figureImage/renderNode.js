import React, { Fragment } from 'react'
import { compose, ifElse, always } from 'ramda'
import { SchemaComponent } from '../../Editor/components/Schema'
import Selected from '../../Editor/components/Selected'
import { withTheme } from '../../Editor/apps/theme'

import {
  safeProp,
  isBlock,
} from '../../Editor/lib'

import {
  FigureImageUI,
  SelectImageButton,
} from './ui'

const FigureImage = withTheme()(
  ({ node, attributes, editor, styles }) => (
    <Fragment>
      <FigureImageUI
        key="ui"
        node={node}
        editor={editor}
      />
      <SelectImageButton
        useAltKey={true}
        key="content"
        node={node}
        editor={editor}
        style={{
          position: 'relative',
          display: 'block',
        }}
      >
        <Selected node={node}>
          <span {...styles.layout.outline} />
        </Selected>
        {!!node.data.get('url') ? (
          <SchemaComponent
            name="figureImage"
            src={node.data.get('url')}
            title={node.data.get('title')}
            alt={node.data.get('alt')}
            {...attributes}
          />
        ) : (
          <SchemaComponent
            name="figureImage"
            src="/static/images/placeholder.png"
            {...attributes}
          />
        )}
      </SelectImageButton>
    </Fragment>
  )
)

export default ifElse(
  compose(
    isBlock('figureImage'),
    safeProp('node')
  ),
  props => <FigureImage {...props} />,
  always(undefined)
)
