import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './style.scss'
import { observer, inject as injectStore } from 'mobx-react'
import Input from '@widget/components/input'
import SearchIcon from '@widget/assets/icons/search.svg'
import Loader from '@widget/components/loader'
import Hint from '@widget/components/hint'
import Button from '@widget/components/button'
import CenteredContainer from '@widget/components/centered-container'
import threeArray from '@core/utils/threeArray'
import withDictionary from '@widget/containers/dictionary'

@withDictionary
@injectStore((stores) => ({
  extension: stores.extension,
  term: stores.term,
}))
@observer
export default class Term extends Component {
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

  getTerms = (fullTerm, loadMore = false) => this.props.term.get(fullTerm, loadMore)

  componentDidMount() {
    if (this.state.fullTerm === null) this.navigate(this.props.dictionary.name)
  }

  async navigate(fullTerm, loadMore) {
    const items = await this.getTerms(fullTerm, loadMore)
    this.setState({fullTerm, items})
  }

  onClickTerm = (fullTerm) => () =>
    this.navigate(fullTerm)

  addTag = (fullTerm) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.props.extension.addTag(fullTerm)
  }

  renderTermItem = ({ term, fullTerm, childrens }, alreadyAdded) =>
    <div
      className={classNames(style.Item, {
        [style.hasChilds]: !!childrens,
      })}
      key={fullTerm}
      onClick={childrens ? this.onClickTerm(fullTerm) : null}>
      <div className={style.content}>
        <label className={style.title}>{term}</label>
        {childrens && <p className={style.subtitle}>{childrens.join(', ')}</p> }
      </div>
      <Button type='primary' disabled={alreadyAdded} onClick={this.addTag(fullTerm)}>Добавить</Button>
    </div>

  renderHeaderNavigation(fullTerm) {
    return fullTerm.split('/')::threeArray().map(({origin, deep}, index, arr) =>
      <a key={deep} onClick={this.onClickTerm(deep)}>{index === arr.length - 1 ? origin : origin + ' / '}</a>
    )
  }

  render() {
    const
      { term, extension, dictionary } = this.props,
      { items, fullTerm } = this.state

    return (
      <>
        <Input icon={SearchIcon} placeholder='Искать термин' />
        <section className={style.TermView}>
          <div className={style.Header}>{this.renderHeaderNavigation(fullTerm || dictionary.name)}</div>
          {term.loading
            ? <CenteredContainer>
                <Loader />
              </CenteredContainer>
            :  items.length === 0
              ? <Hint>Словарь пуст</Hint>
              : items.map((tag) => this.renderTermItem(tag, extension.tags.includes(tag.fullTerm)))
          }
        </section>
      </>
    )
  }
}
