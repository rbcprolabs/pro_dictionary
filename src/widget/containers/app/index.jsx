import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Auth from '@widget/screens/auth'
import style from './style.scss'
import Init from '@widget/screens/init'
import Tags from '@widget/containers/tags'
import {
  View as TermView,
  Add as TermAdd,
} from '@widget/screens/term'
import hmr from '@core/utils/hmr'

@hmr(module)
@injectStore((stores) => ({
  extension: stores.extension,
  auth: stores.auth,
}))
@observer
export default class App extends Component {
  static propTypes = {
    extension: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
  }

  state = {
    /** @type {boolean} */
    showAdditional: false,
  }

  toggleShowAdditionals() {
    this.setState({showAdditional: !this.state.showAdditional})
  }

  renderContent() {
    return (<>
      <Tags onAdd={::this.toggleShowAdditionals}/>
      {this.state.showAdditional && this.page}
    </>)
  }

  render() {
    const { auth, extension } = this.props

    return (
      <div className={style.FormField}>
        {auth.loading || !extension.inited
          ? this.getFragmentByName('init')
          : !auth.status
            ? this.getFragmentByName('auth')
            : this.renderContent()}
      </div>
    )
  }

  get page() {
    return this.getFragmentByName('pages')[this.props.extension.page]
  }

  getFragmentByName(fragmentName) {
    return this._fragments[fragmentName]
  }

  _fragments = {
    init: <Init />,
    auth: <Auth />,
    pages: {
      view: <TermView />,
      add: <TermAdd />,
    },
  }
}
