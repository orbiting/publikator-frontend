import {
  ifElse,
  compose,
  always,
  split,
  intersperse,
  map,
  objOf,
} from 'ramda'

import { safeProp } from '../transform/common'

import S from '../transform/slate'
import M from '../transform/mdast'

export default {
  fromMdast: compose(
    ifElse(M.isText, S.toText),
    ifElse(
      M.isBreak,
      compose(
        S.toText,
        always({ value: '\n' })
      )
    )
  ),
  toMdast: ifElse(
    S.isText,
    compose(
      intersperse(M.toBreak()),
      map(
        compose(
          M.toText,
          objOf('value')
        )
      ),
      split('\n'),
      safeProp('value')
    )
  ),
}
