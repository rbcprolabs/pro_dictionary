import { observable, action } from 'mobx'

export default class Notification {
  @observable message = ''
  @observable variant = 'info'
  @observable open = false

  @action
  info = (message) => {
    this.message = message
    this.variant = 'info'
    this.open = true
  }

  @action
  error = (message) => {
    this.message = message
    this.variant = 'error'
    this.open = true
  }

  @action
  success = (message) => {
    this.message = message
    this.variant = 'success'
    this.open = true
  }

  @action
  warning = (message) => {
    this.message = message
    this.variant = 'warning'
    this.open = true
  }

  @action
  close = () => {
    this.message = ''
    this.variant = 'info'
    this.open = false
  }
}
