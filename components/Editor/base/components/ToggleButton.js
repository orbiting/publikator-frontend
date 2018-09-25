import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'

const clickHandler = (onClick, active) => () => {
  onClick && onClick(active)
}

const ToggleButton = ({
  onClick,
  active,
  children,
  ...props
}) => (
  <Button
    onClick={clickHandler(onClick, active)}
    {...props}
    data-active={active}
  >
    {children}
  </Button>
)

ToggleButton.propTypes = {
  active: PropTypes.bool.isRequired
}

export default ToggleButton
