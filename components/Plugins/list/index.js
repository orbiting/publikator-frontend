import { SchemaComponent } from '../../Editor/components/Schema'
import onKeyDown from './onKeyDown'
import { renderUI } from './ui'

import { isBlock } from '../../Editor/lib'

export default {
  onKeyDown,
  renderUI,
  renderNode({ node, children, attributes }) {
    if (isBlock('list', node)) {
      return (
        <SchemaComponent
          name="list"
          data={node.data.toJS()}
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
    if (isBlock('listItem', node)) {
      return (
        <SchemaComponent
          name="listItem"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
