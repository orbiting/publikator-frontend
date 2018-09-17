import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const ownerDocument = node => {
  return (node && node.ownerDocument) || document
}

const getContainer = (
  container,
  defaultContainer
) => {
  container =
    typeof container === 'function'
      ? container()
      : container
  return (
    ReactDOM.findDOMNode(container) ||
    defaultContainer
  )
}

export const getOwnerDocument = element => {
  return ownerDocument(
    ReactDOM.findDOMNode(element)
  )
}

class Portal extends React.Component {
  constructor(props) {
    super(props)
    this.getMountNode = () => {
      return this.mountNode
    }
  }

  componentDidMount() {
    this.setContainer(this.props.container)
    this.forceUpdate(this.props.onRendered)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.container !== this.props.container
    ) {
      this.setContainer(nextProps.container)
    }
  }

  componentWillUnmount() {
    this.mountNode = null
  }

  setContainer(container) {
    this.mountNode = getContainer(
      container,
      getOwnerDocument(this).body
    )
  }

  render() {
    const { children } = this.props

    return this.mountNode
      ? ReactDOM.createPortal(
          children,
          this.mountNode
        )
      : null
  }
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  container: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  onRendered: PropTypes.func
}

export default Portal
