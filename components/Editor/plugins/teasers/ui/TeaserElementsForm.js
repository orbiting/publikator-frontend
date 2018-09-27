import { Fragment } from 'react'
import { merge, css } from 'glamor'
import { Dropdown } from '@project-r/styleguide'
import Selected from '../../../base/components/Selected'
import { withTheme } from '../../../base/apps/theme'
import {
  isTeaserElement,
  updateTeaserElementData,
  getFormOptions
} from '../lib'

import ColorPicker from './ColorPicker'

const textPositions = [
  { value: 'top', text: 'Top' },
  { value: 'middle', text: 'Middle' },
  { value: 'bottom', text: 'Bottom' },
  { value: 'topleft', text: 'Top Left' },
  { value: 'topright', text: 'Top Right' },
  { value: 'bottomleft', text: 'Bottom Left' },
  { value: 'bottomright', text: 'Bottom Right' }
]

const titleSizes = [
  { value: 'medium', text: 'Medium' },
  { value: 'small', text: 'Small' },
  { value: 'large', text: 'Large' },
  { value: 'standard', text: 'Standard' }
]

const kinds = [
  { value: 'editorial', text: 'Editorial' },
  { value: 'meta', text: 'Meta' },
  { value: 'scribble', text: 'Ameise' }
]

const withFormStyles = withTheme(({ theme }) => ({
  maxWidthSection: merge(
    theme.layout.section,
    css({ width: '225px' })
  )
}))

export default withFormStyles(({ editor, styles }) => (
  <Selected isNode={isTeaserElement}>
    {({ node }) => {
      const options = getFormOptions(node.data.get('teaserType'))
      return (
        <Fragment>
          <div {...styles.layout.container}>
            {options.includes('color') && (
              <ColorPicker
                label='Textfarbe'
                value={node.data.get('color') || '#000'}
                onChange={color => {
                  editor.change(updateTeaserElementData, node, {
                    color
                  })
                }}
              />
            )}
            {options.includes('bgColor') && (
              <ColorPicker
                label='Hintergrundfarbe'
                value={node.data.get('bgColor') || '#fff'}
                onChange={bgColor => {
                  editor.change(updateTeaserElementData, node, {
                    bgColor
                  })
                }}
              />
            )}
          </div>
          <div {...styles.layout.container}>
            <div {...styles.maxWidthSection}>
              {options.includes('kind') && (
                <Dropdown
                  label='Inhaltsbezeichnung'
                  items={kinds}
                  value={node.data.get('kind')}
                  onChange={({ value: kind }) => {
                    editor.change(updateTeaserElementData, node, {
                      kind
                    })
                  }}
                />
              )}

              {options.includes('titleSize') && (
                <Dropdown
                  label='Titelgrösse'
                  items={titleSizes}
                  value={node.data.get('titleSize')}
                  onChange={({ value: titleSize }) => {
                    editor.change(updateTeaserElementData, node, {
                      titleSize
                    })
                  }}
                />
              )}
              {options.includes('textPosition') && (
                <Dropdown
                  label='Text-Position'
                  items={textPositions}
                  value={node.data.get('textPosition')}
                  onChange={({ value: textPosition }) => {
                    editor.change(updateTeaserElementData, node, {
                      textPosition
                    })
                  }}
                />
              )}
            </div>
          </div>
        </Fragment>
      )
    }}
  </Selected>
))
