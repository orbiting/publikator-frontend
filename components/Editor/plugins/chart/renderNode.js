import { SchemaComponent } from '../../base/components/Schema'
import { isBlock } from '../../base/lib'
import withT from '../../../../lib/withT'
import EditOverlay from './EditOverlay'

const CSVChart = withT(props => (
  <SchemaComponent name='chartCanvas' {...props} />
))

export default ({ node, attributes, children, editor }) => {
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

  if (isBlock('chartTitle', node)) {
    return (
      <SchemaComponent name='chartTitle' attributes={attributes}>
        {children}
      </SchemaComponent>
    )
  }

  if (isBlock('chartLead', node)) {
    return (
      <SchemaComponent name='chartLead' attributes={attributes}>
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

  if (isBlock('chartNote', node)) {
    return (
      <SchemaComponent name='chartNote' attributes={attributes}>
        {children}
      </SchemaComponent>
    )
  }
}
