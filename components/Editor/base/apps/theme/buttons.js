import { css, merge } from 'glamor'
import { colors } from '@project-r/styleguide'

export const button = css({
  border: 'none',
  '&:not([disabled])': {
    cursor: 'pointer'
  },
  outline: 'none',
  '&:active': {
    outline: 'none'
  }
})

export const iconButton = merge(
  button,
  css({
    color: colors.textColor,
    display: 'inline-flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 0,
    backgroundColor: 'transparent',
    transition: 'color .2s',
    '&[disabled]': {
      cursor: 'default',
      color: colors.disabled
    },
    '&[data-active="true"]': {
      color: colors.primary
    }
  })
)

export const labelButton = merge(
  button,
  css({
    color: colors.textColor,
    display: 'inline-flex',
    flexDirection: 'row',
    fontSize: '14px',
    lineHeight: '28px',
    padding: 0,
    marginRight: '14px',
    backgroundColor: 'transparent',
    transition: 'color .2s, background-color 2s',
    '&[disabled]': {
      color: colors.disabled
    },
    '&:hover:not([disabled])': {
      color: colors.primary
    }
  })
)

export default () => ({
  iconButton,
  labelButton
})
