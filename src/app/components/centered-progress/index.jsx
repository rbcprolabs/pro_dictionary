import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grow from '@material-ui/core/Grow'
import CenteredContainer from '@app/components/centered-container'

const CenteredProgress = ({className, fullHeight, ...props}) =>
  <CenteredContainer fullHeight={fullHeight} className={className}>
    <Grow in timeout={400}>
      <CircularProgress {...props}/>
    </Grow>
  </CenteredContainer>

CenteredProgress.propTypes = {
  className: PropTypes.string,
  fullHeight: PropTypes.bool,
}

export default CenteredProgress
