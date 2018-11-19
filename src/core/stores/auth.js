import { observable, action } from 'mobx'
import { Auth } from 'aws-amplify'

export default class AuthStore {
  @observable status = null
  @observable loading = false

  constructor() {
    this.checkIsAuth()
  }

  @action
  async checkIsAuth() {
    this.loading = true
    try {
      await Auth.currentSession();
      this.status = true
    } catch (error) {
      (error !== 'No current user') && console.error(error) // eslint-disable-line no-console
      this.status = false
    } finally {
      this.loading = false
    }
    return this.status
  }

  @action
  async signIn(login, password) {
    this.loading = true
    try {
      await Auth.signIn(login, password);
      this.status = true
    } catch (error) {
      console.error(error.message) // eslint-disable-line no-console
      throw error
    } finally {
      this.loading = false
    }
    return this.status
  }

  @action
  async signOut() {
    this.loading = true
    try {
      await Auth.signOut();
      this.status = false
    } catch (e) {
      console.error(e.message) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return this.status
  }
}
