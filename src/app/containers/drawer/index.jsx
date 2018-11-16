import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer, inject as injectStore } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import DrawerHeader from './header'
import DrawerFooter from './footer'
import DictionaryList from './dictionary-list'
import DictionaryAdd from './dictionary-add'
import Main from './main'
import Drawer from '@material-ui/core/Drawer'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { darkTheme } from '@app/theme'

const styles = (theme) => ({
  drawerPaper: {
    overflow: 'hidden',
    backgroundColor: theme.color.dark,
  },
  ['drawer-small']: {
    width: theme.drawerWidth.small,
    [theme.breakpoints.up('sm')]: {
      position: 'relative',
    },
  },
  ['drawer-medium']: {
    width: theme.drawerWidth.medium,
    [theme.breakpoints.up('sm')]: {
      position: 'relative',
    },
  },
  ['drawer-large']: {
    width: theme.drawerWidth.large,
    height: '100%',
  },
  open: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  close: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }
})

@withStyles(styles)
@withWidth()
@injectStore(stores => ({
  authStatus: stores.auth.status,
}))
@observer
export default class AppDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    authStatus: PropTypes.bool,
    width: PropTypes.string.isRequired,
  }

  _sizes = {
    small: 0,
    medium: 1,
    large: 2,
  }

  state = {
    frame: 'list',
    openDrawer: false,
    size: 'small',
  }

  toggleDrawerSize = (size, frame) => () => this.setState({ size, frame })

  componentDidUpdate(_prevProps, prevState, _snapshot) {
    if (this._sizes[prevState.size] < this._sizes[this.props.size] && this.state.openDrawer !== true)
      this.state.openDrawer = true
    else if (this._sizes[prevState.size] > this._sizes[this.props.size] && this.state.openDrawer !== false)
      this.state.openDrawer = false
  }

  render() {
    const
      {
        classes,
        authStatus,
        width,
      } = this.props,
      {
        size,
        openDrawer,
        frame,
      } = this.state

    return (
      <Drawer
        variant={isWidthUp('sm', width) && size !== 'large' ? 'permanent' : 'temporary'}
        classes={{
          paper: classNames(
            classes.drawerPaper,
            classes[`drawer-${size}`],
            classes[openDrawer ? 'open' : 'close'],
          ),
        }}
        PaperProps={{
          elevation: 2,
        }}
        open={isWidthUp('sm', width) && size === 'large'}
        anchor={'left'}>
        <MuiThemeProvider theme={darkTheme}>
          {
            authStatus
              ? <>
                  <DrawerHeader />
                  {this.getFrameByName(frame)}
                  <DrawerFooter />
                </>
              : this.getFrameByName('main')
          }
        </MuiThemeProvider>
      </Drawer>
    )
  }

  getFrameByName = (frameName) => this._frames[frameName]

  _frames = {
    list: <DictionaryList onCreateClick={this.toggleDrawerSize('medium', 'add')} />,
    add: <DictionaryAdd onBackClick={this.toggleDrawerSize('small', 'list')} />,
    main: <Main />,
  }
}
