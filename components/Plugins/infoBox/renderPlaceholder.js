import {
  compose,
  ifElse,
  always,
  both,
} from 'ramda'

import Placeholder from '../../Editor/components/Placeholder'

import {
  safeProp,
  isBlock,
  hasEmptyText,
} from '../../Editor/lib'

export default compose(
  ifElse(
    compose(
      both(isBlock('infoBoxTitle'), hasEmptyText),
      safeProp('node')
    ),
    () => <Placeholder>Titel</Placeholder>
  ),
  ifElse(
    compose(
      both(isBlock('infoBoxText'), hasEmptyText),
      safeProp('node')
    ),
    () => <Placeholder>Text...</Placeholder>
  )
)(always(undefined))
