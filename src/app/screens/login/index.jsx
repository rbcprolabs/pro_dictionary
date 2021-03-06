import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LoadingButton from '@app/components/loading-button'
import Link from 'react-router-dom/Link'
import Grow from '@material-ui/core/Grow'
import withStyles from '@material-ui/styles/withStyles'
import Notification from '@core/stores/notification'

const styles = (theme) => ({
  form: {
    height: '100%',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  clearTextTransform: {
    textTransform: 'none',
  },
})

@withStyles(styles)
@injectStore((stores) => ({
  auth: stores.auth,
  notification: stores.notification,
}))
@observer
export default class Login extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
  }

  loginInput = React.createRef()
  passwordInput = React.createRef()

  state = {
    login: '',
    password: '',
    fromWidget: false,
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search)
    if (params.has('widget')) {
      // Default auth status (if window closed before login)
      window.returnValue = false
      // Say react about page started in window
      this.setState({ fromWidget: true })
    }

    setTimeout(() => {
      if (this.hasAutofill) this.forceUpdate()
    }, 100)
  }

  handleChange = ({ target }) => this.setState({
    [target.name]: target.value,
  })

  // detect autofill
  get hasAutofill() {
    return this.loginInput.current
      && this.passwordInput
      && this.loginInput.current.matches(':-webkit-autofill')
      && this.passwordInput.current.matches(':-webkit-autofill')
  }

  get validateForm() {
    if (this.hasAutofill) return true

    return this.state.login.length > 0 && this.state.password.length > 0
  }

  async handleSubmit(event) {
    event.preventDefault()

    try {
      await this.props.auth.signIn(
        this.state.login,
        this.state.password,
      )
      // If login from widget success close login window
      if (this.state.fromWidget) {
        window.returnValue = true
        window.close()
      }
    } catch ({message}) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message: message.replace(/Incorrect username or password/, 'Неправильный email или пароль'),
      })
    }
  }

  render() {
    const { classes, auth } = this.props

    return (
      <Grid
        container
        justify='center'
        alignItems='center'
        component='form'
        onSubmit={::this.handleSubmit}
        className={classes.form}>
        <Grid item xs={10} sm={8} md={4} lg={3} xl={2}>
          <Grid
            container
            spacing={40}
            direction='column'>
            <Grid item>
              <Grow in timeout={800}>
                <TextField
                  autoFocus
                  inputRef={this.loginInput}
                  name='login'
                  label='Логин'
                  className={classes.textField}
                  value={this.state.login}
                  onChange={this.handleChange}
                  autoComplete='username'
                  type='text' />
              </Grow>
            </Grid>
            <Grid item>
              <Grow in timeout={900}>
                <TextField
                  inputRef={this.passwordInput}
                  name='password'
                  label='Пароль'
                  className={classes.textField}
                  value={this.state.password}
                  onChange={this.handleChange}
                  autoComplete='current-password'
                  type='password' />
              </Grow>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={24}
                alignItems='center'
                direction='column'>
                <Grid item>
                  <Grow in timeout={1000}>
                    <LoadingButton
                      loading={auth.loading}
                      type='submit'
                      disabled={!this.validateForm}
                      variant='contained'
                      color='secondary'>
                      Войти
                    </LoadingButton>
                  </Grow>
                </Grid>
                <Grid item>
                  <Grow in timeout={1100}>
                    <Button
                      color='secondary'
                      disabled={auth.loading}
                      component={Link}
                      to={this.state.login.length === 0
                        ? '/forgot-password'
                        : `/forgot-password?email=${this.state.login}`}
                      className={classes.clearTextTransform}>
                      Забыл пароль?
                    </Button>
                  </Grow>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
