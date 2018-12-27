import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore  } from 'mobx-react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LoadingButton from '@app/components/loading-button'
import Link from 'react-router-dom/Link'
import Grow from '@material-ui/core/Grow'
import withStyles from '@material-ui/styles/withStyles'
import withRouter from 'react-router/withRouter'
import Notification from '@core/stores/notification'

const styles = (theme)=> ({
  form: {
    height: '100%',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
})

@withRouter
@withStyles(styles)
@injectStore(({
  auth,
  notification,
}) => ({
  auth,
  notification,
}))
@observer
export default class Forgotemail extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
  }

  state = {
    email: '',
    code: '',
    password: '',
    step: 0,
  }

  componentDidMount() {
    const email = new URLSearchParams(this.props.location.search).get('email')
    if (email !== null) this.setState({ email })
  }

  get validateForm() {
    return this.state.email.length > 0
  }

  handleChange = ({target}) => this.setState({
    [target.name]: target.value,
  })

  async handleSubmit(event) {
    event.preventDefault()

    try {
      if (this.state.step === 0) {
        await this.props.auth.forgotPassword(
          this.state.email,
        )
        this.props.notification.notify({
          variant: Notification.SUCCESS,
          message: 'Код подтверждения отправлен на почту',
        })
        this.setState({ step: 1 })
      } else if (this.state.step === 1) {
        await this.props.auth.forgotPasswordSubmit(
          this.state.email,
          this.state.code,
          this.state.password,
        )
        this.props.notification.notify({
          variant: Notification.SUCCESS,
          message: 'Пароль успешно восстановлен',
        })
        this.props.history.push('login')
      }
    } catch ({ message }) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message,
      })
    }
  }

  renderViewByStep() {
    const { classes } = this.props

    return (this.state.step === 0)
      ? <Grid item>
          <Grow in timeout={600}>
            <TextField
              autoFocus
              name='email'
              label='Электронная почта'
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
              type='email'/>
          </Grow>
        </Grid>
      : <>
          <Grid item>
            <Grow in timeout={600}>
            <TextField
              autoFocus
              name='code'
              label='Код подтверждения'
              className={classes.textField}
              value={this.state.code}
              onChange={this.handleChange}
              type='text'/>
            </Grow>
          </Grid>
          <Grid item>
            <Grow in timeout={800}>
            <TextField
              name='password'
              label='Новый пароль'
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
              type='text'/>
            </Grow>
          </Grid>
        </>
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
            {this.renderViewByStep()}
            <Grid item>
              <Grid
                container
                spacing={40}
                justify='center'>
                <Grid item xs={4}>
                  <Grow in timeout={900}>
                    <Button color='secondary' component={Link} to='/login'>
                      Назад
                    </Button>
                  </Grow>
                </Grid>
                <Grid item xs={4}>
                  <Grow in timeout={900}>
                    <LoadingButton
                      loading={auth.loading}
                      type='submit'
                      disabled={!this.validateForm}
                      variant='contained'
                      color='secondary'>
                      Далее
                    </LoadingButton>
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
