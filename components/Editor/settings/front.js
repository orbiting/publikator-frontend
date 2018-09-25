
import Meta from '../plugins/meta'
import UI from '../plugins/ui'

const contentPlugins = []

export default ({ schema }) => ({
  plugins: [
    ...contentPlugins,
    Meta,
    UI(contentPlugins)
  ]
})
