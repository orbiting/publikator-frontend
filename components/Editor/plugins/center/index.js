import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'

export default {
  renderNode ({ node, attributes, children }) {
    if (isBlock('center', node)) {
      return (
        <SchemaComponent
          name='center'
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  }
}
