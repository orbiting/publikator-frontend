import { Fragment } from 'react'
import { Radio, Label } from '@project-r/styleguide'
import Selected from '../../../base/components/Selected'
import { withTheme } from '../../../base/apps/theme'
import { updateData } from '../../../base/lib/changes'
import { isTeaserGroup } from '../lib'

export default withTheme()(({ editor, styles }) => (
  <Selected isNode={isTeaserGroup}>
    {({ node }) => {
      const onChange = data => {
        editor.change(updateData, node, data)
      }
      const columns = node.data.get('columns')

      const Columns = (
        <Fragment>
          {[1, 2, 3].map(v => (
            <div key={v}>
              <Radio
                value={v}
                checked={columns === v}
                onChange={() => onChange({ columns: v })}
              >
                {v.toString()}
              </Radio>
            </div>
          ))}
        </Fragment>
      )

      return (
        <Fragment>
          <div {...styles.layout.container}>
            <div {...styles.layout.section}>
              <Label>Anzahl Spalten</Label>
            </div>
            <div {...styles.layout.section}>{Columns}</div>
          </div>
        </Fragment>
      )
    }}
  </Selected>
))
