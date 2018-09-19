import { SchemaComponent } from '../../Editor/components/Schema'
import { withMeta } from '../../Editor/apps/meta'

import { isBlock } from '../../Editor/lib'

const withMetaFormat = withMeta({
  fieldName: 'format',
})

const TitleBlock = withMetaFormat(
  ({ children, attributes, value: format }) => {
    return (
      <SchemaComponent
        name="titleBlock"
        {...attributes}
      >
        {format && (
          <SchemaComponent
            name="format"
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
  editor,
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
        name="title"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('subject', node)) {
    return (
      <SchemaComponent
        name="subject"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('lead', node)) {
    return (
      <SchemaComponent
        name="lead"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('credits', node)) {
    return (
      <SchemaComponent
        name="credits"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }
  console.log('title block passes')
}
