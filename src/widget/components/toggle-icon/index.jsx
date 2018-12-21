import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './style.scss'

const ToggleIcon = ({
  active = false,
  activeIcon,
  inactiveIcon,
  className,
  ...props,
}) =>
  <div className={classNames(style.ToggleIcon, className, {
    [style.active]: active,
    [style.inactive]: !active,
  })} {...props}>
    {active
      ? activeIcon
      : inactiveIcon}
  </div>

ToggleIcon.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  activeIcon: PropTypes.node.isRequired,
  inactiveIcon: PropTypes.node.isRequired,
}

export default ToggleIcon
