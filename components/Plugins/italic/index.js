import { SchemaComponent } from '../../Editor/components/Schema'
import { ifElse, compose, always } from 'ramda'
import {
  safeProp,
  isMark,
} from '../../Editor/lib'

export default {
  renderMark: ifElse(
    compose(
      isMark('italic'),
      safeProp('mark')
    ),
    ({ children, attributes }) => (
      <SchemaComponent
        name="italic"
        {...attributes}
      >
        {children}
      </SchemaComponent>
    ),
    always(undefined)
  ),
}
