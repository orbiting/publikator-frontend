import { css } from 'glamor'
import {
  colors
  // mediaQueries,
} from '@project-r/styleguide'

export const ui = ({ align }) =>
  css({
    // display: !isVisible ? 'none' : 'flex',
    // // position: 'fixed',
    // width: '0',
    // top: '80px',
    // right: align === 'right' ? '0' : 'auto',
    // zIndex: 9999,
    flexDirection: 'column',
    flexWrap: 'noWrap',
    alignItems:
      align === 'right'
        ? 'flex-end'
        : 'flex-start',
    alignContent:
      align === 'right'
        ? 'flex-end'
        : 'flex-start',
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
    maxWidth: `245px`,
    width:
      style === 'block'
        ? `${maxWidth}px`
        : 'max-content',
    borderColor: colors.divider,
    borderTopWidth: '0',
    borderBottomWidth: '0',
    borderRightWidth:
      style === 'block' && align === 'left'
        ? '1px'
        : '0',
    borderLeftWidth:
      style === 'block' && align === 'right'
        ? '1px'
        : '0',
    right: align === 'right' ? 0 : 'auto',
    marginBottom: '20px'
  })

export const section = css({
  marginTop: '12px'
})

export const heading = css({
  display: 'flex',
  justifyContent: 'space-between'
})

export const sectionHeading = css(
  section,
  heading
)

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

export const actions = css(
  horizontalGroup,
  section
)

export default config => ({
  ui: ui(config),
  container: container(config),
  section,
  heading,
  outline,
  sectionHeading,
  hairline,
  horizontalGroup,
  actions
})
