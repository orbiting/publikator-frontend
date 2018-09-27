import { Fragment } from 'react'
import { merge, css } from 'glamor'
import { Checkbox } from '@project-r/styleguide'
import ImageCard from '../../../../Search/ImageCard'
import TextInput from '../../../base/components/TextInput'
import Selected from '../../../base/components/Selected'
import ImageInput from '../../../base/components/ImageInput'
import { withTheme } from '../../../base/apps/theme'
import { isTeaser, updateTeaserData, getFormOptions } from '../lib'

const withFormStyles = withTheme(({ theme }) => ({
  maxWidthSection: merge(
    theme.layout.section,
    css({ width: '225px' })
  ),
  imageCard: css({
    transition: 'background-color .2s',
    '&:hover': {
      background: '#fff'
    }
  })
}))

export default withFormStyles(({ editor, styles }) => (
  <Selected isNode={isTeaser}>
    {({ node }) => {
      const onChange = data => {
        editor.change(updateTeaserData, node, data)
      }
      const options = getFormOptions(node.type)
      const showImageSettings = options.includes('showImage')
        ? node.data.get('showImage')
        : true
      return (
        <Fragment>
          <div {...styles.layout.container}>
            {options.includes('feuilleton') && (
              <div {...styles.layout.section}>
                <Checkbox
                  checked={node.data.get('feuilleton')}
                  onChange={(_, feuilleton) =>
                    onChange({ feuilleton })
                  }
                >
                  Feuilleton
                </Checkbox>
              </div>
            )}
          </div>
          {(options.includes('reverse') ||
            options.includes('portrait')) && (
            <div {...styles.layout.container}>
              {options.includes('reverse') && (
                <div {...styles.layout.section}>
                  <Checkbox
                    checked={node.data.get('reverse')}
                    onChange={(_, reverse) => onChange({ reverse })}
                  >
                    Titel und Bild wechseln
                  </Checkbox>
                </div>
              )}
              {options.includes('portrait') && (
                <div {...styles.layout.section}>
                  <Checkbox
                    checked={node.data.get('portrait')}
                    onChange={(_, portrait) => onChange({ portrait })}
                  >
                    Hochformat
                  </Checkbox>
                </div>
              )}
            </div>
          )}
          <div {...styles.layout.container}>
            {options.includes('showImage') && (
              <div {...styles.layout.section}>
                <Checkbox
                  checked={node.data.get('showImage')}
                  onChange={(_, showImage) => onChange({ showImage })}
                >
                  Bild anzeigen
                </Checkbox>
              </div>
            )}
            {showImageSettings &&
              options.includes('onlyImage') && (
              <div {...styles.layout.section}>
                <Checkbox
                  checked={node.data.get('onlyImage')}
                  onChange={(_, onlyImage) =>
                    onChange({ onlyImage })
                  }
                >
                    Nur Bild
                </Checkbox>
              </div>
            )}
            {showImageSettings &&
              options.includes('image') && (
              <div {...styles.layout.section}>
                <ImageInput
                  label='Bild'
                  src={node.data.get('image')}
                  onChange={image => onChange({ image })}
                >
                  <ImageCard
                    {...styles.imageCard}
                    value={node.data.get('image')}
                    label='Teaser-Bild'
                  />
                </ImageInput>
                {options.includes('byline') && (
                  <TextInput
                    label='Bildcredit'
                    value={node.data.get('byline')}
                    onChange={byline => onChange({ byline })}
                  />
                )}
              </div>
            )}
          </div>
        </Fragment>
      )
    }}
  </Selected>
))
