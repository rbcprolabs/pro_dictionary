import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './style.scss'

const Button = ({
  children,
  className,
  variant = 'primary',
  ...props,
}) =>
  <button className={classNames(style.Button, style[variant], className)} {...props}>
    {children}
  </button>

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'flat',
  ]),
}

export default Button
