import { Component, Fragment } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'ramda'
import {
  ColorWrap,
  Hue,
  Saturation
} from 'react-color/lib/components/common'
import { Label, colors } from '@project-r/styleguide'
import { withTheme } from '../../../base/apps/theme'
import TextInput from '../../../base/components/TextInput'

const withStyles = withTheme(({ theme }) => ({
  picker: merge(
    theme.layout.section,
    css({
      backgroundColor: '#fff'
    })
  ),
  colorIndicator: css({
    height: '16px',
    width: '40px',
    marginRight: '10px',
    border: `1px solid ${colors.text}`
  }),
  saturationPicker: css({
    width: '225px',
    height: '180px',
    position: 'relative',
    marginBottom: '10px'
  }),
  saturationPointer: css({
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
    border: `1px solid ${colors.disabled}`,
    borderRadius: '10px',
    cursor: 'pointer'
  }),
  huePicker: css({
    width: '225px',
    height: '30px',
    position: 'relative',
    marginBottom: '10px'
  }),
  huePointer: css({
    width: '8px',
    height: '34px',
    backgroundColor: '#fff',
    border: `1px solid ${colors.disabled}`,
    transform: 'translate(-50%, -2px)',
    cursor: 'pointer'
  }),
  button: css({
    width: '30px',
    height: '30px',
    border: '1px solid #000'
  })
}))

const Picker = compose(
  ColorWrap,
  withStyles
)(({ styles, ...props }) => {
  const SaturationPointer = () => (
    <div {...styles.saturationPointer} />
  )
  const HuePointer = () => <div {...styles.huePointer} />
  return (
    <Fragment>
      <div {...styles.saturationPicker}>
        <Saturation {...props} pointer={SaturationPointer} />
      </div>
      <div {...styles.huePicker}>
        <Hue pointer={HuePointer} {...props} />
      </div>
    </Fragment>
  )
})

class ColorPicker extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      displayColorPicker: false
    }
    this.clickHandler = this.clickHandler.bind(this)
    this.closeHandler = this.closeHandler.bind(this)
  }

  clickHandler () {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    })
  }

  closeHandler () {
    this.setState({ displayColorPicker: false })
  }

  render () {
    const { styles, label, onChange, value } = this.props
    return (
      <Fragment>
        <div
          {...styles.layout.sectionHeader}
          onClick={this.clickHandler}
        >
          <div
            {...styles.colorIndicator}
            style={{ backgroundColor: value }}
          />
          <Label>{label}</Label>
        </div>
        {this.state.displayColorPicker && (
          <div {...styles.picker}>
            <div
              {...styles.layout.backdrop}
              onClick={this.closeHandler}
            />

            <Picker
              color={value}
              onChangeComplete={v => onChange(v.hex)}
            />
            <TextInput
              label={'Hex-Wert'}
              value={value}
              onChange={(_, v) => onChange(v)}
            />
          </div>
        )}
      </Fragment>
    )
  }
}

export default compose(withStyles)(ColorPicker)
