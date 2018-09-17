import React from 'react'
import PropTypes from 'prop-types'
// import { css } from 'glamor'
// import colors from '../../theme/colors'
// import { fontStyles } from '../../theme/fonts'

let localKey = 0
const getKey = () => {
  localKey = localKey + 1
  return `checkbox-${localKey}`
}

const mouseDownHandler = event =>
  event.stopPropagation()

const changeHandler = onChange => event => {
  onChange && onChange(event.target.checked)
}

const Checkbox = ({
  id,
  name,
  label,
  checked,
  disabled,
  onChange,
  ...props
}) => {
  const id = id || getKey()
  return (
    <label htmlFor={id}>
      <input
        {...props}
        onMouseDown={mouseDownHandler}
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={changeHandler(onChange)}
      />
      {label}
    </label>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool
}

export default Checkbox
