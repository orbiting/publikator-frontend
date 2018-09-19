import { Label } from '@project-r/styleguide'
import { FaImage as ImageIcon } from 'react-icons/fa'
import { withTheme } from '../../Editor/apps/theme'
import InsertBlockButton from '../../Editor/components/InsertBlockButton'
import Selected from '../../Editor/components/Selected'
import { SidebarTop } from '../../Editor/components/UI'

import {
  SizeButton,
  BreakoutIcon,
  DefaultIcon,
} from '../common/breakouts.js'

import getNew from './getNew'

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

export const FigureGroupUI = withTheme()(
  ({ styles }) => (
    <Selected block="figureGroup" offset={3}>
      {({ node, editor }) => (
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

export const renderUI = () => {
  return <FigureGroupUI />
}
