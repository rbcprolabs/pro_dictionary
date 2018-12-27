import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/styles/withStyles'

const styles = (theme) => ({
  root: {
    maxWidth: '100%',
  },
  wrapper: {
    whiteSpace: 'nowrap',
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
    margin: 0,
  },
  ellips: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  highlight: {
    color: theme.palette.secondary.main,
  },
})

const NestingString = ({
  classes,
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
    endStrings = endStrings.replace(
      new RegExp(highlight, 'gi'),
      `<span class="${classes.highlight}">${highlight}</span>`,
    )
  return (
    <div className={classes.root}>
      <p className={classNames(classes.wrapper, className)}>
        <span className={classes.ellips}>{strings.join(delimeter)}</span>
        <span dangerouslySetInnerHTML={{ __html: endStrings }} />
      </p>
    </div>
  )
}

NestingString.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  strings: PropTypes.arrayOf(PropTypes.string).isRequired,
  endStringsCount: PropTypes.number,
  delimeter: PropTypes.string,
  highlight: PropTypes.string,
}

export default withStyles(styles)(NestingString)
