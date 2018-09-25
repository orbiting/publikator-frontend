import React from 'react'
import { Map } from 'immutable'

const SchemaContext = React.createContext(Map())

export const SchemaProvider = ({
  schema,
  children
}) => (
  <SchemaContext.Provider value={schema}>
    {children}
  </SchemaContext.Provider>
)

export const SchemaComponent = ({
  name,
  attributes,
  ...props
}) => (
  <SchemaContext.Consumer>
    {schema => {
      const rule = schema.get(name)
      const Comp = rule && rule.component
      return Comp ? (
        <Comp {...props} />
      ) : (
        <div>
          <span contentEditable={false}>
            Missing Component in schema for type{' '}
            <code>{name}</code>
          </span>
          <div {...props} {...attributes} />
        </div>
      )
    }}
  </SchemaContext.Consumer>
)
