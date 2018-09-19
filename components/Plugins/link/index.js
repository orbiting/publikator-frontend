import { SchemaComponent } from '../../Editor/components/Schema'
import { isInline } from '../../Editor/lib'
import { renderUI } from './ui'

export default {
  renderUI,
  renderNode: ({
    node,
    children,
    attributes,
  }) => {
    if (isInline('link', node)) {
      return (
        <SchemaComponent
          key="content"
          name="link"
          href={node.data.get('url')}
          title={node.data.get('title')}
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  },
}
