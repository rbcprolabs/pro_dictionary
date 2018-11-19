import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Auth from '@widget/screens/auth'
import popupWindow from '@core/utils/popupWindow'
import enviroment from '@core/utils/enviroment'
import style from './style.scss'
import Dictionary from '@widget/screens/dictionary'
import Init from '@widget/screens/init'

@injectStore((stores) => ({
  extension: stores.extension.instance,
  auth: stores.auth,
}))
@observer
export default class App extends Component {
  static propTypes = {
    extension: PropTypes.object,
    auth: PropTypes.object.isRequired,
  }

  state = {
    /** @type {boolean} */
    loginWindowIsOpen: false,
  }

  openPopupWindow = async () => {
    this.setState({ loginWindowIsOpen: true })
    /** @type {boolean} */
    const result = await popupWindow(enviroment({
      production: 'https://d2ih136zgu7ccp.cloudfront.net/login?widget=true',
      development: 'https://localhost:8080/login?widget=true',
    }), 'Авторизация', 400, 380)

    result && this.props.auth.checkIsAuth()
    console.log('Авторизирован?', result) // eslint-disable-line no-console
    this.setState({ loginWindowIsOpen: false })
  }

  render() {
    const
      { loginWindowIsOpen } = this.state,
      {
        auth: {
          status,
          loading,
        },
        extension,
      } = this.props

    return (
      <div className={style.FormField}>
        {loading || !extension
          ? <Init />
          : !status
            ? <Auth loginWindowIsOpen={loginWindowIsOpen} onClickAuth={this.openPopupWindow} />
            : <Dictionary />}
      </div>
    )
  }
}
