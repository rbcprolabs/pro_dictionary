import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import { ReactComponent as SearchIcon } from '@widget/assets/icons/search.svg'
import Input from '@widget/components/input'
import { debounce } from 'throttle-debounce'
import style from './style.scss'
import Button from '@widget/components/button'
import Loader from '@widget/components/loader'
import NestingString from '@widget/components/string-nesting'
import { alphabet } from '@core/utils/sort'
import withDictionary from '@widget/containers/dictionary'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

@withDictionary
@injectStore((stores) => ({
  extension: stores.extension,
  term: stores.term,
}))
@observer
export default class Search extends Component {
  static propTypes = {
    extension: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
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
      loading = query.length >= 2,
      searchResults = (query === '')
        ? this.state.searchResults
        : []

    this.setState({ query, searchResults, resultsDialogOpen, loading }, () => {
      this.state.query.length >= 2 && this.searchDebounced(this.state.query)
    })
  }

  searchDebounced = debounce(1000, ::this.search)

  async search(query) {
    const { items } = await this.props.term.findAllByDictionary(this.props.dictionary.id, query)
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
      loading: false,
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
        <NestingString strings={fullTerm.split('/')} delimeter=' ➜ ' />
      </div>
    )
  }

  sortByAlphabet(a, b) {
    return alphabet(a.term, b.term)
  }

  addTerm() {
    this.props.extension.go('add')
  }

  renderNoMatchesFound() {
    const { isFlat, isOpen } = this.props.dictionary

    return (
      <div className={style.Item}>
        {this.state.query.length <= 1
          ? 'Введите более одного символа'
          : 'Совпадений не найдено'}
        {isFlat && isOpen &&
          <Button
            className={style.AddTerm}
            onClick={::this.addTerm}>
            Добавить термин
          </Button>
        }
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
          className={style.Search}
          active={query.length > 0}
          before={() =>
            <SearchIcon
              className={style.Icon}
              viewBox='0 0 14 14' />
          }
          after={() =>
            <Button
              variant='secondary'
              className={style.Cancel}
              onClick={::this.clearInput}>
              Отменить
            </Button>
          }
          hideAfter={({active}) => !active}
          placeholder='Искать термин'
          value={query}
          onChange={::this.handleSearchInput} />
        <ReactCSSTransitionGroup
          component='div'
          transitionName='fade-in-up'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {resultsDialogOpen &&
            <div className={style.SearchResults}>
              {loading
                ? <Loader type='circles' className={style.Loader} />
                : searchResults.length > 0
                  ? searchResults
                      .slice() // mobx magic
                      .sort(this.sortByAlphabet)
                      .map((tag) => this.renderTermItem(tag, extension.tags.includes(tag.fullTerm)))
                  : this.renderNoMatchesFound()}
            </div>
          }
        </ReactCSSTransitionGroup>
      </>
    )
  }
}
