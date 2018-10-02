import { Fragment } from 'react'
import { Label, Checkbox } from '@project-r/styleguide'
import { withTheme } from '../../base/apps/theme'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'
import { isBlock, isDocument } from '../../base/lib'
import {
  insertBlockBefore,
  removeBlock
} from '../../base/lib/changes'

import {
  SizeButton,
  TinyIcon,
  DefaultIcon,
  EdgeToEdgeIcon
} from '../common/breakouts.js'

import { getNew } from './lib'

const CoverToggleUI = withTheme()(({ editor, styles }) => {
  return (
    <Selected isNode={isDocument}>
      {({ node }) => {
        const maybeCover = node.nodes.first()
        const hasCover = isBlock('cover', maybeCover)
        return (
          <SidebarBottom>
            <div {...styles.layout.container}>
              <div {...styles.layout.section}>
                <Checkbox
                  checked={!!hasCover}
                  onChange={() =>
                    hasCover
                      ? editor.change(removeBlock, maybeCover)
                      : editor.change(
                        insertBlockBefore,
                        getNew(),
                        maybeCover
                      )
                  }
                >
                  Mit Cover?
                </Checkbox>
              </div>
            </div>
          </SidebarBottom>
        )
      }}
    </Selected>
  )
})

export const CoverUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='cover' offset={2}>
      {({ node }) => (
        <SidebarBottom>
          <div {...styles.layout.container}>
            <div {...styles.layout.sectionHeader}>
              <Label>Grösse</Label>
            </div>
            <div {...styles.layout.iconGroup}>
              <SizeButton name='tiny' node={node} editor={editor}>
                <TinyIcon />
              </SizeButton>
              <SizeButton name='center' node={node} editor={editor}>
                <DefaultIcon />
              </SizeButton>
              <SizeButton name={null} node={node} editor={editor}>
                <EdgeToEdgeIcon />
              </SizeButton>
            </div>
          </div>
        </SidebarBottom>
      )}
    </Selected>
  )
})

export const renderUI = ({ editor }) => {
  return (
    <Fragment>
      <CoverUI editor={editor} />
      <CoverToggleUI editor={editor} />
    </Fragment>
  )
}
