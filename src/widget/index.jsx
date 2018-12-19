import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import config from '@core/config'
import configure from '@core/configure'
import App from '@widget/containers/app'
import {
  Auth,
  Dictionary,
  Term,
} from '@core/stores'
import Extension from '@widget/stores/extension'
import './style.scss'

configure(config)

const stores = {
  auth: new Auth(),
  dictionary: new Dictionary(),
  term: new Term(),
  extension: new Extension(),
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
)
