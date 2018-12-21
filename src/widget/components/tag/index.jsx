import React from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as CloseIcon } from '@widget/assets/icons/remove.svg'
import style from './style.scss'

const Tag = ({
  children,
  onClick,
  removable,
  onRemoveClick,
  ...props,
}) =>
  <div className={style.Tag} {...props}>
    <label onClick={onClick}>{children}</label>
    {removable &&
      <div className={style.CloseIcon} onClick={onRemoveClick}>
        <CloseIcon />
      </div>}
  </div>

Tag.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  removable: PropTypes.bool,
  onRemoveClick: PropTypes.func,
}

export default Tag
