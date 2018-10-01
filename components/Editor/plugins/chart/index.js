import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'
import withT from '../../../../lib/withT'
import { getNew } from './lib'
import EditOverlay from './EditOverlay'

const CSVChart = withT(props => (
  <SchemaComponent name='chartCanvas' {...props} />
))

export default {
  getNew,
  renderNode ({ node, attributes, children, editor }) {
    if (isBlock('chart', node)) {
      return (
        <SchemaComponent
          name='chart'
          size={node.data.get('size')}
          attributes={attributes}
        >
          {children}
        </SchemaComponent>
      )
    }

    if (isBlock('chartCanvas', node)) {
      const config = node.data.get('config') || {}
      const values = node.data.get('values')

      const chart = (
        <CSVChart
          key={JSON.stringify({
            values,
            config
          })}
          // showException
          values={values}
          config={config}
        />
      )

      return (
        <EditOverlay
          {...{ node, attributes, children, editor }}
          preview={chart}
        />
      )
    }
  },
  schema: {
    blocks: {
      chartCanvas: {
        isVoid: true
      }
    }
  }
}
