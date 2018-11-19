import { observable, action } from 'mobx'
import * as ContentfulExtension from 'contentful-ui-extensions-sdk'

export default class Extension {
  @observable instance = null

  constructor() {
    this.init()
  }

  @action
  init() {
    ContentfulExtension.init((extension) => {
      this.instance = extension
    })
  }
}

