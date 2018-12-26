import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@app/components/snackbar-content'

const Notification = ({ notification }) => {
  function handleClose(_event, reason) {
    if (reason === 'clickaway') return
    notification.close()
  }

  const { detail } = notification

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={detail !== null}
      onClose={handleClose}>
      {detail &&
        <SnackbarContent
          onClose={handleClose}
          variant={detail.variant || 'info'}
          message={detail.message || ''}/>
      }
    </Snackbar>
  )
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
}

export default injectStore('notification')(observer(Notification))
