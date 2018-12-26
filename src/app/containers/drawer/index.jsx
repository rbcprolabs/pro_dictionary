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
      borderRightColor: theme.color.dark,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
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
  }

  state = {
    fragment: 'list',
    size: 'small',
    editId: null,
  }

  openFragment = (fragment, editId = null) => () => {
    const { __drawerSize__: size } = this.getFragmentByName(fragment).type
    this.setState({ fragment, size, editId })
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
      { size } = this.state,
      widthUpSm = isWidthUp('sm', width)

    return (
      <MuiThemeProvider theme={darkTheme}>
        <Drawer
          variant={widthUpSm ? 'permanent' : 'temporary'}
          classes={{
            paper: classNames(
              classes.drawerPaper,
              classes[`drawer-${size}`],
            ),
          }}
          PaperProps={paperProps}
          anchor={'left'}>
          {authStatus
            ? this.renderContent()
            : this.getFragmentByName('main')
          }
        </Drawer>
      </MuiThemeProvider>
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
