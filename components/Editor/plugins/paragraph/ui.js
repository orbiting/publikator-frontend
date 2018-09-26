import React, { Fragment } from 'react'
import { FaParagraph as ParagraphIcon } from 'react-icons/fa'
import { Label } from '@project-r/styleguide'
import FormatBlockButton from '../../base/components/FormatBlockButton'
import { withTheme } from '../../base/apps/theme'
import Selected from '../../base/components/Selected'
import {
  SidebarTextOptions,
  SidebarInsertOptions,
  SidebarBlockOptions,
  SidebarFormatOptions
} from '../../base/components/UI'

import {
  BlockButtons,
  TextButtons,
  InsertButtons
} from '../common/ui'
import { BoldButton } from '../bold/ui'
import { ItalicButton } from '../italic/ui'
import { LinkButton } from '../link/ui'

export const ParagraphButton = withTheme()(
  props => (
    <FormatBlockButton
      block={'paragraph'}
      {...props}
      {...props.styles.buttons.iconButton}
    >
      <ParagraphIcon size={22} />
    </FormatBlockButton>
  )
)

export const ParagraphUI = withTheme()(
  ({ styles, editor }) => (
    <Selected isNode='paragraph' offset={1}>
      {({ node }) => (
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
          <SidebarFormatOptions>
            <div {...styles.layout.container}>
              <div
                {...styles.layout.sectionHeader}
              >
                <Label>Format</Label>
              </div>
              <div {...styles.layout.actions}>
                <BoldButton
                  node={node}
                  editor={editor}
                />
                <ItalicButton
                  node={node}
                  editor={editor}
                />
                <LinkButton
                  node={node}
                  editor={editor}
                />
              </div>
            </div>
          </SidebarFormatOptions>
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
)

export const renderUI = ({ editor }) => {
  return <ParagraphUI editor={editor} />
}
