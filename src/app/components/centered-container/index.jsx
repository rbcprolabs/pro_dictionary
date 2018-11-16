import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  fullHeight: {
    height: '100%',
  },
}

const CenteredContainer = ({ className, classes, children, fullHeight }) =>
  <Grid
    container
    alignItems='center'
    justify='center'
    className={classNames(className, {
      [classes.fullHeight]: fullHeight,
    })}>
    {children}
  </Grid>

CenteredContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  fullHeight: PropTypes.bool,
}

export default withStyles(styles)(CenteredContainer)
