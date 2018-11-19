import { observable, action } from 'mobx'

export default class Notification {
  static INFO = 'info'
  static SUCCESS = 'success'
  static WARNING = 'warning'
  static ERROR = 'error'

  static SHORT = 4000
  static LONG = 6000

  @observable detail = null

  timeoutCallback = null

  @action
  notify = ({
    message,
    variant = Notification.INFO,
    length = Notification.SHORT,
  }) => new Promise((resolve) => {
    let timeout
    this.detail = {
      variant,
      message,
    }
    this.timeoutCallback = () => {
      this.detail = null
      resolve()
      clearTimeout(timeout)
    }
    timeout = setTimeout(this.timeoutCallback, length)
  })

  @action
  close = () => this.timeoutCallback()
}
