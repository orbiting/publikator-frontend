import { Fragment } from 'react'
import { SchemaComponent } from '../../base/components/Schema'
import {
  isTeaser,
  isTeaserGroup,
  isTeaserTitle,
  isTeaserTypo
} from './lib'

export default ({ node, children, attributes }) => {
  if (isTeaser(node)) {
    const image =
      node.data.get('showImage') &&
      (node.data.get('image') || '/static/placeholder.png')
    return (
      <Fragment>
        <SchemaComponent
          name={node.type}
          {...node.data.toJS()}
          image={image || ''}
          attributes={attributes}
        >
          {children}
        </SchemaComponent>
      </Fragment>
    )
  }

  if (isTeaserGroup(node)) {
    return (
      <Fragment>
        <SchemaComponent
          name={node.type}
          {...node.data.toJS()}
          attributes={attributes}
        >
          {children}
        </SchemaComponent>
      </Fragment>
    )
  }

  if (isTeaserTitle(node)) {
    return (
      <SchemaComponent
        name={node.type}
        {...node.data.toJS()}
        attributes={attributes}
      >
        {children}
      </SchemaComponent>
    )
  }
  if (isTeaserTypo(node)) {
    return (
      <SchemaComponent
        name={node.type}
        {...node.data.toJS()}
        attributes={attributes}
      >
        {children}
      </SchemaComponent>
    )
  }
}
