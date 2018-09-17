import {
  serialize,
  deserialize,
} from '../../../lib/transform/serializer'
import DocumentRule from './DocumentRule'
import plugins from './plugins'

export default {
  plugins,
  serialize: serialize(DocumentRule.toMdast),
  deserialize: deserialize(
    DocumentRule.fromMdast
  ),
}
