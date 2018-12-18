import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './style.scss'

const Button = ({
  children,
  className,
  type = 'primary',
  ...props,
}) =>
  <button className={classNames(style.Button, style[type], className)} {...props}>
    {children}
  </button>

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf([
    'primary',
    'secondary',
    'flat',
  ]),
}

export default Button
