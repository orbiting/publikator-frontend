import React from 'react'
import PropTypes from 'prop-types'

const stop = event => {
  /*
    This should remain as a hook to quickly react on Slate changes.
    Currently Slate Editor handles focus like a normal selectable DOM element,
    which is nice. Once it's clear it stays that way, we can get rid of this wrapper for good.
  */

  // event.stopPropagation()
}

const clickHandler = onClick => event => {
  stop(event)
  onClick && onClick(event)
}

const Button = ({
  onClick,
  children,
  ...props
}) => (
  <button
    onClick={clickHandler(onClick)}
    {...props}
  >
    {children}
  </button>
)

Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

export default Button
