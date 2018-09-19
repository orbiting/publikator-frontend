import React, { Fragment } from 'react'

import { FaHeading as SubheadIcon } from 'react-icons/fa'
import FormatBlockButton from '../../Editor/components/FormatBlockButton'
import { withTheme } from '../../Editor/apps/theme'
import Selected from '../../Editor/components/Selected'
import {
  SidebarTextOptions,
  SidebarInsertOptions,
  SidebarBlockOptions,
} from '../../Editor/components/UI'

import {
  BlockButtons,
  TextButtons,
  InsertButtons,
} from '../common/ui'

export const SubheadButton = withTheme()(
  props => (
    <FormatBlockButton
      block={'subhead'}
      {...props}
      {...props.styles.buttons.iconButton}
    >
      <SubheadIcon size={22} />
    </FormatBlockButton>
  )
)

export const SubheadUI = (
  <Selected offset={1} block="subhead">
    {({ node, editor }) => (
      <Fragment>
        <SidebarInsertOptions>
          <InsertButtons
            node={node}
            editor={editor}
          />
        </SidebarInsertOptions>
        <SidebarBlockOptions>
          <BlockButtons
            node={node}
            editor={editor}
          />
        </SidebarBlockOptions>
        <SidebarTextOptions>
          <TextButtons
            node={node}
            editor={editor}
          />
        </SidebarTextOptions>
      </Fragment>
    )}
  </Selected>
)
