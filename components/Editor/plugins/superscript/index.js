import { SchemaComponent } from '../../base/components/Schema'
import { isMark } from '../../base/lib'

export default {
  renderMark ({ node, children, attributes }) {
    if (isMark('sup', node)) {
      return (
        <SchemaComponent
          name='sup'
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  }
}
