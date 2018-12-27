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
  get items() {
    return Object.values(this._items)
  }

  _has(id) {
    return !!this._items[id]
  }

  _get(id) {
    return this._items[id]
  }

  _set(id, dictionary) {
    this._items[id] = dictionary
  }

  _remove(id) {
    delete this._items[id]
  }

  _isEmpty() {
    return this._items::isEmpty()
  }

  @action
  post = async (body) => {
    this.loading = true
    let result = null
    try {
      result = await API.post('dictionary', '/dictionary/', { body })
      this._set(result.id, result)
    } catch (error) {
      console.error(error)
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
      if (this._isEmpty() || loadMore && this.lastEvaluatedKey === null) {
        result = await API.get(
          'dictionary',
          `/dictionary?limit=${limit}`,
        )
        result.items.forEach((dictionary) =>
          this._set(dictionary.id, dictionary)
        )
        if (result.lastEvaluatedKey)
          this.lastEvaluatedKey = result.lastEvaluatedKey
      } else if (loadMore && !!this.lastEvaluatedKey) {
        result = await API.get(
          'dictionary',
          `/dictionary?lastEvaluatedKey=${this.lastEvaluatedKey}&limit=${limit}`,
        )
        result.items.forEach((dictionary) =>
          this._set(dictionary.id, dictionary)
        )
        if (result.lastEvaluatedKey)
          this.lastEvaluatedKey = result.lastEvaluatedKey
        else if (!result.lastEvaluatedKey && this.lastEvaluatedKey !== null)
          this.lastEvaluatedKey = null
      } else {
        result = Object.values(this._items)
      }
    } catch (error) {
      console.error(error)
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
      if (this._has(id)) {
        result = this._get(id)
      } else {
        result = await API.get('dictionary', `/dictionary/${id}`)
        this._set(id, result)
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error)
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
      if (!this._isEmpty())
        result = this.items::findByProperty('slug', slug)

      if (!result) {
        result = await API.get('dictionary', `/dictionaryBySlug/${slug}`)
        this._set(result.id, result)
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error)
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
      if (!this._isEmpty())
        result = this.items::findByProperty('name', name)

      if (!result) {
        result = await API.get('dictionary', `/dictionaryByName/${name}`)
        this._set(result.id, result)
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error)
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
      // Recreat cached dictionary
      if (!this._isEmpty() && this._has(id)) {
        this._set(id, {...body, id})
      }
    } catch (error) {
      console.error(error)
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
      // Remove cached dictionary
      if (!this._isEmpty() && this._has(id)) {
        this._remove(id)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }
}
