import React, { Fragment } from 'react'
import { FaCheck as HasImageIcon } from 'react-icons/fa'
import { MdClose as NoImageIcon } from 'react-icons/md'

import { Label } from '@project-r/styleguide'

import { isBlock } from '../../base/lib'
import SetValueButton from '../../base/components/SetValueButton'
import ToggleButton from '../../base/components/ToggleButton'
import Selected from '../../base/components/Selected'

import {
  SidebarBottom,
  SidebarTextOptions,
  SidebarFormatOptions
} from '../../base/components/UI'

import { withNodeData } from '../../base/apps/nodeData'
import { withTheme } from '../../base/apps/theme'

import { removeBlock, insertBlockAfter } from '../../base/lib/changes'

import { getNewInfoboxFigure } from './lib'

import {
  BreakoutLeftIcon,
  FloatLeftIcon,
  DefaultIcon
} from '../common/breakouts'

import {
  TinyIcon,
  SmallIcon,
  MediumIcon,
  LargeIcon
} from '../common/sizes'

import { BoldButton } from '../bold/ui'
import { LinkButton } from '../link/ui'
import { TextButtons } from '../common/ui'

const BreakoutButton = withNodeData({
  fieldName: 'size'
})(SetValueButton)

const FigureSizeButton = withNodeData({
  fieldName: 'figureSize'
})(SetValueButton)

const FigureToggleButton = withTheme()(({ node, editor, styles }) => {
  const figure = node.nodes.get(1)
  const hasFigure = isBlock('infoBoxFigure', figure)
  const Icon = hasFigure ? HasImageIcon : NoImageIcon
  return (
    <ToggleButton
      active={hasFigure}
      {...styles.buttons.iconButton}
      onClick={isActive =>
        isActive
          ? editor.change(removeBlock, figure)
          : editor.change(
            insertBlockAfter,
            getNewInfoboxFigure(),
            node.nodes.first()
          )
      }
    >
      <Icon size={22} />
    </ToggleButton>
  )
})

export const InfoBoxUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='infoBox' offset={3}>
      {({ node }) => {
        const figure = node.nodes.get(1)
        const hasFigure = isBlock('infoBoxFigure', figure)
        const infoBoxSize = node.data.get('size')
        return (
          <SidebarBottom>
            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Infobox</Label>
              </div>
              <hr {...styles.layout.hairline} />
              <div {...styles.layout.sectionHeader}>
                <Label>Ausrichtung</Label>
              </div>
              <div {...styles.layout.actions}>
                <BreakoutButton
                  name={null}
                  node={node}
                  {...styles.buttons.iconButton}
                  editor={editor}
                >
                  <DefaultIcon />
                </BreakoutButton>
                <BreakoutButton
                  name='breakout'
                  node={node}
                  {...styles.buttons.iconButton}
                  editor={editor}
                >
                  <BreakoutLeftIcon />
                </BreakoutButton>
                <BreakoutButton
                  name='float'
                  node={node}
                  {...styles.buttons.iconButton}
                  editor={editor}
                >
                  <FloatLeftIcon />
                </BreakoutButton>
              </div>
            </div>

            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Mit Bild?</Label>
              </div>
              <div {...styles.layout.actions}>
                <FigureToggleButton node={node} editor={editor} />
              </div>
            </div>
            {hasFigure && (
              <div {...styles.layout.container}>
                <div {...styles.layout.sectionHeader}>
                  <Label>Bild-Grösse</Label>
                </div>
                <div {...styles.layout.actions}>
                  <FigureSizeButton
                    name={null}
                    node={node}
                    {...styles.buttons.iconButton}
                    editor={editor}
                  >
                    <LargeIcon />
                  </FigureSizeButton>
                  <FigureSizeButton
                    name='M'
                    node={node}
                    {...styles.buttons.iconButton}
                    editor={editor}
                  >
                    <MediumIcon />
                  </FigureSizeButton>
                  {infoBoxSize !== 'float' && (
                    <Fragment>
                      <FigureSizeButton
                        key='small-button'
                        name='S'
                        node={node}
                        {...styles.buttons.iconButton}
                        editor={editor}
                      >
                        <SmallIcon />
                      </FigureSizeButton>
                      <FigureSizeButton
                        key='tiny-button'
                        name='XS'
                        node={node}
                        {...styles.buttons.iconButton}
                        editor={editor}
                      >
                        <TinyIcon />
                      </FigureSizeButton>
                    </Fragment>
                  )}
                </div>
              </div>
            )}
          </SidebarBottom>
        )
      }}
    </Selected>
  )
})

export const InfoBoxTitleUI = ({ editor }) => {
  return (
    <Selected isNode='infoBoxTitle'>
      {() => (
        <SidebarTextOptions>
          <TextButtons editor={editor} />
        </SidebarTextOptions>
      )}
    </Selected>
  )
}

export const InfoBoxTextUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='infoBoxText'>
      {() => (
        <Fragment>
          <SidebarFormatOptions>
            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Format</Label>
              </div>
              <div {...styles.layout.actions}>
                <BoldButton editor={editor} />
                <LinkButton editor={editor} />
              </div>
            </div>
          </SidebarFormatOptions>
          <SidebarTextOptions>
            <TextButtons editor={editor} />
          </SidebarTextOptions>
        </Fragment>
      )}
    </Selected>
  )
})

export const renderUI = ({ editor }) => {
  return (
    <Fragment>
      <InfoBoxUI editor={editor} />
      <InfoBoxTitleUI editor={editor} />
      <InfoBoxTextUI editor={editor} />
    </Fragment>
  )
}
