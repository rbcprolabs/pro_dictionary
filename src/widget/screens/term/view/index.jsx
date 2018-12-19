import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer, inject as injectStore } from 'mobx-react'
import { alphabet } from '@core/utils/sort'
import threeArray from '@core/utils/threeArray'
import withDictionary from '@widget/containers/dictionary'
import Loader from '@widget/components/loader'
import Hint from '@widget/components/hint'
import Button from '@widget/components/button'
import CenteredContainer from '@widget/components/centered-container'
import Search from '@widget/containers/search'
import style from './style.scss'

@withDictionary
@injectStore((stores) => ({
  extension: stores.extension,
  term: stores.term,
}))
@observer
export default class TermView extends Component {
  static propTypes = {
    extension: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
  }

  state = {
    /** @type {{children: string[], fullTerm: string, parent: string, term: string}[]} */
    items: [],
    /** @type {?string} */
    fullTerm: null,
  }

  componentDidMount() {
    if (this.state.fullTerm === null) this.navigate(this.props.dictionary.name)
  }

  getTerms(fullTerm, loadMore = false) {
    return this.props.term.get(fullTerm, loadMore)
  }

  async navigate(fullTerm, loadMore) {
    const items = await this.getTerms(fullTerm, loadMore)
    this.setState({ fullTerm, items })
  }

  onClickTerm = (fullTerm) => () =>
    this.navigate(fullTerm)

  addTag = (fullTerm) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.props.extension.addTag(fullTerm)
  }

  renderTermItem({ id, term, fullTerm, childrens }, alreadyAdded) {
    return (
      <div
        className={classNames(style.Item, {
          [style.hasChilds]: !!childrens,
        })}
        key={id}
        onClick={childrens ? this.onClickTerm(fullTerm) : null}>
        <div className={style.content}>
          <label className={style.title}>{term}</label>
          {childrens && <p className={style.subtitle}>{childrens.join(', ')}</p>}
        </div>
        <Button
          variant='primary'
          disabled={alreadyAdded}
          onClick={this.addTag(fullTerm)}>
          Добавить
        </Button>
      </div>
    )
  }

  renderHeaderNavigation(fullTerm) {
    return fullTerm.split('/')::threeArray().map(({ origin, deep }, index, arr) =>
      <a
        key={deep}
        onClick={::this.onClickTerm(deep)}>
        {index === arr.length - 1 ? origin : origin + ' ➜ '}
      </a>
    )
  }

  sortByAlphabet(a, b) {
    return alphabet(a.term, b.term)
  }

  render() {
    const
      { term, dictionary } = this.props,
      { items, fullTerm } = this.state

    return (
      <section>
        <Search />
        <div className={style.TermView}>
          <div className={style.Header}>{this.renderHeaderNavigation(fullTerm || dictionary.name)}</div>
          <div className={style.Body}>
            {term.loading
              ? <CenteredContainer key={0} className={style.LoaderWrapper}>
                  <Loader />
                </CenteredContainer>
              : items.length === 0
                ? <Hint key={1} className={style.DictionaryEmpty}>Словарь пуст</Hint>
                : this.state.items
                    .slice() // mobx magic
                    .sort(this.sortByAlphabet)
                    .map((tag) => this.renderTermItem(tag, this.props.extension.tags.includes(tag.fullTerm)))
            }
          </div>
        </div>
      </section>
    )
  }
}
