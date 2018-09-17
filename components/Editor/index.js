import { Component } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import Editor from './components/Editor'
import EditorUI from './components/UI'
import createStore from './createStore'

export { Editor, EditorUI }

export class EditorStateProvider extends Component {
  constructor(props) {
    super(props)
    this.store = createStore()
    this.onChange = () => {}
    this.store.subscribe(this.onChange)
  }

  render() {
    return (
      <ReduxProvider store={this.store}>
        {this.props.children}
      </ReduxProvider>
    )
  }
}
