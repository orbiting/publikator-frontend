export const match = object => type => node =>
  node && node.object === object && node.type === type

export const matchBlock = match('block')

export const matchMark = match('mark')

export const matchInline = match('inline')

export const matchDocument = node =>
  node.object === 'document'
