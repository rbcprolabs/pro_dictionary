import { action, observable } from 'mobx'
import { API } from 'aws-amplify'

export default class Terms {
  lastKey = 0
  limit = 100

  @observable items = {}
  @observable loading = false

  @action
  async post(body) {
    this.loading = true
    let result = null
    try {
      result = await API.post('term', '/term/', { body })
      (!this.items[body.parent]) && (this.items[body.parent] = [])
      this.items[body.parent].push(result)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    return result
  }

  @action
  async get(parent, loadMore, limit = this.limit) {
    this.loading = true
    let result = null
    try {
      if (!this.items[parent]) {
        result = await API.get('term', `/term?parent=${parent}&limit=${limit}`)
        this.items[parent] = {
          lastEvaluatedKey: result.lastEvaluatedKey,
          items: result.items,
        }
      } else if (loadMore && !!this.items[parent].lastEvaluatedKey) {
        result = await API.get('term', `/term?parent=${parent}&lastEvaluatedKey=${this.items[parent].lastEvaluatedKey}&limit=${limit}`)
        this.items[parent].items.push(...result.items)
        this.items[parent].lastEvaluatedKey = result.lastEvaluatedKey
      } else {
        result = this.items[parent]
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
    console.log(this.items)
    return result.items
  }
}
