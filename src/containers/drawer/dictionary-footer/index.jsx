import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import PowerSettings from '@material-ui/icons/PowerSettingsNew'
import Slide from '@material-ui/core/Slide'
import withStyles from '@material-ui/core/styles/withStyles'

const
  styles = (theme) => ({
    container: {
      position: 'absolute',
      bottom: 0,
      padding: theme.spacing.unit * 3,
    },
  }),
  handleLogout = (routing, auth) => (_event) => auth.signOut() && routing.push('/login')

const DictionaryFooter = ({ classes, routing, auth }) =>
  <Grid
    container
    justify='flex-end'
    alignItems='center'
    className={classes.container}>
    <Slide direction='up' in={true} timeout={400} mountOnEnter unmountOnExit>
      <IconButton
        onClick={handleLogout(routing, auth)}
        color='secondary'>
        <PowerSettings />
      </IconButton>
    </Slide>
  </Grid>

DictionaryFooter.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectStore('routing')(injectStore('auth')(observer(withStyles(styles)(DictionaryFooter))))
