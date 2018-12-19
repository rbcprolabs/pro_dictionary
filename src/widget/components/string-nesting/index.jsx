import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './style.scss'

const NestingString = ({
  className,
  strings = [],
  endStringsCount = 2,
  delimeter = ' ',
}) => {
  let endStrings = strings.splice(strings.length - endStringsCount, endStringsCount).join(delimeter)
  if (strings.length > 0)
    endStrings = '\u00A0' + delimeter + endStrings
  return (
    <div className={style.NestingString}>
      <p className={classNames(style.Wrapper, className)}>
        <span className={style.Ellips}>{strings.join(delimeter)}</span>
        { endStrings }
      </p>
    </div>
  )
}

NestingString.propTypes = {
  className: PropTypes.string,
  strings: PropTypes.arrayOf(PropTypes.string).isRequired,
  endStringsCount: PropTypes.number,
  delimeter: PropTypes.string,
}

export default NestingString
