import createRule from '../utils/createRule'
import { css } from 'glamor'
import * as Styleguide from '@project-r/styleguide'

export const Span = createRule(
  'inline',
  'span',
  Styleguide.Span
)

export const A = createRule(
  'inline',
  'a',
  ({ node, children }) => {
    const { data, attributes } = node
    return (
      <Styleguide.A {...attributes} href={data.get('href')}>
        {children}
      </Styleguide.A>
    )
  }
)

const styles = {
  number: {
    whiteSpace: 'nowrap',
    color: 'red'
  }
}

export const Num = createRule(
  'inline',
  'span',
  ({ node, children }) => {
    const { attributes } = node
    return (
      <span {...attributes} {...css(styles.number)}>
        {children}
      </span>
    )
  }
)
