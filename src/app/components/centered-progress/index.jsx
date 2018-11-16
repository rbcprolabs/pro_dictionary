import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import CenteredContainer from '@app/components/centered-container'

const CenteredProgress = ({className, fullHeight}) =>
  <CenteredContainer fullHeight={fullHeight} className={className}>
    <CircularProgress />
  </CenteredContainer>

CenteredProgress.propTypes = {
  className: PropTypes.string,
  fullHeight: PropTypes.bool,
}

export default CenteredProgress
