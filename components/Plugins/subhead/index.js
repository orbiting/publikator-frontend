import { SchemaComponent } from '../../Editor/components/Schema'
import { isBlock } from '../../Editor/lib'
import { renderUi } from './ui'

export default {
  renderUi,
  renderNode({ node, children, attributes }) {
    if ((isBlock('subhead'), node)) {
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
