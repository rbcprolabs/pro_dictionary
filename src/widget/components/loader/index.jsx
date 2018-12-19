import React from 'react'
import PropTypes from 'prop-types'
import Circle from './circle'
import Circles from './circles'
import CubeGrid from './cube-grid'

const Loaders = (props) => ({
  'circle': <Circle {...props} />,
  'circles': <Circles {...props} />,
  'cube-grid': <CubeGrid {...props} />,
})

const Loader = ({ type = 'circle', ...props }) => Loaders(props)[type]

Loader.propTypes = {
  type: PropTypes.oneOf([
    'circle',
    'circles',
    'cube-grid',
  ]),
}

export default Loader
