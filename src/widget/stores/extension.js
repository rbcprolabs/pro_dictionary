import { observable, action } from 'mobx'
import * as ContentfulExtension from 'contentful-ui-extensions-sdk'

export default class Extension {
  static SPLIT_PATTERN = '; '

  _instance = null
  /** @type {boolean} */
  @observable inited = false
  /** @type {string} */
  @observable dictionarySlug
  /** @type {string[]} */
  @observable tags = []
  /** @type {string} */
  @observable page = 'view'
  /** @type {string} */
  @observable searchQuery = ''

  constructor() {
    ContentfulExtension.init((extension) => {
      extension.window.startAutoResizer()
      this._instance = extension
      this.dictionarySlug = extension.field.id
      /** @type {string} */
      const fieldValue = extension.field.getValue()
      if (fieldValue) this.tags = fieldValue.split(Extension.SPLIT_PATTERN)
      this.inited = true
    })
  }

  @action
  addTag = (fullTerm) => {
    this.tags.push(fullTerm)
    this._saveTags()
  }

  @action
  removeTag = (fullTerm) => {
    const index = this.tags.indexOf(fullTerm)
    if (index !== -1) this.tags.splice(index, 1)
    this._saveTags()
  }

  _saveTags() {
    this._instance.field.setValue(this.tags.join(Extension.SPLIT_PATTERN))
  }

  /**
   * Navigation
   * @param {string} pageName
   */
  go(pageName, searchQuery = '') {
    this.page = pageName
    this.searchQuery = searchQuery
  }
}

