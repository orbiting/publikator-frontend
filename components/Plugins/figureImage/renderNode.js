import { SchemaComponent } from '../../Editor/components/Schema'
import { withTheme } from '../../Editor/apps/theme'

import { isBlock } from '../../Editor/lib'

import { SelectImageButton } from './ui'

const FigureImage = withTheme()(
  ({
    node,
    attributes,
    editor,
    isSelected,
    styles,
  }) => (
    <SelectImageButton
      useAltKey={true}
      key="content"
      node={node}
      editor={editor}
      style={{
        position: 'relative',
        display: 'block',
      }}
    >
      {isSelected && (
        <span {...styles.layout.outline} />
      )}
      {!!node.data.get('url') ? (
        <SchemaComponent
          name="figureImage"
          src={node.data.get('url')}
          title={node.data.get('title')}
          alt={node.data.get('alt')}
          {...attributes}
        />
      ) : (
        <SchemaComponent
          name="figureImage"
          src="/static/images/placeholder.png"
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
