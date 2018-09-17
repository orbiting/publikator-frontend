import {
  ifElse,
  last,
  compose,
  always,
  applySpec,
  defaultTo,
  objOf,
  converge,
  map,
  concat,
} from 'ramda'
import S from '../transform/slate'
import M from '../transform/mdast'
import {
  getMany,
  normalize,
} from '../transform/normalize'
import {
  safeProp,
  mergeResults,
  safePath,
} from '../transform/common'

const imageFromMdast = ifElse(
  M.isImageParagraph,
  applySpec({
    url: safePath(['children', 0, 'url']),
    ref: safePath(['children', 0, 'alt']),
  })
)

const imageToMdast = node => ({
  type: 'paragraph',
  children: [
    {
      type: 'image',
      url: safeProp('url', node),
      alt: safeProp('alt', node),
    },
  ],
})

const codeFromMdast = ifElse(
  M.isCode,
  node => node.value
)

const codeToMdast = value => ({
  type: 'code',
  lang: 'html',
  value,
})

const fromMdast = ifElse(
  M.isZone('HTML'),
  mergeResults(
    S.toBlock('html'),
    compose(
      children => ({
        data: {
          images: normalize(
            getMany(imageFromMdast)
          )(children),
          code: compose(
            codeFromMdast(always('')),
            last
          )(children),
        },
      }),
      defaultTo([]),
      safeProp('children')
    )
  )
)

const toMdast = ifElse(
  S.isBlock('html'),
  mergeResults(
    compose(
      M.toZone('HTML'),
      always({})
    ),
    compose(
      objOf('children'),
      converge(concat, [
        compose(
          map(imageToMdast),
          safePath(['data', 'images'])
        ),
        compose(
          Array.of,
          codeToMdast,
          safePath(['data', 'code'])
        ),
      ])
    )
  )
)

export default {
  fromMdast,
  toMdast,
}
