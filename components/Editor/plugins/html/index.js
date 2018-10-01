import { Block } from 'slate'
import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'
import { renderUI } from './ui'

export default {
  renderNode ({ node, attributes }) {
    if (isBlock('html', node)) {
      return (
        <div {...attributes}>
          <SchemaComponent
            name='html'
            code={
              node.data.get('code') ||
              `<img width="100%" src="/static/placeholder.png" />`
            }
            images={node.data.get('images')}
          />
        </div>
      )
    }
  },
  getNew () {
    return Block.create({
      type: 'html',
      data: {
        images: [],
        code: ''
      }
    })
  },
  renderUI,
  schema: {
    blocks: {
      html: {
        isVoid: true
      }
    }
  }
}
