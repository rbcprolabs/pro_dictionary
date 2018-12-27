import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import { ReactComponent as Logo } from '@app/assets/images/logo.svg'
import withDrawerSize from '@app/containers/drawer/withDraweSize'

const styles = (theme) => ({
  container: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
  },
  centeredContainer: {
    padding: theme.spacing.unit * 3,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 300,
  },
  appVersion: {
    position: 'absolute',
    bottom: theme.spacing.unit * 3,
  },
});

const Main = ({ classes }) =>
  <Grid
    container
    alignItems='center'
    className={classes.container}>
    <Grid
      container
      spacing={40}
      direction='column'
      className={classes.centeredContainer}>
      <Grid item>
        <Grid
          container
          justify='center'>
          <Slide direction='down' in timeout={600}>
            <Logo />
          </Slide>
        </Grid>
      </Grid>
      <Grid item>
        <Slide direction='up' in timeout={600}>
          <Typography
            variant='h6'
            align='center'
            color='textSecondary'
            className={classes.title}>
            Словари
          </Typography>
        </Slide>
      </Grid>
    </Grid>
    <Grid
      container
      justify='center'
      className={classes.appVersion}>
      <Slide direction='up' in timeout={800}>
        <Typography
          variant='subtitle1'
          align='center'
          color='textSecondary'>
          v {appVersion}
        </Typography>
      </Slide>
    </Grid>
  </Grid>

Main.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withDrawerSize('small')(withStyles(styles)(Main))
