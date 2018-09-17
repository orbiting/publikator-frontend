import { compose, dissoc } from 'ramda'

import React from 'react'

import { withValue } from '../apps/document'
import ToggleButton from './ToggleButton'
import { isInline } from '../lib'
import {
  addInline,
  removeInline,
} from '../lib/changes'

const cleanProps = compose(
  dissoc('children'),
  dissoc('editor'),
  dissoc('inline'),
  dissoc('value')
)

const clickHandler = ({
  editor,
  inline,
}) => isActive => {
  return isActive
    ? editor.change(removeInline, inline)
    : editor.change(addInline, inline)
}

export default withValue(props => {
  const { children, inline, value } = props
  const active = value.inlines.some(
    isInline(inline)
  )
  return (
    <ToggleButton
      active={active}
      disabled={
        !active && value.selection.isCollapsed
      }
      onClick={clickHandler(props)}
      {...cleanProps(props)}
    >
      {children}
    </ToggleButton>
  )
})
