import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Auth from '@widget/screens/auth'
import popupWindow from '@core/utils/popupWindow'
import enviroment from '@core/utils/enviroment'
import style from './style.scss'
import Init from '@widget/screens/init'
import Tags from '@widget/containers/tags'
import Term from '@widget/screens/term/view'
import hmr from '@core/utils/hmr'

@hmr(module)
@injectStore((stores) => ({
  inited: stores.extension.inited,
  auth: stores.auth,
}))
@observer
export default class App extends Component {
  static propTypes = {
    inited: PropTypes.bool.isRequired,
    auth: PropTypes.object.isRequired,
  }

  state = {
    /** @type {boolean} */
    loginWindowIsOpen: false,
    /** @type {boolean} */
    showAdditional: false,
  }

  openPopupWindow = async () => {
    this.setState({ loginWindowIsOpen: true })
    /** @type {boolean} */
    const result = await popupWindow(enviroment({
      production: 'https://d2ih136zgu7ccp.cloudfront.net/login?widget=true',
      development: 'https://localhost:8080/login?widget=true',
    }), 'Авторизация', 400, 380)

    if (result) this.props.auth.checkIsAuth()
    this.setState({ loginWindowIsOpen: false })
  }

  toggleShowAdditionals = () => {
    // eslint-disable-next-line no-console
    console.log('toggleShowAdditionals clicked')
    this.setState({showAdditional: !this.state.showAdditional})
  }

  renderContent() {
    return (<>
      <Tags onAdd={this.toggleShowAdditionals}/>
      {this.state.showAdditional && <Term />}
    </>)
  }

  render() {
    const
      { auth, inited } = this.props,
      { loginWindowIsOpen } = this.state

    return (
      <div className={style.FormField}>
        {auth.loading || !inited
          ? <Init />
          : !auth.status
            ? <Auth loginWindowIsOpen={loginWindowIsOpen} onClickAuth={this.openPopupWindow} />
            : this.renderContent()}
      </div>
    )
  }
}
