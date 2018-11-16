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
      (error !== 'No current user') && console.error(e)
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
      console.log('Logged in')
    } catch (error) {
      console.error(error.message)
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
      console.log('Logged out')
    } catch (e) {
      console.error(e.message);
    } finally {
      this.loading = false
    }
    return this.status
  }
}
