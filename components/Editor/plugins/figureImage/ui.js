import { css } from 'glamor'
import ImageCard from '../../../Search/ImageCard'

import ImageInput from '../../base/components/ImageInput'
import { withNodeData } from '../../base/apps/nodeData'
import { withTheme } from '../../base/apps/theme'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'

export const SelectImageButton = withNodeData({
  fieldName: 'src'
})(ImageInput)

const withCardStyles = withTheme(() => ({
  imageCard: css({
    transition: 'background-color .2s',
    '&:hover': {
      background: '#fff'
    }
  })
}))

export const FigureImageUI = withCardStyles(({ styles, editor }) => (
  <Selected isNode='figureImage' offset={3}>
    {({ node }) => (
      <SidebarBottom>
        <div {...styles.layout.container}>
          <div {...styles.layout.section}>
            <SelectImageButton
              node={node}
              editor={editor}
              {...styles.buttons.iconButton}
            >
              <ImageCard
                {...styles.imageCard}
                value={node.data.get('src')}
                label='Bild'
              />
            </SelectImageButton>
          </div>
        </div>
      </SidebarBottom>
    )}
  </Selected>
))

export const renderUI = ({ editor }) => {
  return <FigureImageUI editor={editor} />
}
