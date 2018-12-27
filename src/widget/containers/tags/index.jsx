import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Tag from '@widget/components/tag'
import style from './style.scss'
import NestingString from '@widget/components/nesting-string'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

function removeTag(fullTerm) {
  return () => this.removeTag(fullTerm)
}

const Tags = ({extension, after: After}) =>
  <ReactCSSTransitionGroup
    component='div'
    className={style.TagContainer}
    transitionName='fade-in-left'
    transitionEnterTimeout={500}
    transitionLeaveTimeout={300}>
    {extension.tags.map((fullTerm) => {
      const
        fulTermSplitted = fullTerm.split('/'),
        fulTermWODictionaryName = fulTermSplitted.slice(1, fulTermSplitted.length)

      return (
        <Tag key={fullTerm} removable onRemoveClick={extension::removeTag(fullTerm)}>
          <NestingString strings={fulTermWODictionaryName} delimeter=' ➜ ' />
        </Tag>
      )
    })}
    <div>
      {After}
    </div>
  </ReactCSSTransitionGroup>

Tags.propTypes = {
  extension: PropTypes.object.isRequired,
  // onAdd: PropTypes.func.isRequired,
  after: PropTypes.node.isRequired,
}

export default injectStore('extension')(observer(Tags))
