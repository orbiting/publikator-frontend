import { SchemaComponent } from '../../base/components/Schema'
import { isInline } from '../../base/lib'
import { renderUI } from './ui'

export default {
  renderUI,
  renderNode: ({
    node,
    children,
    attributes
  }) => {
    if (isInline('link', node)) {
      return (
        <SchemaComponent
          key='content'
          name='link'
          href={node.data.get('url')}
          title={node.data.get('title')}
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  }
}
