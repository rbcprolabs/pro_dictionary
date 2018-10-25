import React, { Component } from 'react'
import { observer, inject as injectStore  } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  appBar: {
  },
  grow: {
    flexGrow: 1,
  },
});

@withStyles(styles)
@injectStore('auth')
@observer
export default class Header extends Component {
  handleLogout = (_event) => this.props.auth.signOut()

  render() {
    const {
      classes,
      auth,
    } = this.props

    return ( auth.status &&
      <AppBar
        position='absolute'
        className={classes.appBar}>
        <Toolbar>
          {/* <Typography variant='h6' color='inherit' noWrap className={classes.grow} />
          <IconButton
            onClick={this.handleLogout}
            color='inherit'>
            <PowerSettings />
          </IconButton> */}
        </Toolbar>
      </AppBar>
    )
  }
}
