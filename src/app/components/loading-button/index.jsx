import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import withStyles from '@material-ui/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import green from '@material-ui/core/colors/green'
import Button from '@material-ui/core/Button'

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
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}

@withStyles(styles)
export default class LoadingButton extends React.Component {
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
      <Button
        className={classNames(classes.button, {
          [classes.buttonSuccess]: success,
        })}
        disabled={loading || disabled}
        onClick={::this.handleButtonClick}
        {...props}>
        {children}
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Button>
    )
  }
}
