import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './style.scss'

const Checkbox = ({
  className,
  children,
  ...props,
}) => {
  const id = Math.random().toString(36)
  return (
    <div className={classNames(style.Checkbox, className)}>
      <input type='checkbox' id={id} {...props}/>
      <label htmlFor={id}>{children}</label>
    </div>
  )
}

Checkbox.propTypes = {
  className: PropTypes.string,
}

export default Checkbox
