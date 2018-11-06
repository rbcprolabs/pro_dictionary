import React, { Component } from 'react'
import { observer, inject as injectStore } from 'mobx-react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LoadingButton from 'components/loading-button'
import Link from 'react-router-dom/Link'
import Grow from '@material-ui/core/Grow'
import withStyles from '@material-ui/core/styles/withStyles'
import Notification from 'stores/notification'

const styles = (theme) => ({
  form: {
    height: '100%',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  forgotPassword: {
    textTransform: 'none',
  },
})

@withStyles(styles)
@injectStore('auth')
@injectStore('notification')
@observer
export default class Login extends Component {
  state = {
    login: '',
    password: '',
  }

  validateForm = () => this.state.login.length > 0 && this.state.password.length > 0

  handleChange = ({ target }) => this.setState({
    [target.id]: target.value,
  })

  handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await this.props.auth.signIn(
        this.state.login,
        this.state.password,
      )
    } catch ({message}) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message,
      })
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    this.props.auth.loading !== nextProps.auth.loading
    || this.state.login !== nextState.login
    || this.state.password !== nextState.password

  render() {
    const {
      classes,
      auth: {
        loading = false,
      },
    } = this.props

    return (
      <Grid
        container
        justify='center'
        alignItems='center'
        component='form'
        onSubmit={this.handleSubmit}
        className={classes.form}>
        <Grid
          item
          xs={10}
          sm={8}
          md={4}
          lg={3}
          xl={2}>
          <Grid
            container
            spacing={40}
            direction='column'>
            <Grid item>
              <Grow in={true} timeout={600}>
                <TextField
                  autoFocus
                  id='login'
                  label='Логин'
                  className={classes.textField}
                  value={this.state.login}
                  onChange={this.handleChange}
                  type='text' />
              </Grow>
            </Grid>
            <Grid item>
              <Grow in={true} timeout={700}>
                <TextField
                  id='password'
                  label='Пароль'
                  className={classes.textField}
                  value={this.state.password}
                  onChange={this.handleChange}
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
                  <Grow in={true} timeout={800}>
                    <LoadingButton
                      loading={loading}
                      type='submit'
                      disabled={!this.validateForm()}
                      variant='contained'
                      color='secondary'>
                      Войти
                    </LoadingButton>
                  </Grow>
                </Grid>
                <Grid item>
                  <Grow in={true} timeout={900}>
                    <Button
                      color='secondary'
                      disabled={loading}
                      component={Link}
                      to='/forgot-password'
                      className={classes.forgotPassword}>
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
