import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Tag from '@widget/components/tag'
import style from './style.scss'

function removeTag(fullTerm) {
  return () => this.removeTag(fullTerm)
}

const Tags = ({extension, onAdd}) =>
  <div className={style.TagContainer}>
    {extension.tags.map((fullTerm) =>
      <Tag key={fullTerm} removable onRemoveClick={extension::removeTag(fullTerm)}>{fullTerm}</Tag>
    )}
    <Tag add onAddClick={onAdd} />
  </div>

Tags.propTypes = {
  extension: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default injectStore('extension')(observer(Tags))
