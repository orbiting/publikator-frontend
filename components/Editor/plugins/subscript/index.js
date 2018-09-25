import { SchemaComponent } from '../../base/components/Schema'
import { isMark } from '../../base/lib'

export default {
  renderMark ({ node, children, attributes }) {
    if (isMark('sub', node)) {
      return (
        <SchemaComponent
          name='sub'
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  }
}
