import { anyPass } from 'ramda'
import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'

import InfoBox from '../infoBox'
import Figure from '../figure'
import FigureGroup from '../figureGroup'
import PullQuote from '../pullQuote'
import HTML from '../html'
import Toolbar from '../toolbar'

const CenterToolbar = Toolbar({
  isNode: isBlock('center'),
  offset: 1,
  isChildNode: anyPass([
    isBlock('paragraph'),
    isBlock('infoBox'),
    isBlock('figure'),
    isBlock('subhead'),
    isBlock('list'),
    isBlock('figureGroup'),
    isBlock('pullQuote'),
    isBlock('html')
  ]),
  insertItems: [
    { text: 'Infobox', value: InfoBox.getNew },
    { text: 'Figure', value: Figure.getNew },
    { text: 'Figure Group', value: FigureGroup.getNew },
    { text: 'Pull Quote', value: PullQuote.getNew },
    { text: 'HTML Element', value: HTML.getNew }
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
