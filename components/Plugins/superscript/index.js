import { SchemaComponent } from '../../Editor/components/Schema'
import { isMark } from '../../Editor/lib'

export default {
  renderMark({ node, children, attributes }) {
    if (isMark('sup', node)) {
      return (
        <SchemaComponent
          name="sup"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
