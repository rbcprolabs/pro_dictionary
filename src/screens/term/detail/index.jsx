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
export default class DictionaryDetail extends Component {
  state = {
    note: null,
    name: '',
  }

  async componentDidMount() {
    try {
      const
        note = await this.props.dictionary.get(this.props.match.params.id),
        { name } = note

      this.setState({
        note,
        name,
      })
    } catch (error) {
      console.error(error)
    }
  }

  validateForm = () => this.state.name.length > 0

  formatFilename = (str) => str.replace(/^\w+-/, '')

  handleChange = ({target}) =>
    this.setState({
      [target.id]: target.value
    })

  handleSubmit = async (event) => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      (await this.props.dictionary.update(this.props.match.params.id, {
        name: this.state.name,
      })) && this.props.routing.goBack()
    } catch (error) {
      console.error(error)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleDelete = async event => {
    event.preventDefault()

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    )

    if (!confirmed) return

    this.setState({ isDeleting: true })

    try {
      (await this.props.dictionary.delete(
        this.props.match.params.id,
      )) && this.props.routing.goBack()
    } catch (error) {
      console.error(error)
    } finally {
      this.setState({ isDeleting: false })
    }
  }

  render = () =>
    <div>
      {this.state.note &&
        <form onSubmit={this.handleSubmit} className={this.props.classes.container}>
          <Button
            disabled={!this.validateForm()}
            type='submit'>Сохранить</Button>
          <Button onClick={this.handleDelete}>Удалить</Button>
        </form>
      }
    </div>
}
