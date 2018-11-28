import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Tag from '@widget/components/tag'
import style from './style.scss'
import {
  View as TermView,
} from '@widget/screens/term'
import Loader from '@widget/components/loader'
import Hint from '@widget/components/hint'

@injectStore((stores) => ({
  extension: stores.extension,
  dictionary: stores.dictionary,
}))
@observer
export default class Dictionary extends Component {
  static propTypes = {
    extension: PropTypes.object,
    dictionary: PropTypes.object.isRequired,
  }

  state = {}

  componentDidMount() {
    this.getDictionary(this.props.extension.dictionarySlug)
  }

  async getDictionary(id) {
    const dictionary = await this.props.dictionary.get(id)
    this.setState({ dictionary })
  }

  removeTag = (fullTerm) => () => this.props.extension.removeTag(fullTerm)

  render() {
    const
      { extension, dictionary: dictionaryStore } = this.props,
      { dictionary } = this.state

    return (
      <>
        <div className={style.TagContainer}>
          {extension.tags.map((fullTerm) =>
            <Tag key={fullTerm} removable onRemoveClick={this.removeTag(fullTerm)}>{fullTerm}</Tag>
          )}
          {/* eslint-disable-next-line no-console */}
          <Tag add onAdd={(event) => console.log(event)} />
        </div>
        {dictionaryStore.loading
          ? <Loader />
          : !dictionary
            ? <Hint>Ошибка загрузки словаря</Hint>
            : <TermView dictionaryName={dictionary.name} />}
      </>
    )
  }
}
