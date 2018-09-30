import React, { Fragment } from 'react'
import { Label, Radio, Checkbox } from '@project-r/styleguide'

import { isBlock } from '../../base/lib'
import {
  removeBlock,
  insertBlockAfter,
  updateData
} from '../../base/lib/changes'

import { withTheme } from '../../base/apps/theme'

import Selected from '../../base/components/Selected'
import {
  SidebarBottom,
  SidebarTextOptions,
  SidebarFormatOptions
} from '../../base/components/UI'

import { getNewInfoboxFigure } from './lib'

import { BoldButton } from '../bold/ui'
import { LinkButton } from '../link/ui'
import { TextButtons } from '../common/ui'

const FigureToggleButton = ({ node, editor }) => {
  const figure = node.nodes.get(1)
  const hasFigure = isBlock('infoBoxFigure', figure)
  return (
    <Checkbox
      checked={hasFigure}
      onChange={() =>
        hasFigure
          ? editor.change(removeBlock, figure)
          : editor.change(
            insertBlockAfter,
            getNewInfoboxFigure(),
            node.nodes.first()
          )
      }
    >
      Mit Bild?
    </Checkbox>
  )
}

export const InfoBoxUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='infoBox' offset={3}>
      {({ node }) => {
        const figure = node.nodes.get(1)
        const hasFigure = isBlock('infoBoxFigure', figure)
        const infoBoxSize = node.data.get('size')
        const isFloatSize = infoBoxSize === 'float'
        const figureSize = node.data.get('figureSize', 'S')
        return (
          <SidebarBottom>
            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Ausrichtung</Label>
              </div>
              <div {...styles.layout.vSection}>
                {[
                  { label: 'Normal', size: undefined },
                  { label: 'Gross', size: 'breakout' },
                  { label: 'Links', size: 'float' }
                ].map((size, i) => {
                  const checked = infoBoxSize === size.size
                  return [
                    <Radio
                      key={`radio${i}`}
                      checked={checked}
                      onChange={() => {
                        if (checked) return
                        editor.change(updateData, node, {
                          size: size.size
                        })
                      }}
                    >
                      {size.label}
                    </Radio>
                  ]
                })}
              </div>
              <div {...styles.layout.section}>
                <FigureToggleButton editor={editor} node={node} />
              </div>
            </div>
            {hasFigure && (
              <div {...styles.layout.container}>
                <div {...styles.layout.sectionHeader}>
                  <Label>Bildgrösse</Label>
                </div>
                <div {...styles.layout.vSection}>
                  {['S', 'M', 'L'].map((value, i) => {
                    const checked = figureSize === value

                    return [
                      <Radio
                        key={`radio${i}`}
                        checked={checked}
                        onChange={() => {
                          if (checked) return
                          editor.change(updateData, node, {
                            figureSize: value
                          })
                        }}
                      >
                        {value}
                      </Radio>
                    ]
                  })}
                </div>
                {!isFloatSize && (
                  <div {...styles.layout.section}>
                    <Checkbox
                      checked={node.data.get('figureFloat') || false}
                      onChange={(_, figureFloat) =>
                        editor.change(updateData, node, {
                          figureFloat
                        })
                      }
                    >
                      Für Text optimieren
                    </Checkbox>
                  </div>
                )}
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
