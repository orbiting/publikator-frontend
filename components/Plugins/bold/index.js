import { SchemaComponent } from '../../Editor/components/Schema'

import { ifElse, compose, always } from 'ramda'
import {
  safeProp,
  isMark,
} from '../../Editor/lib'

export default {
  renderMark: ifElse(
    compose(
      isMark('bold'),
      safeProp('mark')
    ),
    ({ children, attributes }) => {
      return (
        <SchemaComponent
          name="bold"
          {...attributes}
        >
          {children}
        </SchemaComponent>
      )
    },
    always(undefined)
  ),
}
