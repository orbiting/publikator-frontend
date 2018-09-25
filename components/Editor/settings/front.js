import Meta from '../plugins/meta'
import UI from '../plugins/ui'

const contentPlugins = []

const plugins = [...contentPlugins, Meta, UI(contentPlugins)]

export default {
  plugins
}
