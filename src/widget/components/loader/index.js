import React from 'react'
import PropTypes from 'prop-types'
import Circles from './circles'
import CubeGrid from './cube-grid'

const Loader = ({ type = 'circles', ...props }) => type === 'circles'
  ? <Circles {...props} />
  : <CubeGrid {...props} />

Loader.propTypes = {
  type: PropTypes.oneOf([
    'circles',
    'cube-grid',
  ]),
}

export default Loader
