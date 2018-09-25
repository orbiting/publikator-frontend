import React from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import { FaAngleRight as ArrowIcon } from 'react-icons/fa'
import { compose } from 'ramda'
import { Label } from '@project-r/styleguide'
import { withApp } from '../apps/selectionPath'
import { withTheme } from '../apps/theme'

const withStyles = withTheme(({ theme }) => {
  return {
    container: merge(
      theme.layout.container,
      css({
        maxWidth: `none`,
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        lineHeight: '16px'
      })
    ),
    item: css({
      display: 'flex',
      marginTop: '6px',
      alignItems: 'center',
      flexDirection: 'row'
    }),
    nodeLink: merge(
      theme.buttons.labelButton,
      css({
        ...theme.fontStyles.sansSerifRegular16,
        '&[data-active="true"]': {
          color: theme.colors.primary,
          cursor: 'default',
          textDecoration: 'underline'
        }
      })
    )
  }
})

const mouseDownHandler = (
  node,
  onSelect
) => event => {
  event.preventDefault()
  onSelect(node)
}

const SelectionPathMenu = ({
  selectedNode,
  selectionPath,
  onSelect,
  styles
}) => {
  if (!selectionPath) {
    return (
      <div {...styles.container}>
        Multiple nodes selected
      </div>
    )
  }
  return (
    <div {...styles.container}>
      <div {...styles.layout.headerSection}>
        <Label>Auswahl</Label>
      </div>
      {selectionPath.map((n, i) => (
        <span key={n.key} {...styles.item}>
          {i > 0 && <ArrowIcon />}
          <a
            {...styles.nodeLink}
            onMouseDown={mouseDownHandler(
              n,
              onSelect
            )}
            data-active={n === selectedNode}
          >
            {n.type || n.object}
          </a>
        </span>
      ))}
    </div>
  )
}

SelectionPathMenu.propTypes = {
  selectedNode: PropTypes.object,
  selectionPath: PropTypes.object,
  onSelect: PropTypes.func.isRequired
}

export default compose(
  withApp,
  withStyles
)(SelectionPathMenu)
