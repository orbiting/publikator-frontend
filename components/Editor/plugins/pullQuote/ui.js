import React, { Fragment } from 'react'
import { Label, Radio, Checkbox } from '@project-r/styleguide'

import { isBlock } from '../../base/lib'
import {
  removeBlock,
  insertBlockBefore,
  updateData
} from '../../base/lib/changes'

import { withTheme } from '../../base/apps/theme'

import Selected from '../../base/components/Selected'
import {
  SidebarBottom,
  SidebarTextOptions,
  SidebarFormatOptions
} from '../../base/components/UI'

import { getNewPullQuoteFigure } from './lib'

import { LinkButton } from '../link/ui'
import { TextButtons } from '../common/ui'

const FigureToggleButton = ({ node, editor }) => {
  const figure = node.nodes.first()
  const hasFigure = isBlock('pullQuoteFigure', figure)
  return (
    <Checkbox
      checked={hasFigure}
      onChange={() =>
        hasFigure
          ? editor.change(removeBlock, figure)
          : editor.change(
            insertBlockBefore,
            getNewPullQuoteFigure(),
            node.nodes.first()
          )
      }
    >
      Mit Bild?
    </Checkbox>
  )
}

export const PullQuoteUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='pullQuote' offset={2}>
      {({ node }) => {
        const pullQuoteSize = node.data.get('size')
        return (
          <SidebarBottom>
            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Ausrichtung</Label>
              </div>
              <div {...styles.layout.vSection}>
                {[
                  { label: 'Normal', size: undefined },
                  { label: 'Klein', size: 'narrow' },
                  { label: 'Gross', size: 'breakout' },
                  { label: 'Links', size: 'float' }
                ].map((size, i) => {
                  const checked = pullQuoteSize === size.size
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
          </SidebarBottom>
        )
      }}
    </Selected>
  )
})

export const PullQuoteTextUI = ({ editor }) => {
  return (
    <Selected isNode='pullQuoteText'>
      {() => (
        <SidebarTextOptions>
          <TextButtons editor={editor} />
        </SidebarTextOptions>
      )}
    </Selected>
  )
}

export const PullQuoteCiteUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='pullQuoteCite'>
      {() => (
        <Fragment>
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
      <PullQuoteUI editor={editor} />
      <PullQuoteTextUI editor={editor} />
      <PullQuoteCiteUI editor={editor} />
    </Fragment>
  )
}
