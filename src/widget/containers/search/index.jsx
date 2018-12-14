import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer, inject as injectStore } from 'mobx-react'
import { ReactComponent as SearchIcon } from '@widget/assets/icons/search.svg'
import Input from '@widget/components/input'
import { debounce } from 'throttle-debounce'
import style from './style.scss'
import Button from '@widget/components/button'
import Loader from '@widget/components/loader';

@injectStore('term')
@observer
export default class Search extends Component {
  static propTypes = {
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
      loading && this.searchDebounced(this.state.query)
    })
  }

  searchDebounced = debounce(1000, ::this.search)

  async search(query) {
    const { items } = await this.props.term.findAllByTerm(this.props.dictionaryId, query)
    // eslint-disable-next-line no-console
    console.log(items)
    this.setState({
      searchResults: items,
      loading: false,
    })
  }

  clearInput() {
    this.setState({
      query: '',
      searchResults: [],
    })
  }

  render() {
    const { query, searchResults, resultsDialogOpen, loading } = this.state

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
              ? searchResults.map(({id, term}) =>
                  <div key={id} className={style.Item}>{term}</div>
                )
              : <div className={style.Item}>Совпадений не найдено</div>}
        </div>
      </>
    )
  }
}
