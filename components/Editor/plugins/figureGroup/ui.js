import { Fragment } from 'react'
import { Label } from '@project-r/styleguide'
import { withTheme } from '../../base/apps/theme'
import { isBlock } from '../../base/lib'
import Selected from '../../base/components/Selected'
import Toolbar from '../toolbar'
import { SidebarBottom } from '../../base/components/UI'

import {
  SizeButton,
  BreakoutIcon,
  DefaultIcon
} from '../common/breakouts.js'

import { getNewFigureGroupFigure } from './lib'

const FigureGroupToolbar = Toolbar({
  offset: 2,
  isNode: isBlock('figureGroup'),
  isChildNode: isBlock('figureGroupFigure'),
  insertItems: [
    {
      text: 'Figure',
      value: getNewFigureGroupFigure
    }
  ]
})

export const FigureGroupUI = withTheme()(({ styles, editor }) => (
  <Selected isNode='figureGroup' offset={3}>
    {({ node }) => (
      <SidebarBottom>
        <div {...styles.layout.container}>
          <div {...styles.layout.headerSection}>
            <Label>Bildergruppe</Label>
          </div>
          <hr {...styles.layout.hairline} />
          <div {...styles.layout.headerSection}>
            <Label>Grösse</Label>
          </div>
          <div {...styles.layout.section}>
            <SizeButton name={null} node={node} editor={editor}>
              <DefaultIcon />
            </SizeButton>
            <SizeButton name={'breakout'} node={node} editor={editor}>
              <BreakoutIcon />
            </SizeButton>
          </div>
        </div>
      </SidebarBottom>
    )}
  </Selected>
))

export const renderUI = ({ editor }) => {
  return (
    <Fragment>
      <FigureGroupToolbar editor={editor} />
      <FigureGroupUI editor={editor} />
    </Fragment>
  )
}
