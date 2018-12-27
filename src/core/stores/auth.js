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
      (error !== 'No current user') && console.error(error)
      this.status = false
    } finally {
      this.loading = false
    }
    return this.status
  }

  @action
  async signIn(email, password) {
    this.loading = true
    try {
      await Auth.signIn(email, password);
      this.status = true
    } catch (error) {
      console.error(error)
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
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return this.status
  }

  @action
  async forgotPassword(email) {
    this.loading = true
    let result = null
    try {
      result = await Auth.forgotPassword(email)
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  async forgotPasswordSubmit(email, code, newPassword) {
    this.loading = true
    let result = null
    try {
      result = await Auth.forgotPasswordSubmit(email, code, newPassword)
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.loading = false
    }
    return result
  }
}
