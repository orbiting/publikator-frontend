import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Portal, {
  getOwnerDocument
} from './Portal'

const getContainer = (id, doc) => {
  const el = doc.getElementById(id)
  if (el) {
    return el
  }
  console.warn(
    `Can't mount Slot. DOMNode with id "${id}" not found.`
  )
}

class Slot extends Component {
  componentDidMount () {
    if (!this.container) {
      this.container = getContainer(
        this.props.id,
        getOwnerDocument(this)
      )
      if (this.props.children) {
        this.forceUpdate()
      }
    }
  }

  componentWillUnmount () {
    this.container = null
  }

  render () {
    return (
      <Portal container={this.container}>
        {this.props.children}
      </Portal>
    )
  }
}

Slot.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onRendered: PropTypes.func
}

export default Slot
