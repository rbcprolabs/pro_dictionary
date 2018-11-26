import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './style.scss'
import { observer, inject as injectStore } from 'mobx-react'
import Input from '@widget/components/input'
import SearchIcon from '@widget/assets/icons/search.svg'
import Loader from '@widget/components/loader';
import Hint from '@widget/components/hint';
import Button from '@widget/components/button';

@injectStore((stores) => ({
  extension: stores.extension,
  term: stores.term,
}))
@observer
export default class Term extends Component {
  static propTypes = {
    extension: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
    dictionaryName: PropTypes.string.isRequired,
  }

  state = {
    /** @type {{children: string[], fullTerm: string, parent: string, term: string}[]} */
    items: [],
    /** @type {?string} */
    fullTerm: null,
  }

  getTerms = (fullTerm, loadMore = false) => this.props.term.get(fullTerm, loadMore)

  componentDidMount() {
    if (this.state.fullTerm === null) this.navigate(this.props.dictionaryName)
  }

  async navigate(fullTerm, loadMore) {
    const items = await this.getTerms(fullTerm, loadMore)
    // eslint-disable-next-line no-console
    console.log(fullTerm, items)
    this.setState({fullTerm, items})
  }

  onClickTerm = (fullTerm) => () =>
    this.navigate(fullTerm)

  // componentDidUpdate(_prevProps) {}

  addTag = (fullTerm) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.props.extension.addTag(fullTerm)
  }

  renderTermItem = ({ term, fullTerm, children }) =>
    <div
      className={classNames(style.Item, {
        [style.hasChilds]: !!children,
      })}
      key={fullTerm}
      onClick={children ? this.onClickTerm(fullTerm) : null}>
      <div className={style.content}>
        <label className={style.title}>{term}</label>
        {children && <p className={style.subtitle}>{children.join(', ')}</p> }
      </div>
      <Button type='primary' onClick={this.addTag(fullTerm)}>Добавить</Button>
    </div>

  renderTermView() {
    const
      { extension } = this.props,
      { items, fullTerm } = this.state

    return (
      <>
        <Input icon={SearchIcon} placeholder='Искать термин' />
        <section className={style.TermView}>
          <div className={style.Header}>{fullTerm}</div>
          {items.filter((tag) => !extension.tags.includes(tag.fullTerm)).map(this.renderTermItem)}
        </section>
      </>
    )
  }

  render() {
    const
      { term } = this.props,
      { items } = this.state

    return (term.loading
      ? <Loader />
      : items.length > 0
        ? this.renderTermView()
        : <Hint>Словарь пуст</Hint>
    )
  }
}
