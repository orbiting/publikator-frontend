import { fontStyles, colors } from '@project-r/styleguide'
import { css } from 'glamor'

export default {
  cardLoading: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px'
  }),
  card: css({
    marginBottom: '12px'
  }),
  cardTitle: css({
    ...fontStyles.sansSerifRegular16,
    display: 'block'
  }),
  cardInfo: css({
    display: 'flex',
    flexDirection: 'column',
    margin: '6px 0',
    '& > *': {
      margin: '3px 0'
    }
  }),
  cardSelect: css({
    color: colors.disabled
  }),
  cardActions: css({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '4px'
  })
}
