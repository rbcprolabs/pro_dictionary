import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './style.scss'

const CenteredContainer = ({ className, children }) =>
  <div className={classNames(styles.CenteredContainer, className)}>
    {children}
  </div>

CenteredContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export default CenteredContainer
