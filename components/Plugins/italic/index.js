import { SchemaComponent } from '../../Editor/components/Schema'
import { isMark } from '../../Editor/lib'

export default {
  renderMark: ({
    node,
    children,
    attributes,
  }) => {
    if (isMark('italic', node)) {
      return (
        <SchemaComponent
          name="italic"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
