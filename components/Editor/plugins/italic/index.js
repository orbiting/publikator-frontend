import { SchemaComponent } from '../../base/components/Schema'
import { isMark } from '../../base/lib'

export default {
  renderMark: ({
    node,
    children,
    attributes
  }) => {
    if (isMark('italic', node)) {
      return (
        <SchemaComponent
          name='italic'
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  }
}
