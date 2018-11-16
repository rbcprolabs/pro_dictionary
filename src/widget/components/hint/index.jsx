import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './style.scss'

const Hint = ({
  children,
  className,
  ...props,
}) =>
  <div className={classNames(style.Hint, className)} {...props}>
    {children}
  </div>

Hint.propTypes = {
  children: PropTypes.node,
}

export default Hint
