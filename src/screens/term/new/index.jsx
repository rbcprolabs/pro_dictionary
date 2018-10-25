import React, { Component } from 'react'
import { observer, inject as injectStore } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'

const styles = {
  container: {
    paddingBottom: 15,
  },
}

@withStyles(styles)
@injectStore('routing')
@injectStore('dictionary')
@observer
export default class DictionaryNew extends Component {
  state = {
    isLoading: false,
    name: '',
  }

  validateForm() {
    return this.state.name.length > 0
  }

  handleChange = ({target}) => {
    this.setState({
      [target.id]: target.value
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await this.props.dictionary.post({
        name: this.state.name,
        isFlat: true,
        isOpen: true,
      })
      this.props.routing.goBack()
    } catch(error) {
      console.error(error)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render = () =>
    <div>
      <form onSubmit={this.handleSubmit} className={this.props.classes.container}>
        <Button
          disabled={!this.validateForm()}
          type='submit'>
          Создать
        </Button>
      </form>
    </div>
}
