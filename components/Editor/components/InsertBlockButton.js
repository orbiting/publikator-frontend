import { dissoc, compose } from 'ramda'

import React from 'react'
import Button from './Button'
import {
  insertBlock,
  insertBlockAfter
} from '../lib/changes'

const cleanProps = compose(
  dissoc('children'),
  dissoc('editor'),
  dissoc('block'),
  dissoc('node'),
  dissoc('insertAfter')
)

const clickHandler = ({
  editor,
  block,
  node,
  insertAfter
}) => () =>
  insertAfter
    ? editor.change(
        insertBlockAfter,
        block(),
        node
      )
    : editor.change(insertBlock, block())

export default props => {
  const { children } = props
  return (
    <Button
      {...cleanProps(props)}
      onClick={clickHandler(props)}
    >
      {children}
    </Button>
  )
}
