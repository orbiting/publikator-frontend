import { Component } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import createStore from './createStore'

export default class StateProvider extends Component {
  constructor (props) {
    super(props)
    this.store = createStore()
    this.onChange = () => {}
    this.store.subscribe(this.onChange)
  }

  render () {
    return (
      <ReduxProvider store={this.store}>
        {this.props.children}
      </ReduxProvider>
    )
  }
}
