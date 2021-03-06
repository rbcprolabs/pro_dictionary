import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from '@app/containers/route'
import NotFound from '@app/screens/not-found'
import Home from '@app/screens/home'
import Login from '@app/screens/login'
import ForgotPassword from '@app/screens/forgot-password'
import Term from '@app/screens/term'

const Routes = () =>
  <Switch>
    <Route.Unauthenticated path='/login' exact component={Login} />
    <Route.Unauthenticated path='/forgot-password' exact component={ForgotPassword} />
    <Route.Authenticated path='/' exact component={Home} />
    <Route.Authenticated path='/:dictionary/:terms*' component={Term} />
    <Route component={NotFound} />
  </Switch>

export default Routes
