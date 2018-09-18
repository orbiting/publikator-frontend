import { SchemaComponent } from '../../Editor/components/Schema'
import { isBlock } from '../../Editor/lib'

export default {
  renderNode({ node, attributes, children }) {
    if (isBlock('center', node)) {
      return (
        <SchemaComponent
          name="center"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
