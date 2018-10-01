import { Fragment } from 'react'
import { compose } from 'ramda'
import { Label } from '@project-r/styleguide'
import {
  MdFormatAlignCenter as AlignCenterIcon,
  MdFormatAlignLeft as AlignLeftIcon
} from 'react-icons/md'

import { withTheme } from '../../base/apps/theme'
import { withNodeData } from '../../base/apps/nodeData'
import Selected from '../../base/components/Selected'
import {
  SidebarFormatOptions,
  SidebarBottom,
  SidebarTextOptions
} from '../../base/components/UI'

import { TextButtons } from '../common/ui'
import { LinkButton } from '../link/ui'

const TitleBlockForm = compose(
  withTheme(),
  withNodeData({ fieldName: 'center' })
)(({ styles, value: center, onChange }) => {
  return (
    <div {...styles.layout.container}>
      <div {...styles.layout.sectionHeader}>
        <Label>Textausrichtung</Label>
      </div>
      <div {...styles.layout.actions}>
        <button
          {...styles.buttons.iconButton}
          data-active={!center}
          disabled={!center}
          onClick={() => onChange(false)}
        >
          <AlignLeftIcon size={25} />
        </button>
        <button
          {...styles.buttons.iconButton}
          data-active={center}
          disabled={center}
          onClick={() => onChange(true)}
        >
          <AlignCenterIcon size={25} />
        </button>
      </div>
    </div>
  )
})

export const TitleBlockUI = ({ editor }) => {
  return (
    <Selected isNode='titleBlock' offset={1}>
      {({ node }) => (
        <Fragment>
          <SidebarBottom>
            <TitleBlockForm node={node} editor={editor} />
          </SidebarBottom>
          <SidebarTextOptions>
            <TextButtons editor={editor} node={node} />
          </SidebarTextOptions>
        </Fragment>
      )}
    </Selected>
  )
}

export const CreditsUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='credit' offset={1}>
      {() => (
        <SidebarFormatOptions>
          <div {...styles.layout.container}>
            <div {...styles.layout.sectionHeader}>
              <Label>Format</Label>
            </div>
            <div {...styles.layout.actions}>
              <LinkButton editor={editor} />
            </div>
          </div>
        </SidebarFormatOptions>
      )}
    </Selected>
  )
})

export const renderUI = ({ editor }) => {
  return (
    <Fragment>
      <TitleBlockUI editor={editor} />
      <CreditsUI editor={editor} />
    </Fragment>
  )
}
