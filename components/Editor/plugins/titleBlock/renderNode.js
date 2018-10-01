import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'

export default ({ node, children, attributes }) => {
  if (isBlock('titleBlock', node)) {
    return (
      <SchemaComponent
        format={node.data.get('format')}
        center={node.data.get('center')}
        name='titleBlock'
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('title', node)) {
    return (
      <SchemaComponent name='title' {...attributes}>
        <span
          style={{
            position: 'relative',
            display: 'block'
          }}
        >
          {children}
        </span>
      </SchemaComponent>
    )
  }

  if (isBlock('subject', node)) {
    return (
      <SchemaComponent name='subject' {...attributes}>
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('lead', node)) {
    return (
      <SchemaComponent name='lead' {...attributes}>
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('credit', node)) {
    return (
      <SchemaComponent name='credit' {...attributes}>
        <span
          style={{
            position: 'relative',
            display: 'block'
          }}
        >
          {children}
        </span>
      </SchemaComponent>
    )
  }
}
