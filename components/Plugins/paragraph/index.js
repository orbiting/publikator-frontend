import { SchemaComponent } from '../../Editor/components/Schema'
import { isBlock } from '../../Editor/lib'
import { renderUI } from './ui'

export default {
  renderUI,
  renderNode({ node, children, attributes }) {
    if (isBlock('paragraph', node)) {
      return (
        <SchemaComponent
          name="paragraph"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
