import { Label } from '@project-r/styleguide'
import { withTheme } from '../../base/apps/theme'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'

import {
  SizeButton,
  TinyIcon,
  DefaultIcon,
  EdgeToEdgeIcon
} from '../common/breakouts.js'

export const CoverUI = withTheme()(
  ({ styles, editor }) => {
    return (
      <Selected nodeType='cover' offset={2}>
        {({ node }) => (
          <SidebarBottom>
            <div {...styles.layout.container}>
              <div
                {...styles.layout.sectionHeader}
              >
                <Label>Cover</Label>
              </div>
              <hr {...styles.layout.hairline} />
              <div
                {...styles.layout.sectionHeader}
              >
                <Label>Grösse</Label>
              </div>
              <div {...styles.layout.actions}>
                <SizeButton
                  name='tiny'
                  node={node}
                  editor={editor}
                >
                  <TinyIcon />
                </SizeButton>
                <SizeButton
                  name='center'
                  node={node}
                  editor={editor}
                >
                  <DefaultIcon />
                </SizeButton>
                <SizeButton
                  name={null}
                  node={node}
                  editor={editor}
                >
                  <EdgeToEdgeIcon />
                </SizeButton>
              </div>
            </div>
          </SidebarBottom>
        )}
      </Selected>
    )
  }
)

export const renderUI = ({ editor }) => {
  return <CoverUI editor={editor} />
}
