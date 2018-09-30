import { SchemaComponent } from '../../base/components/Schema'
import { withTheme } from '../../base/apps/theme'

import { isBlock } from '../../base/lib'

import { SelectImageButton } from './ui'

const FigureImage = withTheme()(
  ({ node, attributes, editor, isSelected, styles }) => (
    <SelectImageButton
      useAltKey
      key='content'
      node={node}
      editor={editor}
      style={{
        position: 'relative',
        display: 'block'
      }}
    >
      {isSelected && <span {...styles.layout.outline} />}
      {node.data.get('src') ? (
        <SchemaComponent
          name='figureImage'
          src={node.data.get('src')}
          title={node.data.get('title')}
          alt={node.data.get('alt')}
          {...attributes}
        />
      ) : (
        <SchemaComponent
          name='figureImage'
          src='/static/placeholder.png'
          {...attributes}
        />
      )}
    </SelectImageButton>
  )
)

export default ({ node, ...props }) => {
  if (isBlock('figureImage', node)) {
    return <FigureImage node={node} {...props} />
  }
}
