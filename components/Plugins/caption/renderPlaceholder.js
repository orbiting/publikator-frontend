import {
  compose,
  always,
  ifElse,
  both
} from 'ramda'

import {
  safeProp,
  hasEmptyText,
  isBlock
} from '../../Editor/lib'

import { InlinePlaceholder } from '../../Editor/components/Placeholder'

export default compose(
  ifElse(
    compose(
      both(isBlock('captionText'), hasEmptyText),
      safeProp('node')
    ),
    () => (
      <InlinePlaceholder>
        Legende
      </InlinePlaceholder>
    )
  ),
  ifElse(
    compose(
      both(
        isBlock('captionByline'),
        hasEmptyText
      ),
      safeProp('node')
    ),
    () => (
      <InlinePlaceholder>
        Credits
      </InlinePlaceholder>
    )
  )
)(always(undefined))
