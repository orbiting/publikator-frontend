import React from 'react'
import { compose } from 'ramda'
import Icon from 'react-icon-base'

import ToggleButton from '../../Editor/components/ToggleButton'

import { withNodeData } from '../../Editor/apps/nodeData'
import { withTheme } from '../../Editor/apps/theme'

export const DefaultIcon = props => (
  <Icon size={24} viewBox="0 0 24 24" {...props}>
    <g>
      <path d="m3,7.00002l17.9374,0l0,10.12494l-17.9374,0l0,-10.12494z" />
      <path d="m3,2.87505l17.9374,0l0,2.06249l-17.9374,0l0,-2.06249z" />
      <path d="m3,19.12496l17.9374,0l0,2.06249l-17.9374,0l0,-2.06249z" />
    </g>
  </Icon>
)

export const BreakoutLeftIcon = props => (
  <Icon size={24} viewBox="0 0 24 24" {...props}>
    <g>
      <path d="m3,7.00002l17.9374,0l0,10.12494l-17.9374,0l0,-10.12494z" />
      <path d="m7,2.81255l14,0l0,2.06249l-14,0l0,-2.06249z" />
      <path d="m7,19.06246l14,0l0,2.06249l-14,0l0,-2.06249z" />
    </g>
  </Icon>
)

export const FloatLeftIcon = props => (
  <Icon size={24} viewBox="0 0 24 24" {...props}>
    <g>
      <path d="m3,7.00002l14.1874,0l0,10.12494l-14.1874,0l0,-10.12494z" />
      <path d="m7,2.81255l14,0l0,2.06249l-14,0l0,-2.06249z" />
      <path d="m7,19.06246l14,0l0,2.06249l-14,0l0,-2.06249z" />
    </g>
  </Icon>
)

export const TinyIcon = props => (
  <Icon size={24} viewBox="0 0 24 24" {...props}>
    <g>
      <path d="m6,7.16669l12,0l0,10.12494l-12,0l0,-10.12494z" />
      <path d="m3,2.87505l17.9374,0l0,2.06249l-17.9374,0l0,-2.06249z" />
      <path d="m3,19.12496l17.9374,0l0,2.06249l-17.9374,0l0,-2.06249z" />
    </g>
  </Icon>
)

export const BreakoutIcon = props => (
  <Icon size={24} viewBox="0 0 24 24" {...props}>
    <g>
      <path d="m3,7.00002l17.9374,0l0,10.12494l-17.9374,0l0,-10.12494z" />
      <path d="m5,2.87505l14,0l0,2.06249l-14,0l0,-2.06249z" />
      <path d="m5,19.12496l14,0l0,2.06249l-14,0l0,-2.06249z" />
    </g>
  </Icon>
)

export const EdgeToEdgeIcon = props => (
  <Icon size={24} viewBox="0 0 24 24" {...props}>
    <g>
      <path d="m0,7l24,0l0,10.12494l-24,0l0,-10.12494z" />
      <path d="m6,2.87505l12,0l0,2.06249l-12,0l0,-2.06249z" />
      <path d="m6,19.12496l12,0l0,2.06249l-12,0l0,-2.06249z" />
    </g>
  </Icon>
)

const withSize = compose(
  withNodeData({ fieldName: 'size' }),
  withTheme()
)

export const SizeButton = withSize(
  ({
    children,
    name,
    value,
    onChange,
    styles,
    ...props
  }) => {
    const active = value === name
    return (
      <ToggleButton
        active={active}
        disabled={active}
        onClick={() => onChange(name)}
        {...styles.buttons.iconButton}
        {...props}
      >
        {children}
      </ToggleButton>
    )
  }
)
