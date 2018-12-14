import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Loader from '@widget/components/loader'
import Hint from '@widget/components/hint'
import style from './style.scss'
import CenteredContainer from '@widget/components/centered-container';

export default function withDictionary(WrappedComponent) {
  return injectStore((stores) => ({
    extension: stores.extension,
    dictionary: stores.dictionary,
  }))(
  observer(
  class _withDictionary extends Component {
    static propTypes = {
      extension: PropTypes.object,
      dictionary: PropTypes.object.isRequired,
    }

    state = {}

    componentDidMount() {
      this.getDictionary(this.props.extension.dictionarySlug)
    }

    async getDictionary(slug) {
      const dictionary = await this.props.dictionary.getBySlug(slug)
      this.setState({ dictionary })
    }

    render() {
      const
        { dictionary: dictionaryStore } = this.props,
        { dictionary } = this.state

      return (dictionaryStore.loading
        ? <CenteredContainer>
            <Loader className={style.Loader} />
          </CenteredContainer>
        : !dictionary
          ? <Hint>Ошибка загрузки словаря</Hint>
          : <WrappedComponent dictionary={dictionary} />
      )
    }
  }))
}
