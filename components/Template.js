import dynamic from 'next/dynamic'
import React from 'react'
import { Spinner } from '@project-r/styleguide'

const Template = dynamic({
  modules: ({ name }) => {
    switch (name) {
      default:
        //case 'article':
        return {
          template: import('./Templates/article'),
          createEditorSchema: import('./Templates/article/schema'),
          createRenderSchema: import('@project-r/styleguide/lib/templates/Article'),
        }
    }
  },
  ssr: false,
  loading: () => <Spinner />,
  render: (
    { children },
    {
      template,
      createEditorSchema,
      createRenderSchema,
    }
  ) => {
    const {
      deserialize,
      serialize,
      plugins,
    } = template
    const renderSchema = createRenderSchema()
    const editorSchema = createEditorSchema(
      renderSchema
    )

    return children({
      plugins,
      schema: editorSchema,
      deserialize,
      serialize,
    })
  },
})

export default props => <Template {...props} />
