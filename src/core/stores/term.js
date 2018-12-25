import { action, observable } from 'mobx'
import { API } from 'aws-amplify'
import { findByProperty, updateByProperty, removeByProperty } from '@core/utils/hooks/array'

export default class Terms {
  limit = 100

  @observable items = {}
  @observable loading = false
  @observable findLoading = false

  @action
  post = async (body) => {
    this.loading = true
    let result = null
    try {
      result = await ('term' in body
        ? API.post('term', '/term/', { body })
        : API.post('term', '/termAll/', { body }))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      throw error
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  get = async (parent, loadMore, limit = this.limit) => {
    this.loading = true
    let result = null
    try {
      if (!this.items[parent] || loadMore && !this.items[parent].lastEvaluatedKey) {
        result = await API.get(
          'term',
          `/termAllByParent/${encodeURIComponent(parent)}/?limit=${limit}`,
        )
        this.items[parent] = {
          lastEvaluatedKey: result.lastEvaluatedKey,
          items: result.items,
        }
      } else if (loadMore && !!this.items[parent].lastEvaluatedKey) {
        result = await API.get(
          'term',
          `/termAllByParent/${encodeURIComponent(parent)}/` +
          `?lastEvaluatedKey=${this.items[parent].lastEvaluatedKey}&limit=${limit}`,
        )
        this.items[parent].items.push(...result.items)
        this.items[parent].lastEvaluatedKey = result.lastEvaluatedKey
      } else {
        result = this.items[parent]
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result ? result.items : []
  }

  getById = async (parent, id) => {
    this.loading = true
    let result = null
    try {
      if (this.items[parent]) {
        result = this.items[parent].items::findByProperty('id', id)
      } else {
        result = await API.get(
          'term',
          `/term/${encodeURIComponent(id)}`,
        )
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
  getByFullTerm = async (parent, fullTerm) => {
    this.loading = true
    let result = null
    try {
      if (this.items[parent]) {
        result = this.items[parent].items::findByProperty('fullTerm', fullTerm)
      } else {
        result = await API.get(
          'term',
          `/termByFullTerm/${encodeURIComponent(fullTerm)}`,
        )
      }
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }

  findAllByDictionary = async (dictionaryId, term) => {
    this.findLoading = true
    let result = null
    try {
      result = await API.get(
        'term',
        `/termFindAllByDictionary/${encodeURIComponent(dictionaryId)}/${encodeURIComponent(term)}`,
      )
    } catch (error) {
      if (!('response' in error) || 'response' in error && error.response.status !== 404)
        console.error(error) // eslint-disable-line no-console
    } finally {
      this.findLoading = false
    }
    return result
  }

  @action
  update = async (id, body) => {
    this.loading = true
    let result = null
    try {
      result = await API.put('term', `/term/${id}`, { body })
      // Recreat cached term
      if (this.items[body.parent]) {
        this.items[body.parent].items = this.items[body.parent].items::updateByProperty('id', id, result)
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  delete = async (parent, id) => {
    this.loading = true
    let result = null
    try {
      result = await API.del('term', `/term/${id}`)
      // Remove cached term
      if (this.items[parent]) {
        this.items[parent].items = this.items[parent].items::removeByProperty('id', id)
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      this.loading = false
    }
    return result
  }
}
