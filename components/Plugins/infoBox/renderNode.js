import React, { Fragment } from 'react'
import { compose, ifElse, always } from 'ramda'

import { SchemaComponent } from '../../Editor/components/Schema'

import {
  safeProp,
  isBlock,
} from '../../Editor/lib'

import {
  InfoBoxUI,
  InfoBoxTitleUI,
  InfoBoxTextUI,
} from './ui'

export default compose(
  ifElse(
    compose(
      isBlock('infoBox'),
      safeProp('node')
    ),
    ({ children, attributes, node, editor }) => {
      return (
        <Fragment>
          <InfoBoxUI
            key="ui"
            node={node}
            editor={editor}
          />
          <SchemaComponent
            name="infoBox"
            key="content"
            attributes={attributes}
            size={node.data.get('size')}
            figureSize={node.data.get(
              'figureSize'
            )}
          >
            {children}
          </SchemaComponent>
        </Fragment>
      )
    }
  ),
  ifElse(
    compose(
      isBlock('infoBoxTitle'),
      safeProp('node')
    ),
    ({ node, editor, children, attributes }) => (
      <Fragment>
        <InfoBoxTitleUI
          key="ui"
          node={node}
          editor={editor}
        />
        <SchemaComponent
          name="infoBoxTitle"
          key="content"
          attributes={attributes}
        >
          <span
            style={{
              display: 'block',
              position: 'relative',
            }}
          >
            {children}
          </span>
        </SchemaComponent>
      </Fragment>
    )
  ),
  ifElse(
    compose(
      isBlock('infoBoxText'),
      safeProp('node')
    ),
    ({ node, children, attributes, editor }) => (
      <Fragment>
        <InfoBoxTextUI
          key="ui"
          node={node}
          editor={editor}
        />
        <SchemaComponent
          name="infoBoxText"
          key="content"
          attributes={{
            ...attributes,
            style: { position: 'relative' },
          }}
        >
          {children}
        </SchemaComponent>
      </Fragment>
    )
  )
)(always(undefined))
