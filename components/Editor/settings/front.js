import { isInline } from '../base/lib'
import { SchemaComponent } from '../base/components/Schema'
import Link from '../plugins/link'
import Teasers from '../plugins/teasers'
import Meta from '../plugins/meta'
import UI from '../plugins/ui'

const DecoratedLink = {
  ...Link,
  renderNode ({ node, attributes, children }) {
    if (isInline('link', node)) {
      return (
        <SchemaComponent
          name='link'
          href={node.data.get('url')}
          title={node.data.get('title')}
          color={node.data.get('color')}
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    }
  }
}

const contentPlugins = [DecoratedLink, Teasers]

export default () => ({
  plugins: [...contentPlugins, Meta, UI(contentPlugins)]
})
