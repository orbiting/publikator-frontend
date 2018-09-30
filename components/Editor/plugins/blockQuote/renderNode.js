import { isBlock } from '../../base/lib'
import { SchemaComponent } from '../../base/components/Schema'

export default ({ node, children, attributes }) => {
  if (isBlock('blockQuote', node)) {
    return (
      <SchemaComponent name='blockQuote' {...attributes}>
        {children}
      </SchemaComponent>
    )
  }
  if (isBlock('blockQuoteText', node)) {
    return (
      <SchemaComponent name='blockQuote' {...attributes}>
        {children}
      </SchemaComponent>
    )
  }
}
