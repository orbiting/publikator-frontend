import { Label } from '@project-r/styleguide'
import { FaImage as ImageIcon } from 'react-icons/fa'
import { withTheme } from '../../base/apps/theme'
import InsertBlockButton from '../../base/components/InsertBlockButton'
import Selected from '../../base/components/Selected'
import { SidebarTop } from '../../base/components/UI'

import {
  SizeButton,
  BreakoutIcon,
  DefaultIcon
} from '../common/breakouts.js'

import { getNew } from './lib'

export const InsertFigureGroupButton = withTheme()(
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

export const FigureGroupUI = withTheme()(
  ({ styles, editor }) => (
    <Selected isNode='figureGroup' offset={3}>
      {({ node }) => (
        <SidebarTop>
          <div {...styles.layout.container}>
            <div {...styles.layout.headerSection}>
              <Label>Bildergruppe</Label>
            </div>
            <hr {...styles.layout.hairline} />
            <div {...styles.layout.headerSection}>
              <Label>Grösse</Label>
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
            </div>
          </div>
        </SidebarTop>
      )}
    </Selected>
  )
)

export const renderUI = ({ editor }) => {
  return <FigureGroupUI editor={editor} />
}
