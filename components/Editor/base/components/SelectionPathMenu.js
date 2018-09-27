import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import {
  MdChevronRight as ArrowIcon,
  MdArrowBack as AlignLeftIcon,
  MdArrowForward as AlignRightIcon
} from 'react-icons/md'
import { compose } from 'ramda'

import { withApp } from '../apps/selectionPath'
import { withTheme, withThemeConfig } from '../apps/theme'

const withStyles = withTheme(
  ({ theme, config: { style, align, maxWidth } }) => {
    return {
      container: merge(
        theme.layout.container,
        style === 'fluid' &&
          css({
            display: 'flex',
            flexDirection: align === 'right' ? 'row-reverse' : 'row'
          }),
        css({
          maxWidth: style === 'fluid' ? 'none' : maxWidth
        })
      ),
      linkSection: css({
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: style === 'block' ? 'column' : 'row',
        lineHeight: '16px'
      }),
      item: css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: '0 2px'
      }),
      nodeLink: merge(
        theme.buttons.labelButton,
        css({
          ...theme.fontStyles.sansSerifRegular16,
          '&[data-active="true"]': {
            color: theme.colors.primary,
            cursor: 'default',
            textDecoration: 'underline'
          },
          margin: '0 8px'
        })
      )
    }
  }
)

const mouseDownHandler = (node, onSelect) => event => {
  event.preventDefault()
  onSelect(node)
}

const SelectionPathMenu = ({
  selectedNode,
  selectionPath,
  onSelect,
  styles,
  themeConfig,
  setThemeConfig
}) => {
  if (!selectionPath) {
    return <div {...styles.container}>Multiple nodes selected</div>
  }
  const icon =
    themeConfig.align === 'right' ? (
      <AlignLeftIcon size={22} />
    ) : (
      <AlignRightIcon size={22} />
    )

  return (
    <Fragment>
      <div {...styles.container}>
        <div {...styles.linkSection}>
          {selectionPath.map((n, i) => (
            <span key={n.key} {...styles.item}>
              {i > 0 && <ArrowIcon />}
              <a
                {...styles.nodeLink}
                onMouseDown={mouseDownHandler(n, onSelect)}
                data-active={n === selectedNode}
              >
                {n.type || n.object}
              </a>
            </span>
          ))}
        </div>
      </div>
      <div {...styles.layout.container}>
        <div {...styles.layout.section}>
          <button
            {...styles.buttons.iconButton}
            onClick={() => {
              setThemeConfig({
                align: themeConfig.align === 'left' ? 'right' : 'left'
              })
            }}
          >
            {icon}
          </button>
        </div>
      </div>
    </Fragment>
  )
}

SelectionPathMenu.propTypes = {
  selectedNode: PropTypes.object,
  selectionPath: PropTypes.object,
  onSelect: PropTypes.func.isRequired
}

export default compose(
  withApp,
  withThemeConfig,
  withStyles
)(SelectionPathMenu)
