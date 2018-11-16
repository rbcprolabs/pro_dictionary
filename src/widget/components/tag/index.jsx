import React from 'react'
import PropTypes from 'prop-types'
import CloseIcon from '@widget/assets/icons/remove.svg'
import AddIcon from '@widget/assets/icons/add.svg'
import style from './style.scss'

const checkCallback = (callback) => typeof callback === 'function'
  ? callback
  : null

const Tag = ({
  children,
  onClick,
  removable,
  onRemoveClick,
  add,
  onAddClick,
}) =>
  <div className={style.Tag}>
    {
      !add && <label onClick={checkCallback(onClick)}>{children}</label>
    }
    {
      !add && removable &&
      <div className={style.CloseIcon} onClick={checkCallback(onRemoveClick)}>
        <CloseIcon />
      </div>
      || add && !removable &&
      <div className={style.AddIcon} onClick={checkCallback(onAddClick)}>
        <AddIcon />
      </div>
    }
  </div>

Tag.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  removable: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  add: PropTypes.bool,
  onAddClick: PropTypes.func,
}

export default Tag
