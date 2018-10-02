import { Fragment } from 'react'
import { anyPass } from 'ramda'
import { Label } from '@project-r/styleguide'
import {
  SidebarBottom,
  SidebarFormatOptions
} from '../../../base/components/UI'
import { isBlock, isDocument } from '../../../base/lib'
import Selected from '../../../base/components/Selected'
import { withTheme } from '../../../base/apps/theme'
import { LinkButton } from '../../link/ui'
import Toolbar from '../../toolbar'
import { getNewTeaser, getNewTeaserGroup } from '../lib'

import TeaserElementsForm from './TeaserElementsForm'
import TeaserForm from './TeaserForm'
import TeaserURLForm from './TeaserURLForm'
import TeaserGroupForm from './TeaserGroupForm'

const CreditForm = withTheme()(({ editor, styles }) => {
  return (
    <Selected isNode={isBlock('frontCredit')} offset={1}>
      {() => {
        return (
          <SidebarFormatOptions>
            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Format</Label>
              </div>
              <div {...styles.layout.iconGroup}>
                <LinkButton editor={editor} />
              </div>
            </div>
          </SidebarFormatOptions>
        )
      }}
    </Selected>
  )
})

const documentInsertItems = [
  {
    text: 'Front Image',
    value: () => getNewTeaser('frontImage')
  },
  {
    text: 'Front Split',
    value: () => getNewTeaser('frontSplit')
  },
  {
    text: 'Front Typo',
    value: () => getNewTeaser('frontTypo')
  },
  {
    text: 'Front Tile Row',
    value: () => getNewTeaserGroup('frontTileRow')
  }
]

const teaserGroupInsertItems = [
  {
    text: 'Front Tile',
    value: () => getNewTeaser('frontTile')
  }
]

const DocumentTeaserToolbar = Toolbar({
  isNode: isDocument,
  isChildNode: anyPass([
    isBlock('frontImage'),
    isBlock('frontTypo'),
    isBlock('frontSplit')
  ]),
  offset: 2,
  insertItems: documentInsertItems
})
const DocumentTeaserGroupToolbar = Toolbar({
  isNode: isDocument,
  isChildNode: anyPass([isBlock('frontTileRow')]),
  insertItems: documentInsertItems
})

const TeaserGroupToolbar = Toolbar({
  isNode: isBlock('frontTileRow'),
  isChildNode: isBlock('frontTile'),
  insertItems: teaserGroupInsertItems,
  offset: 2
})

export const renderUI = ({ editor }) => {
  return (
    <Fragment>
      <SidebarBottom>
        <TeaserGroupForm editor={editor} />
        <TeaserElementsForm editor={editor} />
        <TeaserForm editor={editor} />
        <TeaserURLForm editor={editor} />
      </SidebarBottom>
      <CreditForm editor={editor} />
      <DocumentTeaserToolbar editor={editor} />
      <DocumentTeaserGroupToolbar editor={editor} />
      <TeaserGroupToolbar editor={editor} />
    </Fragment>
  )
}
