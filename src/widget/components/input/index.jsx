import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import style from './style.scss'

const Input = ({
  before: Before,
  hideBefore = function(){},
  after: After,
  hideAfter = function(){},
  active = false,
  error = false,
  classes = {},
  className,
  actionsAnimationName = 'fade',
  ...props
}) =>
  <div className={classNames(style.InputContainer, className, classes.root, {
    [style.active]: active,
    [style.error]: error,
  })}>
    <ReactCSSTransitionGroup
      component='div'
      transitionName={actionsAnimationName}
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}>
      { Before && !hideBefore({active, error}) && <Before active={active} error={error} />}
    </ReactCSSTransitionGroup>
    <input {...props} className={classes.input} />
    <ReactCSSTransitionGroup
      component='div'
      transitionName={actionsAnimationName}
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}>
      { After && !hideAfter({active, error}) && <After active={active} error={error} />}
    </ReactCSSTransitionGroup>
  </div>

Input.propTypes = {
  before: PropTypes.func,
  hideBefore: PropTypes.func,
  after: PropTypes.func,
  hideAfter: PropTypes.func,
  active: PropTypes.bool,
  error: PropTypes.bool,
  actionsAnimationName: PropTypes.string,
  classes: PropTypes.shape({
    root: PropTypes.string,
    input: PropTypes.string,
  }),
}

export default Input
