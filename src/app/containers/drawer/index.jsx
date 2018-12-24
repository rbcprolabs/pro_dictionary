import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer, inject as injectStore } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import DrawerHeader from './header'
import DrawerFooter from './footer'
import DictionaryList from './dictionary/list'
import DictionaryAdd from './dictionary/add'
import DictionaryEdit from './dictionary/edit'
import Main from './main'
import Drawer from '@material-ui/core/Drawer'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { darkTheme } from '@app/theme'

const
  styles = (theme) => ({
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
  }),
  paperProps = { elevation: 2 }

@withStyles(styles)
@withWidth()
@injectStore((stores) => ({
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
    fragment: 'list',
    openDrawer: false,
    size: 'small',
    editId: null,
  }

  openFragment = (fragment, editId = null) => () => {
    const { __drawerSize__: size } = this.getFragmentByName(fragment).type
    this.setState({ fragment, size, editId })
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this._sizes[prevState.size] < this._sizes[this.state.size] && this.state.openDrawer !== true)
      this.state.openDrawer = true // eslint-disable-line react/no-direct-mutation-state
    else if (this._sizes[prevState.size] > this._sizes[this.state.size] && this.state.openDrawer !== false)
      this.state.openDrawer = false // eslint-disable-line react/no-direct-mutation-state
  }

  renderContent() {
    return (
      <>
        <DrawerHeader />
          {this.getFragmentByName(this.state.fragment, this.state.editId)}
        <DrawerFooter />
      </>
    )
  }

  render() {
    const
      { classes, authStatus, width } = this.props,
      { size, openDrawer } = this.state,
      widthUpSm = isWidthUp('sm', width)

    return (
      <Drawer
        variant={widthUpSm && size !== 'large' ? 'permanent' : 'temporary'}
        classes={{
          paper: classNames(
            classes.drawerPaper,
            classes[`drawer-${size}`],
            classes[openDrawer ? 'open' : 'close'],
          ),
        }}
        PaperProps={paperProps}
        open={widthUpSm && size === 'large'}
        anchor={'left'}>
        <MuiThemeProvider theme={darkTheme}>
          {authStatus
            ? this.renderContent()
            : this.getFragmentByName('main')
          }
        </MuiThemeProvider>
      </Drawer>
    )
  }

  getFragmentByName(fragmentName, ...args) {
    return this._fragments[fragmentName](...args)
  }

  _fragments = {
    list: () => <DictionaryList
      onCreateClick={this.openFragment('add')}
      onEditClick={(id) => this.openFragment('edit', id)} />,
    add: () => <DictionaryAdd onBackClick={this.openFragment('list')} />,
    edit: (id) => <DictionaryEdit id={id} onBackClick={this.openFragment('list')} />,
    main: () => <Main />,
  }
}
