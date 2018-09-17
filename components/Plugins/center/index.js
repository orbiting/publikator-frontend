import { SchemaComponent } from '../../Editor/components/Schema'
import { ifElse, always, compose } from 'ramda'
import {
  isBlock,
  safeProp,
} from '../../Editor/lib'

export default {
  renderNode: ifElse(
    compose(
      isBlock('center'),
      safeProp('node')
    ),
    ({ attributes, children }) => (
      <SchemaComponent
        name="center"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    ),
    always(undefined)
  ),
}
