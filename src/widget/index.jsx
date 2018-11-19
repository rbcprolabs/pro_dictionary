import '@babel/polyfill'
import Amplify from 'aws-amplify'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import config from '@core/config'
import App from '@widget/containers/app'
import {
  Auth,
  Dictionary,
  Term,
} from '@core/stores'
import Extension from '@widget/stores/extension'


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
  extension: new Extension(),
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
)
