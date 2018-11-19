import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  container: {
    height: '100%',
  },
}

const NotFound = ({classes}) =>
  <Grid
    container
    alignItems='center'
    justify='center'
    className={classes.container}>
    <Grid
      item
      xs={10}
      sm={8}
      lg={6}>
      <Typography
        variant='h4'
        align='center'
        color='textSecondary'>
        Данного раздела на сайте нет или он находится в разработке
      </Typography>
    </Grid>
  </Grid>

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NotFound)
