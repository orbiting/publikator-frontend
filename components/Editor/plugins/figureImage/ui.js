import { Label } from '@project-r/styleguide'
import { FaFileImage as ChangeImageIcon } from 'react-icons/fa'

import ImageInput from '../../base/components/ImageInput'
import { withNodeData } from '../../base/apps/nodeData'
import { withTheme } from '../../base/apps/theme'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'

export const SelectImageButton = withNodeData({
  fieldName: 'url'
})(ImageInput)

export const FigureImageUI = withTheme()(
  ({ styles, editor }) => (
    <Selected isNode='figureImage' offset={3}>
      {({ node }) => (
        <SidebarBottom>
          <div {...styles.layout.container}>
            <div {...styles.layout.headerSection}>
              <Label>Bild auswählen</Label>
            </div>
            <div {...styles.layout.actions}>
              <SelectImageButton
                node={node}
                editor={editor}
                {...styles.buttons.iconButton}
              >
                <ChangeImageIcon size={22} />
              </SelectImageButton>
            </div>
          </div>
        </SidebarBottom>
      )}
    </Selected>
  )
)

export const renderUI = ({ editor }) => {
  return <FigureImageUI editor={editor} />
}
