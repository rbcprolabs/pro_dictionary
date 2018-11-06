import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'

const styles = (theme) => ({
  container: {
    position: 'relative',
    height: '100%',
  },
  root: {
    width: '100%',
    height: '100%',
    resize: 'none',
  },
  input: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
    resize: 'none',
    boxSizing: 'border-box',
  },
  inputContainer: {
    height: '100%',
  },
  bottomActions: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
  },
})

const FullSizeInput = ({
  classes,
  children,
  ...props,
}) =>
  <Grid
    container
    direction='column'
    wrap='nowrap'
    className={classes.container}>
    <Grid item className={classes.inputContainer}>
      <InputBase
        inputComponent='textarea'
        {...props}
        classes={{
          root: classes.root,
          input: classes.input,
        }}/>
    </Grid>
    <Grid item className={classes.bottomActions}>
      {children}
    </Grid>
  </Grid>

FullSizeInput.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
}

export default withStyles(styles)(FullSizeInput)
