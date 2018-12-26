import { observable, action } from 'mobx'

export default class AppStore {
  @observable dictionaryId = null

  @action
  setDictionaryId = (dictionaryId) => {
    this.dictionaryId = dictionaryId
  }

  @action
  clearDictionaryId = () => {
    this.dictionaryId = null
  }
}
