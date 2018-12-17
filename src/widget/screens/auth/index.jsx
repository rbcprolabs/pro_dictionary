import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Hint from '@widget/components/hint'
import Button from '@widget/components/button'
import popupWindow from '@core/utils/popupWindow'
import enviroment from '@core/utils/enviroment'

@injectStore('auth')
@observer
export default class Auth extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }

  state = {
    /** @type {boolean} */
    loginWindowIsOpen: false,
  }

  async openPopupWindow() {
    this.setState({ loginWindowIsOpen: true })
    /** @type {boolean} */
    const result = await popupWindow(enviroment({
      production: 'https://d2jdttpnes7jtt.cloudfront.net/login?widget=true',
      development: 'https://localhost:8080/login?widget=true',
    }), 'Авторизация', 400, 380)

    if (result) this.props.auth.checkIsAuth()
    this.setState({ loginWindowIsOpen: false })
  }

  render() {
    return (
      <>
        <Hint>Для использования словаря вам необходимо авторизироваться</Hint>
        {!this.state.loginWindowIsOpen
          ? <Button type='primary' onClick={::this.openPopupWindow}>Войти</Button>
          : <Hint>Пожалуйста авторизируйтесь в открытом окне</Hint>
        }
      </>
    )
  }
}
