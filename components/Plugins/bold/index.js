import { SchemaComponent } from '../../Editor/components/Schema'
import { isMark } from '../../Editor/lib'

export default {
  renderMark({ node, children, attributes }) {
    if (isMark('bold', node)) {
      return (
        <SchemaComponent
          name="bold"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
