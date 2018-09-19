import { SchemaComponent } from '../../Editor/components/Schema'
import { isMark } from '../../Editor/lib'

export default {
  renderMark({ node, children, attributes }) {
    if (isMark('sub', node)) {
      return (
        <SchemaComponent
          name="sub"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
