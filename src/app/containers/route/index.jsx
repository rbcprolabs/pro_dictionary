import React from 'react'
import { observer, inject as injectStore } from 'mobx-react'
import { Route, Redirect } from 'react-router-dom'

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, '\\$&')

  const
    regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i'),
    results = regex.exec(url)

  if (!results) return null

  if (!results[2]) return ''

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const
  AuthenticatedRoute = injectStore('auth')(observer(({component: Component, auth, ...props}) =>
    auth.status
      ? <Component {...props} />
      : <Redirect to={`/login?redirect=${props.location.pathname}`}/>
  )),
  UnauthenticatedRoute = injectStore('auth')(observer(({component: Component, auth, ...props}) => {
    const redirect = querystring('redirect')

    return !auth.status
      ? <Component {...props} />
      : <Redirect to={redirect === '' || redirect === null ? '/' : redirect}/>
  }))

Route.Authenticated = ({ component, ...rest }) =>
  <Route
    {...rest}
    render={props => <AuthenticatedRoute component={component} {...props} />}
  />

Route.Unauthenticated = ({ component, ...rest }) =>
  <Route
    {...rest}
    render={props => <UnauthenticatedRoute component={component} {...props} />}
  />

export default Route
