import { Fragment } from 'react'
import { compose } from 'ramda'
import { Label, Radio, Checkbox } from '@project-r/styleguide'
import { withTheme } from '../../base/apps/theme'
import { withNodeData } from '../../base/apps/nodeData'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'

const sizes = [
  {
    label: 'Normal',
    props: { size: undefined }
  },
  {
    label: 'Gross',
    props: { size: 'breakout' }
  },
  {
    label: 'Mittel',
    props: { size: 'narrow' }
  },
  {
    label: 'Klein',
    props: { size: 'tiny' }
  }
]

const VideoEmbedForm = compose(
  withNodeData(),
  withTheme()
)(({ value, onChange, styles }) => {
  const src = value.get('src')
  return (
    <SidebarBottom>
      <div {...styles.layout.container}>
        <div {...styles.layout.sectionHeader}>
          <Label>Grösse</Label>
        </div>
        <div {...styles.layout.vSection}>
          {sizes.map((size, i) => {
            let checked = Object.keys(size.props).every(
              key => value.get(key) === size.props[key]
            )
            return [
              <Radio
                key={`radio${i}`}
                checked={checked}
                onChange={() => {
                  if (checked) return
                  onChange(size.props)
                }}
              >
                {size.label}
              </Radio>
            ]
          })}
        </div>
      </div>
      {!!src &&
        src.hls && (
        <div {...styles.layout.container}>
          <div {...styles.layout.vSection}>
            <Checkbox
              checked={value.get('forceAudio')}
              onChange={() => {
                const checked = value.get('forceAudio')
                onChange({
                  forceAudio: !checked
                })
              }}
            >
                nur Audio
            </Checkbox>
            <Checkbox
              checked={value.get('cinemagraph')}
              onChange={() => {
                const checked = value.get('cinemagraph')
                onChange({
                  cinemagraph: !checked
                })
              }}
            >
                Cinemagraph
            </Checkbox>
          </div>
        </div>
      )}
    </SidebarBottom>
  )
})

export const renderUI = ({ editor }) => {
  return (
    <Fragment>
      <Selected isNode='videoEmbed'>
        {({ node }) => {
          return <VideoEmbedForm node={node} editor={editor} />
        }}
      </Selected>
    </Fragment>
  )
}
