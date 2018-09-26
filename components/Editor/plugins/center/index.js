import { anyPass } from 'ramda'
import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'

import InfoBox from '../infoBox'
import Figure from '../figure'
import FigureGroup from '../figureGroup'
import Toolbar from '../toolbar'

const CenterToolbar = Toolbar({
  isNode: isBlock('center'),
  offset: 4,
  isChildNode: anyPass([
    isBlock('paragraph'),
    isBlock('infoBox'),
    isBlock('figure'),
    isBlock('subhead'),
    isBlock('list'),
    isBlock('figureGroup')
  ]),
  insertItems: [
    { text: 'Infobox', value: InfoBox.getNew },
    { text: 'Figure', value: Figure.getNew },
    { text: 'Figure Group', value: FigureGroup.getNew }
  ]
})

export default {
  renderNode ({ node, attributes, children }) {
    if (isBlock('center', node)) {
      return (
        <SchemaComponent name='center' {...attributes}>
          {children}
        </SchemaComponent>
      )
    }
  },
  renderUI: CenterToolbar.renderUI
}
