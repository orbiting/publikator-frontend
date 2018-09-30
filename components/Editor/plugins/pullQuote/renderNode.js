import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'

export default ({ children, attributes, node }) => {
  if (isBlock('pullQuote', node)) {
    return (
      <SchemaComponent
        name='pullQuote'
        hasFigure={isBlock('pullQuoteFigure', node.nodes.first())}
        attributes={attributes}
        {...node.data.toJS()}
      >
        {children}
      </SchemaComponent>
    )
  }
  if (isBlock('pullQuoteText', node)) {
    return (
      <SchemaComponent name='pullQuoteText' attributes={attributes}>
        {children}
      </SchemaComponent>
    )
  }
  if (isBlock('pullQuoteCite', node)) {
    return (
      <SchemaComponent
        name='pullQuoteCite'
        attributes={{
          ...attributes
        }}
      >
        {children}
      </SchemaComponent>
    )
  }
  if (isBlock('pullQuoteFigure', node)) {
    return (
      <SchemaComponent
        name='pullQuoteFigure'
        attributes={{
          ...attributes
        }}
      >
        {children}
      </SchemaComponent>
    )
  }
}
