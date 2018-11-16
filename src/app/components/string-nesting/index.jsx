import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  container: {
    maxWidth: '100%',
  },
  root: {
    whiteSpace: 'nowrap',
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
  },
  ellips: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}

const NestingString = ({
  classes,
  className,
  strings = [],
  endStringsCount = 2,
  delimeter = ' ',
}) => {
  const endStrings = strings.splice(strings.length - endStringsCount, endStringsCount)
  return (
    <div className={classes.container}>
      <p className={classNames(classes.root, className)}>
        <span className={classes.ellips}>{strings.join(delimeter)}</span>
        {delimeter + endStrings.join(delimeter)}
      </p>
    </div>
  )
}

NestingString.propTypes = {
  strings: PropTypes.arrayOf(PropTypes.string).isRequired,
  endStringsCount: PropTypes.number,
  delimeter: PropTypes.string,
}

export default withStyles(styles)(NestingString)
