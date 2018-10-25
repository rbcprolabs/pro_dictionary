import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'containers/route'
import NotFound from 'screens/not-found'
import Home from 'screens/home'
import {
  Login,
  ForgotPassword,
} from 'screens/auth'
import {
  New as TermNew,
  Detail as TermDetail,
} from 'screens/term'

export default () =>
  <Switch>
    <Route.Unauthenticated path='/login' exact component={Login} />
    <Route.Unauthenticated path='/forgot-password' exact component={ForgotPassword} />
    <Route.Authenticated path='/' exact component={Home} />
    <Route.Authenticated path='/term/new' exact component={TermNew} />
    <Route.Authenticated path='/term/:id' exact component={TermDetail} />
    <Route component={NotFound} />
  </Switch>
