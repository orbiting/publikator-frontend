import { SchemaComponent } from '../../Editor/components/Schema'
import Selected from '../../Editor/components/Selected'
import { withTheme } from '../../Editor/apps/theme'

import { isBlock } from '../../Editor/lib'

import { SelectImageButton } from './ui'

const FigureImage = withTheme()(
  ({ node, attributes, editor, styles }) => (
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
      <Selected node={node}>
        <span {...styles.layout.outline} />
      </Selected>
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
