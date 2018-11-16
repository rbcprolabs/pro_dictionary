import { action, observable } from 'mobx'
import { API } from 'aws-amplify'

export default class Dictionary {
  lastKey = null
  limit = 100

  @observable items = []
  @observable loading = true

  @action
  async post(body) {
    this.loading = true
    let result = null
    try {
      result = await API.post('dictionary', '/dictionary/', { body })
      this.items.push(result)
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  async getAll(limit = this.limit) {
    this.loading = true
    let result = null
    try {
      result = await API.get('dictionary', `/dictionary?${this.lastKey ? `lastEvaluatedKey=${this.lastKey}&` : ''}limit=${limit}`)
      this.lastKey = result.lastEvaluatedKey || null
      this.items.push(...result.items)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }

  hasMore = () => this.lastKey !== null

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
  async getByName(name) {
    this.loading = true
    let result = null
    try {
      result = await API.get('dictionary', `/dictionaryByName/${name}`)
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
