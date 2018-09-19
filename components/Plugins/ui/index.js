import { Fragment } from 'react'

export default plugins => {
  const renderFunctions = plugins
    .map(p => p.renderUI)
    .filter(Boolean)

  return {
    renderEditor({ value, children }, editor) {
      return (
        <Fragment>
          {children}
          {renderFunctions.map((F, i) => (
            <F
              key={`plugin-${i}`}
              value={value}
              editor={editor}
            />
          ))}
        </Fragment>
      )
    },
  }
}
