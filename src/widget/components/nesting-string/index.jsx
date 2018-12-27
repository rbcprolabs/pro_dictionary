import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './style.scss'

const NestingString = ({
  className,
  strings = [],
  endStringsCount = 2,
  delimeter = ' ',
  highlight,
}) => {
  let endStrings = strings.splice(strings.length - endStringsCount, endStringsCount).join(delimeter)
  if (strings.length > 0)
    endStrings = '\u00A0' + delimeter + endStrings
  if (highlight)
    endStrings = endStrings.replace(new RegExp(highlight, 'gi'), `<span class="${style.highlight}">${highlight}</span>`)
  return (
    <div className={style.NestingString}>
      <p className={classNames(style.Wrapper, className)}>
        <span className={style.Ellips}>{strings.join(delimeter)}</span>
        <span dangerouslySetInnerHTML={{ __html: endStrings }} />
      </p>
    </div>
  )
}

NestingString.propTypes = {
  className: PropTypes.string,
  strings: PropTypes.arrayOf(PropTypes.string).isRequired,
  endStringsCount: PropTypes.number,
  delimeter: PropTypes.string,
  highlight: PropTypes.string,
}

export default NestingString
