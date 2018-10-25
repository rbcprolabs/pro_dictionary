import { action, observable } from 'mobx'
import { API } from 'aws-amplify'

export default class Dictionary {
  lastItem = 0
  limit = 5

  @observable items = []
  @observable loading = false

  @action
  async post(body) {
    this.loading = true
    let result = null
    try {
      result = await API.post('dictionary', '/dictionary/', { body })
      this.items.push(result)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  async getAll(lastItem = this.lastItem, limit = this.limit) {
    this.loading = true
    let result = null
    try {
      result = await API.get('dictionary', `/dictionary?from=${lastItem}&limit=${limit}`)
      this.lastItem += this.limit
      this.items.push(...result)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  async get(id) {
    this.loading = true
    let result = null
    try {
      result = await API.get('dictionary', `/dictionary/${id}`)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  async update(id, body) {
    this.loading = true
    let result = null
    try {
      result = await API.put('dictionary', `/dictionary/${id}`, { body })
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  async delete(id) {
    this.loading = true
    let result = null
    try {
      result = await API.del('dictionary', `/dictionary/${id}`)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }
}
