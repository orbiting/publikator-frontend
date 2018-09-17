import React from 'react'
import { css } from 'glamor'

const styles = {
  absolute: css({
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    pointerEvents: 'none',
    opacity: 0.333
  }),
  inline: css({
    pointerEvents: 'none',
    opacity: 0.333,
    ':empty::before': {
      content: 'attr(data-text)'
    }
  })
}

export default ({ children }) => {
  return (
    <span
      contentEditable={false}
      {...styles.absolute}
    >
      {children}
    </span>
  )
}

export const InlinePlaceholder = ({
  children
}) => {
  return (
    <span
      {...styles.inline}
      data-text={children}
      contentEditable={false}
    />
  )
}
