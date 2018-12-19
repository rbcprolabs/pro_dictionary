import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Tag from '@widget/components/tag'
import style from './style.scss'
import NestingString from '@widget/components/string-nesting'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

function removeTag(fullTerm) {
  return () => this.removeTag(fullTerm)
}

const Tags = ({extension, onAdd}) =>
  <ReactCSSTransitionGroup
    component='div'
    className={style.TagContainer}
    transitionName='fade-in-left'
    transitionEnterTimeout={500}
    transitionLeaveTimeout={300}>
    {extension.tags.map((fullTerm) =>
      <Tag key={fullTerm} removable onRemoveClick={extension::removeTag(fullTerm)}>
        <NestingString strings={fullTerm.split('/')} delimeter=' ➜ ' />
      </Tag>
    )}
    <Tag add onAddClick={onAdd} />
  </ReactCSSTransitionGroup>

Tags.propTypes = {
  extension: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default injectStore('extension')(observer(Tags))
