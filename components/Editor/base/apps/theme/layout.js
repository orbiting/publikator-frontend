import { css, merge } from 'glamor'
import {
  colors
  // mediaQueries,
} from '@project-r/styleguide'

export const ui = ({ isVisible, align, style }) =>
  css({
    ...((style !== 'block' && {
      display: !isVisible ? 'none' : 'flex',
      position: 'fixed',
      width: '0',
      top: '80px',
      right: align === 'right' ? '0' : 'auto',
      zIndex: 9999
    }) ||
      {}),
    flexDirection: 'column',
    flexWrap: 'noWrap',
    alignItems: align === 'right' ? 'flex-end' : 'flex-start',
    alignContent: align === 'right' ? 'flex-end' : 'flex-start',
    '&:empty': {
      height: 0
    }
  })

export const container = ({
  align, // 'right'
  style, // 'block'
  maxWidth
}) =>
  css({
    backgroundColor: style === 'fluid' ? colors.secondaryBg : '#fff',
    maxWidth: `245px`,
    width: style === 'block' ? `${maxWidth}px` : 'max-content',
    borderColor: colors.divider,
    borderTopWidth: '0',
    borderBottomWidth: '0',
    borderRightWidth:
      style === 'block' && align === 'left' ? '1px' : '0',
    borderLeftWidth:
      style === 'block' && align === 'right' ? '1px' : '0',
    padding: '7px 5px 12px 5px',
    float: align === 'right' ? 'right' : 'none'
  })

export const section = css({
  marginBottom: '12px',
  padding: '2px 5px 5px 5px'
})

export const backdrop = css({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
})

export const heading = ({ align }) =>
  css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  })

export const sectionHeader = config => merge(heading(config), section)

export const outline = css({
  border: `3px solid ${colors.primary}`,
  position: 'absolute',
  zIndex: 1,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
})

export const hairline = css({
  borderTop: `1px solid ${colors.disabled}`,
  margin: '7px 0',
  width: '100%'
})

export const horizontalGroup = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
  alignContent: 'stretch',
  '& > *': {
    margin: '0 6px'
  }
})

export const verticalGroup = css({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
  alignContent: 'stretch',
  '& > *': {
    margin: '6px 0'
  }
})

export const actions = merge(horizontalGroup, section)

export const hSection = merge(horizontalGroup, section)

export const vSection = merge(verticalGroup, section)

export default config => ({
  ui: ui(config),
  container: container(config),
  section,
  hSection,
  vSection,
  heading: heading(config),
  outline,
  backdrop,
  sectionHeader: sectionHeader(config),
  hairline,
  horizontalGroup,
  actions
})
