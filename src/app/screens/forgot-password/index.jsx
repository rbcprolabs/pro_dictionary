import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore  } from 'mobx-react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LoadingButton from '@app/components/loading-button'
import Link from 'react-router-dom/Link'
import Grow from '@material-ui/core/Grow'
import withStyles from '@material-ui/core/styles/withStyles'

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

@withStyles(styles)
@injectStore('auth')
@observer
export default class ForgotPassword extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
  }

  state = {
    password: '',
  }

  validateForm = () => this.state.password.length > 0

  handleChange = ({target}) => this.setState({
    [target.id]: target.value,
  })

  handleSubmit = async (event) => {
    event.preventDefault()

    // await this.props.auth.signIn(
    //   this.state.login,
    //   this.state.password,
    // )
  }

  render() {
    const { classes, auth } = this.props

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
                  id='password'
                  label='Пароль'
                  className={classes.textField}
                  value={this.state.password}
                  onChange={this.handleChange}
                  type='password'/>
              </Grow>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={40}
                justify='center'>
                <Grid item xs={4}>
                  <Grow in={true} timeout={800}>
                    <Button color='secondary' component={Link} to='/login'>
                      Назад
                    </Button>
                  </Grow>
                </Grid>
                <Grid item xs={4}>
                  <Grow in={true} timeout={800}>
                    <LoadingButton
                      loading={auth.loading}
                      type='submit'
                      disabled={!this.validateForm()}
                      variant='contained'
                      color='secondary'>
                      Войти
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
