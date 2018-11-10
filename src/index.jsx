import '@babel/polyfill'
import Amplify from 'aws-amplify'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import BrowserRouter from 'react-router-dom/BrowserRouter'
import OfflinePluginRuntime from 'offline-plugin/runtime'
import config from './config'
import theme from './theme'
import App from 'containers/app'
import {
  Auth,
  Dictionary,
  Term,
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
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [{
      name: 'dictionary',
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION,
    },{
      name: 'term',
      endpoint: config.apiGateway.URL,
      region: config.apiGateway.REGION,
    }],
  },
})

const stores = {
  auth: new Auth(),
  dictionary: new Dictionary(),
  term: new Term(),
  notification: new Notification(),
}

OfflinePluginRuntime.install({
  onUpdating() {
    console.log('SW Event:', 'onUpdating')
  },
  onUpdateReady() {
    stores.notification.notify({
      variant: Notification.INFO,
      message: 'Загружается новая версия сайта',
    })
    OfflinePluginRuntime.applyUpdate()
  },
  async onUpdated() {
    await stores.notification.notify({
      variant: Notification.WARNING,
      message: 'Сейчас произойдет обновление страницы',
    })
    window.location.reload()
  },
  onUpdateFailed() {
    stores.notification.notify({
      variant: Notification.ERROR,
      message: 'Обновление сайта не удалось, перезагрузите страницу',
    })
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
      <Provider {...stores}>
        <BrowserRouter>
          <>
            <CssBaseline />
            <App />
          </>
        </BrowserRouter>
      </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
