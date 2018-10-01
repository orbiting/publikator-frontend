import { cloneElement } from 'react'
import { isBlock } from '../../base/lib'
import { SchemaComponent } from '../../base/components/Schema'
import EditOverlay from './EditOverlay'
import { getNew } from './lib'

export default {
  getNew,
  renderNode (props) {
    const { node } = props
    if (isBlock('dynamicComponent', node)) {
      const data = node.data.toJS()
      const component = (
        <SchemaComponent
          name='dynamicComponent'
          showException
          key={JSON.stringify(data)}
          {...data}
        />
      )
      const preview = cloneElement(component, {
        raw: true
      })

      return (
        <EditOverlay
          {...props}
          component={component}
          preview={preview}
        />
      )
    }
  },
  schema: {
    blocks: {
      dynamicComponent: {
        isVoid: true
      }
    }
  }
}
