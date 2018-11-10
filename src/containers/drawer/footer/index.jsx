import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject as injectStore } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PowerSettings from '@material-ui/icons/PowerSettingsNew'
import Slide from '@material-ui/core/Slide'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = (theme) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    padding: theme.spacing.unit * 3,
  },
})

@withStyles(styles)
@injectStore('auth')
export default class DrawerFooter extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
  }

  state = {
    deferredPrompt: null,
  }

  beforeInstallPrompt = (event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault()
    // Stash the event so it can be triggered later.
    this.setState({
      deferredPrompt: event,
    })
  }

  componentDidMount() {
    window.addEventListener('beforeinstallprompt', this.beforeInstallPrompt)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeinstallprompt', this.beforeInstallPrompt)
  }

  handleLogout = () => this.props.auth.signOut()

  addToHomeScreen = () => {
    if (!this.state.deferredPrompt) return
    // Show the prompt
    this.state.deferredPrompt.prompt()

    this.setState({
      deferredPrompt: null,
    })
  }

  render() {
    return (
      <Grid
        container
        justify='flex-end'
        alignItems='center'
        wrap='nowrap'
        className={this.props.classes.container}>
        <Button
          onClick={this.addToHomeScreen}
          color='secondary'
          disabled={!this.state.deferredPrompt}>
          Добавить на главный экран
      </Button>
        <Slide direction='up' in={true} timeout={400} mountOnEnter unmountOnExit>
          <IconButton
            onClick={this.handleLogout}
            color='secondary'>
            <PowerSettings />
          </IconButton>
        </Slide>
      </Grid>
    )
  }
}
