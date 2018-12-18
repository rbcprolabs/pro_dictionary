import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject as injectStore } from 'mobx-react'
import withDictionary from '@widget/containers/dictionary'
import Input from '@widget/components/input'
import Button from '@widget/components/button'
import style from './style.scss'

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

  onClickCancel() {
    this.props.extension.go('view')
  }

  addTerm() {
    // TODO: Make add term to dictionary
  }

  render() {
    return (
      <div className={style.TermAdd}>
        <h2 className={style.Title}>Добавление нового термина</h2>
        <p className={style.SubTitle}>Термин</p>
        <Input placeholder={this.props.dictionary.placeholderRule} />
        <div className={style.BottomBar}>
          <Button type='flat' onClick={::this.onClickCancel}>Оменить</Button>
          <Button onClick={::this.addTerm}>Добавить термин</Button>
        </div>
      </div>
    )
  }
}
