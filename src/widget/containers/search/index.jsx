import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer, inject as injectStore } from 'mobx-react'
import { ReactComponent as SearchIcon } from '@widget/assets/icons/search.svg'
import Input from '@widget/components/input'
import { debounce } from 'throttle-debounce'
import style from './style.scss'
import Button from '@widget/components/button'
import Loader from '@widget/components/loader'
import NestingString from '@widget/components/string-nesting'
import { alphabet } from '@core/utils/sort'

@injectStore((stores) => ({
  extension: stores.extension,
  term: stores.term,
}))
@observer
export default class Search extends Component {
  static propTypes = {
    extension: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
    dictionaryId: PropTypes.string.isRequired,
  }

  state = {
    query: '',
    searchResults: [],
    resultsDialogOpen: false,
  }

  handleSearchInput(event) {
    const
      query = event.target.value,
      resultsDialogOpen = query.length >= 1,
      loading = this.state.query.length >= 2,
      searchResults = (query === '')
        ? this.state.searchResults
        : []

    this.setState({ query, searchResults, resultsDialogOpen, loading }, () => {
      this.state.query.length >= 2 && this.searchDebounced(this.state.query)
    })
  }

  searchDebounced = debounce(1000, ::this.search)

  async search(query) {
    const { items } = await this.props.term.findAllByTerm(this.props.dictionaryId, query)
    this.setState({
      searchResults: items,
      loading: false,
    })
  }

  clearInput() {
    this.setState({
      query: '',
      searchResults: [],
      resultsDialogOpen: false,
    })
  }

  addTag = (fullTerm) => () => {
    this.props.extension.addTag(fullTerm)
  }

  renderTermItem({ id, fullTerm }, alreadyAdded) {
    return (
      <div
        className={style.Item}
        key={id}
        disabled={alreadyAdded}
        onClick={!alreadyAdded ? this.addTag(fullTerm) : null}>
        <NestingString strings={fullTerm.split('/')} delimeter=' > ' />
      </div>
    )
  }

  sortByAlphabet(a, b) {
    return alphabet(a.term, b.term)
  }

  renderNoMatchesFound() {
    return (
      <div className={style.Item}>
        Совпадений не найдено
        <Button>Добавить термин</Button>
      </div>
    )
  }

  render() {
    const
      { extension } = this.props,
      { query, searchResults, resultsDialogOpen, loading } = this.state

    return (
      <>
        <Input
          active={query.length > 0}
          before={() =>
            <SearchIcon
              className={style.SearchIcon}
              viewBox='0 0 14 14' />
          }
          after={({active}) =>
            <Button
              type='secondary'
              className={style.SearchCancel}
              onClick={::this.clearInput}
              hidden={!active}>
              Отменить
            </Button>
          }
          placeholder='Искать термин'
          value={query}
          onChange={::this.handleSearchInput} />
        <div className={classNames(style.SearchResuls, {
          [style.open]: resultsDialogOpen
        })}>
          {loading
            ? <Loader type='cube-grid' className={style.Loader} />
            : searchResults.length > 0
              ? searchResults
                  .slice() // mobx magic
                  .sort(this.sortByAlphabet)
                  .map((tag) => this.renderTermItem(tag, extension.tags.includes(tag.fullTerm)))
              : this.renderNoMatchesFound()}
        </div>
      </>
    )
  }
}
