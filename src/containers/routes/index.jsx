import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'containers/route'
import NotFound from 'screens/not-found'
import Home from 'screens/home'
import {
  Login,
  ForgotPassword,
} from 'screens/auth'
import Term from 'screens/term'

export default () =>
  <Switch>
    <Route.Unauthenticated path='/login' exact component={Login} />
    <Route.Unauthenticated path='/forgot-password' exact component={ForgotPassword} />
    <Route.Authenticated path='/' exact component={Home} />
    <Route.Authenticated path='/:dictionary/:terms*' component={Term} />
    <Route component={NotFound} />
  </Switch>
