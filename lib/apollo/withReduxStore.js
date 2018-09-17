import React from 'react'
import initReduxStore from './initReduxStore'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ =
  '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initReduxStore(initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initReduxStore(
      initialState
    )
  }
  return window[__NEXT_REDUX_STORE__]
}

export default App => {
  return class WithReduxStore extends React.Component {
    static displayName = `WithReduxStore(App)`

    static async getInitialProps(ctx) {
      const reduxStore = getOrCreateStore()

      ctx.ctx.reduxStore = reduxStore

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      }
    }

    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(
        props.initialReduxState
      )
    }

    render() {
      return (
        <App
          {...this.props}
          reduxStore={this.reduxStore}
        />
      )
    }
  }
}
