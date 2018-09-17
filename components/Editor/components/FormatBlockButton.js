import { dissoc, compose } from 'ramda'

import React from 'react'
import ToggleButton from './ToggleButton'
import { isBlock } from '../lib'
import { convertBlock } from '../lib/changes'

const defaultConversionStrategy = (
  change,
  node,
  type
) => node.set('type', type)

const cleanProps = compose(
  dissoc('children'),
  dissoc('editor'),
  dissoc('node'),
  dissoc('block'),
  dissoc('conversionStrategy'),
  dissoc('styles')
)

const clickHandler = ({
  editor,
  node,
  block,
  conversionStrategy,
}) => isActive => {
  return (
    !isActive &&
    (!conversionStrategy
      ? editor.change(
          convertBlock,
          node,
          block,
          defaultConversionStrategy
        )
      : editor.change(
          conversionStrategy,
          node,
          block
        ))
  )
}

export default props => {
  const { children, node, block, active } = props
  const isActive =
    typeof active !== 'undefined'
      ? active
      : isBlock(block, node)

  return (
    <ToggleButton
      {...cleanProps(props)}
      active={isActive}
      onClick={clickHandler(props)}
    >
      {children}
    </ToggleButton>
  )
}
