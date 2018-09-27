import shortId from 'shortid'
import { Text, Inline, Block } from 'slate'
import { anyPass, either } from 'ramda'
import { isBlock, isInline, isType } from '../../base/lib'

export const getData = teaserType => ({
  teaserType,
  url: null,
  formatUrl: null,
  textPosition: 'topleft',
  color: '#000',
  bgColor: '#fff',
  center: false,
  image: null,
  byline: null,
  kind: 'editorial',
  titleSize: 'standard',
  reverse: false,
  portrait: true,
  showImage: true,
  onlyImage: false,
  id: shortId()
})

export const getNewTeaser = teaserType => {
  const data = getData(teaserType)
  return Block.create({
    type: teaserType,
    data: {
      ...data
    },
    nodes: [
      Block.create({
        type: 'frontFormat',
        data
      }),
      Block.create({
        type: `${teaserType}Title`,
        data
      }),
      Block.create({
        type: 'frontSubject',
        data
      }),
      Block.create({
        type: 'frontLead',
        data
      }),
      Block.create({
        type: 'frontCredit',
        data
      })
    ]
  })
}

export const getNewTeaserGroup = teaserType => {
  return Block.create({
    type: teaserType,
    data: { columns: 2 },
    nodes: [getNewTeaser('frontTile'), getNewTeaser('frontTile')]
  })
}

export const getFormOptions = teaserType => {
  switch (teaserType) {
    case 'frontImage':
      return [
        'textPosition',
        'color',
        'bgColor',
        'center',
        'kind',
        'titleSize',
        'image',
        'byline',
        'onlyImage',
        'feuilleton'
      ]
    case 'frontSplit':
      return [
        'color',
        'bgColor',
        'center',
        'image',
        'byline',
        'kind',
        'titleSize',
        'reverse',
        'portrait',
        'feuilleton'
      ]
    case 'frontTypo':
      return ['color', 'bgColor', 'kind', 'titleSize', 'feuilleton']

    case 'frontTile':
      return [
        'color',
        'bgColor',
        'center',
        'titleSize',
        'showImage',
        'onlyImage',
        'image',
        'byline',
        'kind',
        'feuilleton'
      ]
    default:
      return []
  }
}

export const teaserTypes = [
  'frontImage',
  'frontTypo',
  'frontSplit',
  'frontTile'
]

export const teaserTitleTypes = [
  'frontImageTitle',
  'frontTileTitle',
  'frontTypoTitle',
  'frontSplitTitle'
]

export const teaserGroupTypes = ['frontTileRow']

export const teaserTypoTypes = [
  'frontFormat',
  'frontSubject',
  'frontLead',
  'frontCredit'
]

const anyBlock = types => types.map(v => isBlock(v))

export const isTeaser = anyPass(anyBlock(teaserTypes))
export const isTeaserGroup = anyPass(anyBlock(teaserGroupTypes))
export const isTeaserTitle = anyPass(anyBlock(teaserTitleTypes))
export const isTeaserTypo = anyPass(anyBlock(teaserTypoTypes))
export const isTeaserElement = either(isTeaserTitle, isTeaserTypo)

const shouldUpdateData = either(isTeaserElement, isInline('link'))

export const updateTeaserData = (change, teaser, data) => {
  const nodesToUpdate = teaser.filterDescendants(shouldUpdateData)
  return nodesToUpdate
    .push(teaser)
    .reduce(
      (c, node) =>
        c.setNodeByKey(node.key, { data: node.data.merge(data) }),
      change
    )
}

export const updateTeaserElementData = (
  change,
  teaserElement,
  data
) => {
  return updateTeaserData(
    change,
    change.value.document.getParent(teaserElement.key),
    data
  )
}

const walk = nodes =>
  nodes.map(node => {
    if (isType('text', node)) {
      return Text.create(node.value)
    }
    if (isType('link', node)) {
      return Inline.create({
        type: 'link',
        data: {
          href: node.url,
          title: node.title
        },
        nodes:
          (node.children && walk(node.children).filter(Boolean)) || []
      })
    }
    return null
  })

export const cloneWithRepoData = (node, repoData) => {
  let data = node.data.set(
    'url',
    `https://github.com/${repoData.id}?autoSlug`
  )
  const meta = repoData.latestCommit.document.meta

  const formatMeta = meta.format && meta.format.meta
  if (formatMeta) {
    data = data
      .set('color', formatMeta.color)
      .set('kind', formatMeta.kind)
      .set(
        'formatUrl',
        `https://github.com/${meta.format.repoId}?autoSlug`
      )
  }

  const credits = Block.create({
    type: 'frontCredit',
    nodes: walk(meta.credits)
  }).update('nodes', nodes =>
    nodes.map(v => {
      if (isInline('link', v)) {
        return v.update('data', d =>
          d.set('color', data.get('color'))
        )
      }
      return v
    })
  )

  return Block.create({
    type: node.type,
    data,
    nodes: [
      Block.create({
        type: 'frontFormat',
        data,
        nodes: [Text.create(formatMeta ? formatMeta.title : '')]
      }),
      Block.create({
        type: `${node.type}Title`,
        data,
        nodes: [Text.create(meta.title)]
      }),
      Block.create({
        type: 'frontSubject',
        data,
        nodes: meta.subject ? [Text.create(meta.subject)] : []
      }),
      Block.create({
        type: 'frontLead',
        data,
        nodes: meta.description ? [Text.create(meta.description)] : []
      }),
      credits
    ]
  })
}
