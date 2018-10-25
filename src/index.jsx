import '@babel/polyfill'
import Amplify from 'aws-amplify'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import Router from 'react-router-dom/Router'
import createBrowserHistory from 'history/createBrowserHistory'
import OfflinePluginRuntime from 'offline-plugin/runtime'
import config from './config'
import theme from './theme'
import App from 'containers/app'
import {
  Auth,
  Dictionary,
  Notification,
} from 'stores'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [{
      name: 'dictionary',
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION
    }]
  }
})

OfflinePluginRuntime.install({
  onUpdating() {
    console.log('SW Event:', 'onUpdating')
  },
  onUpdateReady() {
    console.log('SW Event:', 'onUpdateReady')
    OfflinePluginRuntime.applyUpdate()
  },
  onUpdated() {
    console.log('SW Event:', 'onUpdated')
    window.location.reload()
  },
  onUpdateFailed() {
    console.log('SW Event:', 'onUpdateFailed')
  }
})

const
  stores = {
    routing: new RouterStore(),
    auth: new Auth(),
    dictionary: new Dictionary(),
    notification: new Notification(),
  },
  history = syncHistoryWithStore(createBrowserHistory(), stores.routing)

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
      <Provider {...stores}>
        <Router history={history}>
          <>
            <CssBaseline />
            <App />
          </>
        </Router>
      </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
