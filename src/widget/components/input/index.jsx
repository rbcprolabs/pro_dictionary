import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './style.scss'

const Input = ({
  before: Before,
  after: After,
  active = false,
  classes = {},
  className,
  ...props
}) =>
  <div className={classNames(style.InputContainer, className, classes.root, {
    [style.Active]: active,
  })}>
    { Before && <Before active={active} />}
    <input {...props} className={classes.input} />
    { After && <After active={active} />}
  </div>

Input.propTypes = {
  before: PropTypes.func,
  after: PropTypes.func,
  active: PropTypes.bool,
  classes: PropTypes.shape({
    root: PropTypes.string,
    input: PropTypes.string,
  }),
}

export default Input
