import React from 'react'
import { observer, inject as injectStore } from 'mobx-react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@app/components/snackbar-content'

@injectStore('notification')
@observer
export default class Notification extends React.Component {
  handleClose = (_event, reason) => {
    if (reason === 'clickaway') return

    this.props.notification.close()
  }

  render() {
    const {
      notification: {
        detail,
      },
    } = this.props
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={detail !== null}
        onClose={this.handleClose}>
        { detail &&
          <SnackbarContent
            onClose={this.handleClose}
            variant={detail.variant || 'info'}
            message={detail.message || ''}/>
        }
      </Snackbar>
    )
  }
}
