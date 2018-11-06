import React from 'react'
import { Observer, inject as injectStore } from 'mobx-react'
import Routes from '../routes'
import Drawer from 'containers/drawer'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Zoom from '@material-ui/core/Zoom'
import CircularProgress from '@material-ui/core/CircularProgress'
import Notification from 'containers/notification'

const
  styles = theme => ({
    container: {
      minHeight: '100vh',
    },
    content: {
      position: 'relative',
      flexGrow: 1,
      backgroundColor: '#fff',
      maxHeight: '100vh',
    },
  }),
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

export default injectStore('auth')(withStyles(styles)(App))
