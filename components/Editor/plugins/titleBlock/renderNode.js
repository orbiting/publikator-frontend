import { SchemaComponent } from '../../base/components/Schema'
import { withMeta } from '../../base/apps/meta'

import { isBlock } from '../../base/lib'

const withMetaFormat = withMeta({
  fieldName: 'format'
})

const TitleBlock = withMetaFormat(
  ({ children, attributes, value: format }) => {
    return (
      <SchemaComponent
        name='titleBlock'
        {...attributes}
      >
        {format && (
          <SchemaComponent
            name='format'
            contentEditable={false}
          >
            {format}
          </SchemaComponent>
        )}

        {children}
      </SchemaComponent>
    )
  }
)

export default ({
  node,
  children,
  attributes,
  editor
}) => {
  if (isBlock('titleBlock', node)) {
    return (
      <TitleBlock
        node={node}
        attributes={attributes}
        editor={editor}
      >
        {children}
      </TitleBlock>
    )
  }

  if (isBlock('title', node)) {
    return (
      <SchemaComponent
        name='title'
        {...attributes}
      >
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
      <SchemaComponent
        name='subject'
        {...attributes}
      >
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

  if (isBlock('lead', node)) {
    return (
      <SchemaComponent
        name='lead'
        {...attributes}
      >
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

  if (isBlock('credit', node)) {
    return (
      <SchemaComponent
        name='credit'
        {...attributes}
      >
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
