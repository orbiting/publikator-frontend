import { MetaUI } from './ui'

export default {
  renderEditor({ value, children }, editor) {
    return (
      <div>
        {children}
        <MetaUI
          node={value.document}
          editor={editor}
        />
      </div>
    )
  },
}
