import { observable, action } from 'mobx'

export default class AppStore {
  @observable dictionaryId = null

  @action
  clearDictionaryId = () => {
    this.dictionaryId = null
  }
}
