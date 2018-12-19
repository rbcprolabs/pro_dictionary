import React from 'react'
import PropTypes from 'prop-types'
import Button from '@widget/components/button'
import Loader from '@widget/components/loader'

const LoadingButton = ({
  loading = false,
  children,
  disabled,
  ...props,
}) =>
  <Button {...props} disabled={disabled || loading}>
    {!loading
      ? children
      : <Loader type='circles' variant='light' />}
  </Button>

LoadingButton.propTypes = {
  loading: PropTypes.bool,
}

export default LoadingButton
