import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject as injectStore } from 'mobx-react'
import withDictionary from '@widget/containers/dictionary'
import Input from '@widget/components/input'
import Button from '@widget/components/button'
import style from './style.scss'
import LoadingButton from '@widget/components/loading-button'
import Checkbox from '@widget/components/checkbox'

@withDictionary
@injectStore(({
  extension,
  term,
}) => ({
  extension,
  term,
}))
export default class TermAdd extends Component {
  static propTypes = {
    dictionary: PropTypes.object.isRequired,
    extension: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
  }

  goBack() {
    this.props.extension.go('view')
  }

  state = {
    term: '',
    addToTags: false,
  }

  handleChange = ({ target }) => this.setState({
    [target.name]: target.type === 'text'
      ? target.value
      : target.checked
  })

  _validators = {
    form: () =>
      this.state.term.length >= 2 && this._validators.term(),
    term: () =>
      !this.state.term || /^[а-яa-z ,.|:_-–—]{1,160}$/gi.test(this.state.term),
  }

  validate(target) {
    return this._validators[target]()
  }

  async addTerm() {
    const { term, dictionary, extension } = this.props

    try {
      const result = await term.post({
        term: this.state.term,
        dictionaryId: dictionary.id
      })

      // add to all extension terms
      if (this.state.addToTags)
        extension.addTag(result.fullTerm)

      // reload terms
      await term.get(dictionary.name, true)

      // back to terms list view
      this.goBack()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Can\'t add term', error)
    }
  }

  makePlaceholder(placeholderRule) {
    if (!placeholderRule) return null
    return `По примеру: "${placeholderRule}"`
  }

  render() {
    const{ term, addToTags } = this.state

    return (
      <section className={style.TermAdd}>
        <h2 className={style.Title}>Добавление нового термина</h2>
        <p className={style.SubTitle}>Термин</p>
        <Input
          placeholder={this.makePlaceholder(this.props.dictionary.placeholderRule)}
          className={style.Input}
          name='term'
          value={term}
          onChange={this.handleChange}
          error={!::this.validate('term')} />
        <Checkbox
          name='addToTags'
          checked={addToTags}
          onChange={this.handleChange}>
          Добавить к тегам
        </Checkbox>
        <div className={style.BottomBar}>
          <Button variant='flat' onClick={::this.goBack}>Оменить</Button>
          <LoadingButton
            loading={this.props.term.loading}
            onClick={::this.addTerm}
            disabled={!::this.validate('form')}>
            Добавить термин
          </LoadingButton>
        </div>
      </section>
    )
  }
}
