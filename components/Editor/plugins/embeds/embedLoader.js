import { Component } from 'react'
import { withApollo } from 'react-apollo'

import gql from 'graphql-tag'

import Loader from '../../../Loader'
import { colors } from '@project-r/styleguide'
import { css } from 'glamor'
// TMP: work around for missing t
// - rm all t code here after styelguide 5.62.1
import withT from '../../../../lib/withT'

const styles = {
  border: css({
    outline: `4px solid transparent`,
    width: '100%',
    lineHeight: 0,
    transition: 'outline-color 0.2s',
    '&[data-active="true"]': {
      outlineColor: colors.primary
    },
    pointerEvents: 'none'
  })
}

export const GET_VIDEO_EMBED = gql`
  query getVideoEmbed($id: ID!, $embedType: EmbedType!) {
    embed(id: $id, embedType: $embedType) {
      __typename
      ... on YoutubeEmbed {
        platform
        id
        createdAt
        retrievedAt
        userName
        userUrl
        thumbnail
        title
        userName
        userProfileImageUrl
        aspectRatio
      }
      ... on VimeoEmbed {
        platform
        id
        createdAt
        retrievedAt
        userName
        userUrl
        thumbnail
        title
        userName
        userProfileImageUrl
        aspectRatio
        src {
          mp4
          hls
          thumbnail
        }
      }
    }
  }
`

export const GET_TWITTER_EMBED = gql`
  query getTwitterEmbed($id: ID!, $embedType: EmbedType!) {
    embed(id: $id, embedType: $embedType) {
      __typename
      ... on TwitterEmbed {
        id
        createdAt
        retrievedAt
        text
        html
        userId
        userName
        userScreenName
        userProfileImageUrl
        image
        more
        playable
      }
    }
  }
`

const withEmbed = (query, WrappedComponent) => {
  class EmbedLoader extends Component {
    constructor (props, ...args) {
      super(props, ...args)
      const { node } = props
      const hasId = node.data.has('id')
      this.state = {
        loading: !hasId,
        error:
          !hasId &&
          !node.data.has('queryParams') &&
          'No embed params found.'
      }
    }

    componentDidMount () {
      const { loading, error } = this.state
      if (!loading || error) {
        return
      }

      const { node, client, editor } = this.props
      const { id, embedType } = node.data.get('queryParams')

      client
        .query({
          query,
          variables: { id, embedType }
        })
        .then(({ data }) => {
          editor.change(t =>
            t.setNodeByKey(node.key, {
              data: {
                ...data.embed,
                url: node.data.get('url')
              }
            })
          )
          this.setState({ error: null, loading: false })
        })
        .catch(e => this.setState({ e, loading: false }))
    }

    render () {
      const { loading, error } = this.state
      const { t, ...props } = this.props
      const { node, editor } = props
      const active = editor.value.blocks.some(
        block => block.key === node.key
      )

      return (
        <Loader
          loading={loading}
          error={error}
          render={() => {
            return (
              <div
                {...styles.border}
                {...props.attributes}
                data-active={active}
              >
                <WrappedComponent
                  {...this.props}
                  data={node.data.set('t', t).toJS()}
                />
              </div>
            )
          }}
        />
      )
    }
  }
  return withApollo(withT(EmbedLoader))
}

export const withVideoEmbed = WrappedComponent =>
  withEmbed(GET_VIDEO_EMBED, WrappedComponent)

export const withTwitterEmbed = WrappedComponent =>
  withEmbed(GET_TWITTER_EMBED, WrappedComponent)
