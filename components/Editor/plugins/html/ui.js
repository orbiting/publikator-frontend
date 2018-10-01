import { Fragment } from 'react'
import { Label } from '@project-r/styleguide'
import { compose } from 'ramda'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'
import { withTheme } from '../../base/apps/theme'
import { withNodeData } from '../../base/apps/nodeData'
import FilesInput from './FilesInput'

const HTMLForm = compose(
  withTheme(),
  withNodeData()
)(({ styles, value, onChange }) => {
  return (
    <SidebarBottom>
      <div {...styles.layout.container}>
        <div {...styles.layout.sectionHeader}>
          <Label>HTML</Label>
        </div>
        <div {...styles.layout.section}>
          <FilesInput
            data={value.toJS()}
            onChange={files => {
              onChange({
                code: files.code,
                images: files.images
              })
            }}
          />
        </div>
      </div>
    </SidebarBottom>
  )
})

export const renderUI = ({ editor }) => (
  <Fragment>
    <Selected isNode='html'>
      {({ node }) => <HTMLForm node={node} editor={editor} />}
    </Selected>
  </Fragment>
)
