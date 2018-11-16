import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Tag from '@widget/components/tag'
import Input from '@widget/components/input'
import Auth from '@widget/containers/auth'
import SearchIcon from '@widget/assets/icons/search.svg'
import popupWindow from '@core/utils/popupWindow'
import enviroment from '@core/utils/enviroment'
import style from './style.scss'

@injectStore('auth')
@observer
export default class App extends Component {
  static propTypes = {
    extension: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    extension: PropTypes.object.isRequired,
  }

  getChildContext = () => ({
    extension: this.props.extension,
  })

  state = {
    /** @type {string[]} */
    tags: [],
    /** @type {boolean} */
    loginWindowIsOpen: false,
  }

  componentDidMount() {
    /** @type {string} */
    const fieldValue = this.props.extension.field.getValue()

    fieldValue && this.setState({ tags: fieldValue.split('; ') })
  }

  openPopupWindow = async () => {
    this.setState({ loginWindowIsOpen: true })
    /** @type {boolean} */
    const result = await popupWindow(enviroment({
      production: 'https://d2ih136zgu7ccp.cloudfront.net/login?widget=true',
      development: 'https://localhost:8080/login?widget=true',
    }), 'Авторизация', 400, 380)

    result && this.props.auth.checkIsAuth()
    console.log('Авторизирован?', result)
    this.setState({ loginWindowIsOpen: false })
  }

  render() {
    const
      { tags, loginWindowIsOpen } = this.state,
      { auth: { status } } = this.props

    const dictionary = (<>
      <div className={style.TagContainer}>
        {tags.map((item) =>
          <Tag key={item} removable onRemoveClick={(event) => console.log(event)}>{item}</Tag>
        )}
        <Tag add onAdd={(event) => console.log(event)} />
      </div>
      <Input icon={SearchIcon} placeholder='Искать термин' />
    </>)

    return (
      <div className={style.FormField}>
        {!status
          ? <Auth loginWindowIsOpen={loginWindowIsOpen} onClickAuth={this.openPopupWindow} />
          : dictionary}
      </div>
    )
  }
}
