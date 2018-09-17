import { SchemaComponent } from '../../Editor/components/Schema'
import { ifElse, compose, always } from 'ramda'
import {
  safeProp,
  isMark,
} from '../../Editor/lib'

export default {
  renderMark: ifElse(
    compose(
      isMark('sup'),
      safeProp('mark')
    ),
    ({ children, attributes }) => (
      <SchemaComponent name="sup" {...attributes}>
        {children}
      </SchemaComponent>
    ),
    always(undefined)
  ),
}
