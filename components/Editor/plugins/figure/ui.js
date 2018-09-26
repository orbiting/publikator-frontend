import { Label } from '@project-r/styleguide'
import { FaImage as ImageIcon } from 'react-icons/fa'
import { withTheme } from '../../base/apps/theme'
import InsertBlockButton from '../../base/components/InsertBlockButton'
import { SidebarTop } from '../../base/components/UI'

import Selected from '../../base/components/Selected'

import {
  SizeButton,
  BreakoutIcon,
  DefaultIcon,
  EdgeToEdgeIcon
} from '../common/breakouts.js'

import { getNew } from './lib'

export const InsertFigureButton = withTheme()(
  props => {
    return (
      <InsertBlockButton
        block={getNew}
        {...props}
        {...props.styles.buttons.iconButton}
      >
        <ImageIcon size={22} />
      </InsertBlockButton>
    )
  }
)

export const FigureUI = withTheme()(
  ({ styles, editor }) => (
    <Selected isNode='figure' offset={2}>
      {({ node }) => (
        <SidebarTop>
          <div {...styles.layout.container}>
            <div {...styles.layout.headerSection}>
              <Label>Bildgrösse</Label>
            </div>
            <div {...styles.layout.section}>
              <SizeButton
                name={null}
                node={node}
                editor={editor}
              >
                <DefaultIcon />
              </SizeButton>
              <SizeButton
                name={'breakout'}
                node={node}
                editor={editor}
              >
                <BreakoutIcon />
              </SizeButton>
              <SizeButton
                name={'edgeToEdge'}
                node={node}
                editor={editor}
              >
                <EdgeToEdgeIcon />
              </SizeButton>
            </div>
          </div>
        </SidebarTop>
      )}
    </Selected>
  )
)

export const renderUI = ({ editor }) => {
  return <FigureUI editor={editor} />
}
