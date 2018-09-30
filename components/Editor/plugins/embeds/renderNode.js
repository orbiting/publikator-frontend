import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'
import { withVideoEmbed, withTwitterEmbed } from './embedLoader'

const TwitterEmbed = withTwitterEmbed(props => (
  <SchemaComponent {...props} name='twitterEmbed' />
))

const VideoEmbed = withVideoEmbed(props => (
  <SchemaComponent {...props} name='videoEmbed' />
))

export default ({ node, attributes, editor }) => {
  if (isBlock('twitterEmbed', node)) {
    return (
      <TwitterEmbed
        node={node}
        attributes={attributes}
        editor={editor}
      />
    )
  }
  if (isBlock('videoEmbed', node)) {
    return (
      <VideoEmbed
        node={node}
        attributes={attributes}
        editor={editor}
      />
    )
  }
}
