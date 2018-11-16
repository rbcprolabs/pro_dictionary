import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './style.scss'

const Input = ({
  icon: Icon,
  fullWidth,
  classes = {},
  className,
  ...props
}) =>
  <div className={classNames(style.InputContainer, className, classes.root)}>
    { Icon && <Icon className={classes.icon} /> }
    <input {...props} className={classes.input} />
  </div>

Input.propTypes = {
  icon: PropTypes.func,
  classes: PropTypes.shape({
    root: PropTypes.string,
    icon: PropTypes.string,
    input: PropTypes.string,
  }),
}

export default Input
