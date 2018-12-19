import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import BrowserRouter from 'react-router-dom/BrowserRouter'
import OfflinePluginRuntime from 'offline-plugin/runtime'
import config from '@core/config'
import configure from '@core/configure'
import theme from '@app/theme'
import App from '@app/containers/app'
import {
  Auth,
  Dictionary,
  Term,
  Notification,
} from '@core/stores'
import AppStore from '@app/stores/app'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

configure(config)

const stores = {
  app: new AppStore(),
  auth: new Auth(),
  dictionary: new Dictionary(),
  term: new Term(),
  notification: new Notification(),
}

config.env === 'production' && OfflinePluginRuntime.install({
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
