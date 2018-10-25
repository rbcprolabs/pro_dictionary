import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import Logo from 'assets/images/logo.svg'

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
          <Slide direction='down' in={true} timeout={600} mountOnEnter unmountOnExit>
            <img src={Logo} />
          </Slide>
        </Grid>
      </Grid>
      <Grid item>
        <Slide direction='up' in={true} timeout={600} mountOnEnter unmountOnExit>
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
      <Typography
        variant='subtitle1'
        align='center'
        color='textSecondary'>
        v {appVersion}
      </Typography>
    </Grid>
  </Grid>

export default withStyles(styles)(Main)
