import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './style.scss'

const Circles = ({
  variant = 'dark',
  className,
  ...props
}) =>
  <div className={classNames(style.Loader, style[variant], className)} {...props}>
    <div/>
    <div/>
    <div/>
    <div/>
  </div>

Circles.propTypes = {
  variant: PropTypes.oneOf([
    'dark',
    'light',
  ])
}

export default Circles
