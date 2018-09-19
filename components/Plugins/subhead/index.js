import { SchemaComponent } from '../../Editor/components/Schema'
import { isBlock } from '../../Editor/lib'
import { renderUI } from './ui'

export default {
  renderUI,
  renderNode({ node, children, attributes }) {
    if (isBlock('subhead', node)) {
      return (
        <SchemaComponent
          name="subhead"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
