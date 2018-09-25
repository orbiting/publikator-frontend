export const match = kind => type => node =>
  node && node.kind === kind && node.type === type

export const matchBlock = match('block')

export const matchMark = match('mark')

export const matchInline = match('inline')

export const matchDocument = node =>
  node.kind === 'document'
