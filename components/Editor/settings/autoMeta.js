import slugify from '../../../lib/utils/slug'
import { isBlock } from '../base/lib'

export default change => {
  const documentNode = change.value.document
  const data = documentNode.data
  const isEnabled =
    !data || !data.delete('template').size || data.get('auto')
  if (!isEnabled) {
    return null
  }

  let newData = data
    .set('auto', true)
    .set('feed', true)
    .set('gallery', true)

  const title = documentNode.nodes.find(isBlock('titleBlock'))
  if (title) {
    const headline = title.nodes.first()
    const headlineText = headline ? headline.text : ''
    const subject = title.nodes.get(1)
    const lead =
      isBlock('lead', title.nodes.get(2)) && title.nodes.get(2)

    newData = newData
      .set('title', headlineText)
      .set('subject', subject ? subject.text : '')
      .set('description', lead ? lead.text : '')
      .set('slug', slugify(headlineText))
  }
  return data.equals(newData) ? null : newData
}
