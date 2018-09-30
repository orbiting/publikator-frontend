import { isBlock } from '../../base/lib'

// One capturing group at match[1] that catches the status id
const TWITTER_REGEX = /^https?:\/\/twitter\.com\/(?:#!\/)?\w+\/status(?:es)?\/(\d+)$/

// One capturing group at match[1] that catches the video id
const YOUTUBE_REGEX = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*$/

// One capturing group at match[1] that catches the video id
const VIMEO_REGEX = /^(?:http|https)?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|)(\d+)(?:|\/\?)$/

export const isVideoUrl = url =>
  YOUTUBE_REGEX.test(url) || VIMEO_REGEX.test(url)

export const getVideoQueryParams = url => {
  if (YOUTUBE_REGEX.test(url)) {
    return {
      embedType: 'YoutubeEmbed',
      id: YOUTUBE_REGEX.exec(url)[1]
    }
  }
  if (VIMEO_REGEX.test(url)) {
    return {
      embedType: 'VimeoEmbed',
      id: VIMEO_REGEX.exec(url)[1]
    }
  }
  throw new Error(`No valid video embed URL: ${url}`)
}

export const isTwitterUrl = url => TWITTER_REGEX.test(url)

export const getTwitterQueryParams = url => {
  if (TWITTER_REGEX.test(url)) {
    return {
      embedType: 'TwitterEmbed',
      id: TWITTER_REGEX.exec(url)[1]
    }
  }
  throw new Error(`No valid twitter embed URL: ${url}`)
}

const factory = ({ matchSource, matchUrl, getQueryParams, type }) => (
  event,
  change
) => {
  if (event.key !== 'Enter') return
  if (event.shiftKey !== false) return

  const { value } = change
  if (!value.selection.isCollapsed) return

  const block = value.blocks.first()

  if (!block || !matchSource(block)) return

  const text = block.text

  if (!text) return

  const url = text.trim()

  if (matchUrl(url)) {
    const parent = value.document.getParent(block.key)
    const newNode = {
      object: 'block',
      type: type,
      data: {
        queryParams: getQueryParams(url),
        url
      },
      isVoid: true
    }

    event.preventDefault()
    return change
      .insertNodeByKey(
        parent.key,
        parent.nodes.indexOf(block),
        newNode
      )
      .removeNodeByKey(block.key)
  }
}

const videoKeyHandler = factory({
  matchUrl: isVideoUrl,
  matchSource: isBlock('paragraph'),
  getQueryParams: getVideoQueryParams,
  type: 'videoEmbed'
})

const twitterKeyHandler = factory({
  matchUrl: isTwitterUrl,
  matchSource: isBlock('paragraph'),
  getQueryParams: getTwitterQueryParams,
  type: 'twitterEmbed'
})

const handlers = [videoKeyHandler, twitterKeyHandler]

export default (event, change) => {
  for (let handler of handlers) {
    const res = handler(event, change)
    if (res) {
      return res
    }
  }
}
