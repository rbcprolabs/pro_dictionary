import React from 'react'
import PropTypes from 'prop-types'
import { Observer, inject as injectStore } from 'mobx-react'
import Routes from '@app/containers/routes'
import Drawer from '@app/containers/drawer'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Zoom from '@material-ui/core/Zoom'
import CircularProgress from '@material-ui/core/CircularProgress'
import Notification from '@app/containers/notification'
import hmr from '@core/utils/hmr'

const
  styles =  {
    container: {
      minHeight: '100vh',
    },
    content: {
      position: 'relative',
      flexGrow: 1,
      backgroundColor: '#fff',
      maxHeight: '100vh',
    },
  },
  Progress = ({className}) =>
    <Grid
      container
      justify='center'
      alignItems='center'
      className={className}>
      <Zoom in={true}>
        <CircularProgress size={40} />
      </Zoom>
    </Grid>

Progress.propTypes = {
  className: PropTypes.string,
}

const App = ({ classes, auth }) =>
  <Observer render={() => (auth.status === null
    ? <Progress className={classes.container} />
    : <Grid
        container
        wrap='nowrap'
        className={classes.container}>
        <Drawer />
        <main className={classes.content}>
          <Routes />
          <Notification />
        </main>
      </Grid>
    )}
  />

App.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

export default hmr(module)(injectStore('auth')(withStyles(styles)(App)))
