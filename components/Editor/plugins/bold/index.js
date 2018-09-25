import { SchemaComponent } from '../../base/components/Schema'
import { isMark } from '../../base/lib'

export default {
  renderMark ({ node, children, attributes }) {
    if (isMark('bold', node)) {
      return (
        <SchemaComponent
          name='bold'
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  }
}
