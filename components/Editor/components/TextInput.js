import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import {
  colors,
  mediaQueries,
  fontStyles,
} from '@project-r/styleguide'

const xPadding = 0
const borderWidth = 1
const lineHeight = 20
export const fieldHeight = 30

const fieldStyle = css({
  width: '100%',
  appearance: 'none',
  outline: 'none',
  verticalAlign: 'bottom',
  // yPadding can interfere with font
  padding: `0 ${xPadding}px`,
  textDecoration: 'none',
  height: fieldHeight,
  ...fontStyles.sansSerifRegular16,
  boxSizing: 'border-box',
  backgroundColor: 'white',
  border: 'none',
  borderBottom: `solid ${
    colors.disabled
  } ${borderWidth}px`,
  borderRadius: 0,
  color: colors.text,
  ':focus': {
    borderColor: colors.primary,
  },
})
const fieldErrorStyle = css({
  borderColor: colors.error,
  ':focus': {
    borderColor: colors.error,
  },
})

const containerStyle = css({
  width: '100%',
  paddingTop: lineHeight,
  position: 'relative',
  display: 'inline-block',
  ...fontStyles.sansSerifRegular16,
  marginBottom: 22,
})
const labelTextStyle = css({
  position: 'absolute',
  left: xPadding,
  top: lineHeight,
  color: colors.disabled,
  transition: 'top 200ms, font-size 200ms',
})
const labelTextTopStyle = css({
  top: 1,
  fontSize: 12,
  lineHeight: '13px',
  [mediaQueries.mUp]: {
    top: 3,
    fontSize: 14,
    lineHeight: '15px',
  },
})
const labelTextFocusedStyle = css({
  color: colors.primary,
})
const labelTextErrorStyle = css({
  color: colors.error,
})

class Field extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isFocused: false,
      isValidating: false,
      isDirty: false,
      value: '',
    }
    this.inputRef = ref => (this.input = ref)
  }
  render() {
    const {
      onChange,
      name,
      type,
      label,
      error,
      renderInput,
      isFocused: isFocusedFromProps,
    } = this.props

    let simulationClassName
    let { isFocused } = this.state

    if (isFocusedFromProps !== undefined) {
      isFocused = isFocusedFromProps
    }

    const { isValidating, isDirty } = this.state

    const value =
      this.props.value || this.state.value

    let colorStyle

    const hasError = !!error
    const labelStyle =
      isFocused || value || hasError
        ? merge(
            labelTextStyle,
            labelTextTopStyle,
            isFocused && labelTextFocusedStyle,
            hasError && labelTextErrorStyle,
            colorStyle
          )
        : merge(labelTextStyle, colorStyle)

    const fStyle = hasError
      ? merge(
          fieldStyle,
          fieldErrorStyle,
          colorStyle
        )
      : merge(fieldStyle, colorStyle)

    return (
      <label {...containerStyle}>
        {renderInput({
          name,
          type,
          ref: this.inputRef,
          onClick: event =>
            event.stopPropagation(),
          onChange: event => {
            let v = event.target.value
            if (onChange) {
              onChange(v, isValidating)
              this.setState(() => ({
                isDirty: true,
              }))
            } else {
              this.setState(() => ({
                isDirty: true,
                value: v,
              }))
            }
          },
          value,
          onFocus: () =>
            this.setState(() => ({
              isFocused: true,
            })),
          onBlur: event => {
            const v = event.target.value
            if (
              !isValidating &&
              onChange &&
              isDirty
            ) {
              onChange(v, true)
            }
            this.setState(state => ({
              isFocused: false,
              isValidating: state.isDirty,
            }))
          },
          className: [
            fStyle.toString(),
            simulationClassName,
          ]
            .filter(Boolean)
            .join(' '),
        })}
        <span {...labelStyle}>
          {error || label}
        </span>
      </label>
    )
  }
}

Field.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  renderInput: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
}

Field.defaultProps = {
  renderInput: props => <input {...props} />,
}

export default Field
