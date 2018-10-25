import React from 'react'
import { observer, inject as injectStore } from 'mobx-react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from 'components/snackbar-content'

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
        message,
        variant,
        clear,
      },
    } = this.props
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.props.notification.open}
        autoHideDuration={4000}
        onClose={this.handleClose}>
        <SnackbarContent
          onClose={this.handleClose}
          variant={variant}
          message={message}/>
      </Snackbar>
    )
  }
}
