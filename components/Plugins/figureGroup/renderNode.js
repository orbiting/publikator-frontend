import { SchemaComponent } from '../../Editor/components/Schema'
import { isBlock } from '../../Editor/lib'

export default ({
  children,
  attributes,
  node,
}) => {
  if (isBlock('figureGroup', node)) {
    return (
      <SchemaComponent
        name="figureGroup"
        key="content"
        size={node.data.get('size')}
        columns={node.data.get('columns')}
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('figureGroupFigure', node)) {
    return (
      <SchemaComponent
        name="figureGroupFigure"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    )
  }
}
