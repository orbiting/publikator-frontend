import { Fragment } from 'react'
import { Label } from '@project-r/styleguide'
import { withTheme } from '../../Editor/apps/theme'
import Selected from '../../Editor/components/Selected'
import {
  SidebarFormatOptions,
  SidebarTextOptions,
} from '../../Editor/components/UI'

import { TextButtons } from '../common/ui'
import { BoldButton } from '../bold/ui'
import { LinkButton } from '../link/ui'

export const CaptionTextUI = withTheme()(
  ({ styles, editor }) => {
    return (
      <Selected node="captionText" offset={1}>
        {({ node }) => (
          <Fragment>
            <SidebarFormatOptions>
              <div {...styles.layout.container}>
                <div
                  {...styles.layout.sectionHeader}
                >
                  <Label>Format</Label>
                </div>
                <div {...styles.layout.section}>
                  <BoldButton editor={editor} />
                  <LinkButton editor={editor} />
                </div>
              </div>
            </SidebarFormatOptions>
            <SidebarTextOptions>
              <TextButtons
                editor={editor}
                node={node}
              />
            </SidebarTextOptions>
          </Fragment>
        )}
      </Selected>
    )
  }
)

export const CaptionBylineUI = withTheme()(
  ({ styles, editor }) => (
    <Selected node="captionByline" offset={1}>
      {({ node }) => (
        <Fragment>
          <SidebarFormatOptions>
            <div {...styles.layout.container}>
              <div
                {...styles.layout.sectionHeader}
              >
                <Label>Format</Label>
              </div>
              <div {...styles.layout.actions}>
                <LinkButton editor={editor} />
              </div>
            </div>
          </SidebarFormatOptions>
          <SidebarTextOptions>
            <TextButtons
              editor={editor}
              node={node}
            />
          </SidebarTextOptions>
        </Fragment>
      )}
    </Selected>
  )
)

export const renderUI = ({ editor }) => {
  return (
    <Fragment>
      <CaptionTextUI editor={editor} />
      <CaptionBylineUI editor={editor} />
    </Fragment>
  )
}
