import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import withStyles from '@material-ui/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import green from '@material-ui/core/colors/green'

const styles = {
  button: {
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
  },
}

@withStyles(styles)
export default class LoadingFab extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,
    children: PropTypes.node,
  }

  handleButtonClick(event) {
    if (this.props.loading) return
    else if (typeof this.props.onClick === 'function') this.props.onClick(event)
  }

  render() {
    const {
      classes,
      disabled,
      children,
      loading = false,
      success = false,
      ...props
    } = this.props

    return (
      <Fab
        className={classNames(classes.button, {
          [classes.buttonSuccess]: success,
        })}
        disabled={loading || disabled}
        onClick={::this.handleButtonClick}
        {...props}>
        {children}
        {loading && <CircularProgress size={56} className={classes.buttonProgress} />}
      </Fab>
    )
  }
}
