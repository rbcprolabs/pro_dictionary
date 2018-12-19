import { action, observable, computed } from 'mobx'
import { API } from 'aws-amplify'
import { isEmpty } from '@core/utils/hooks/object'
import { findByProperty } from '@core/utils/hooks/array'

export default class Dictionary {
  lastEvaluatedKey = null
  limit = 100

  @observable loading = true
  @observable _items = {}

  @computed
  get items () {
    return Object.values(this._items)
  }

  @action
  post = async (body) => {
    this.loading = true
    let result = null
    try {
      result = await API.post('dictionary', '/dictionary/', { body })
      this._items[result.name] = result
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      throw error
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  getAll = async (loadMore, limit = this.limit) => {
    this.loading = true
    let result = null
    try {
      if (this._items::isEmpty() || loadMore && this.lastEvaluatedKey === null) {
        result = await API.get(
          'dictionary',
          `/dictionary?limit=${limit}`,
        )
        result.items.forEach((dictionary) =>
          this._items[dictionary.name] = dictionary
        )
        if (result.lastEvaluatedKey)
          this.lastEvaluatedKey = result.lastEvaluatedKey
      } else if (loadMore && !!this.lastEvaluatedKey) {
        result = await API.get(
          'dictionary',
          `/dictionary?lastEvaluatedKey=${this.lastEvaluatedKey}&limit=${limit}`,
        )
        result.items.forEach((dictionary) =>
          this._items[dictionary.name] = dictionary
        )
        if (result.lastEvaluatedKey)
          this.lastEvaluatedKey = result.lastEvaluatedKey
        else if (!result.lastEvaluatedKey && this.lastEvaluatedKey !== null)
          this.lastEvaluatedKey = null
      } else {
        result = Object.values(this._items)
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }

  hasMore = () => this.lastEvaluatedKey !== null

  @action
  getById = async (id) => {
    this.loading = true
    let result = null
    try {
      if (!this._items::isEmpty())
        result = this.items::findByProperty('id', id)

      if (!result) {
        result = await API.get('dictionary', `/dictionary/${id}`)
        this._items[result.name] = result
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  getBySlug = async (slug) => {
    this.loading = true
    let result = null
    try {
      if (!this._items::isEmpty())
        result = this.items::findByProperty('slug', slug)

      if (!result) {
        result = await API.get('dictionary', `/dictionaryBySlug/${slug}`)
        this._items[result.name] = result
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  getByName = async (name) => {
    this.loading = true
    let result = null
    try {
      if (this._items[name]) {
        result = this._items[name]
      } else {
        result = await API.get('dictionary', `/dictionaryByName/${name}`)
        this._items[name] = result
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  update = async (id, body) => {
    this.loading = true
    let result = null
    try {
      result = await API.put('dictionary', `/dictionary/${id}`, { body })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  delete = async (id) => {
    this.loading = true
    let result = null
    try {
      result = await API.del('dictionary', `/dictionary/${id}`)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }
}
