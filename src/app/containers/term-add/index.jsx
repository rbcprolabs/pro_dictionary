import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import FullSizeInput from '@app/components/fullsize-input'
import Grow from '@material-ui/core/Grow'
import AddIcon from '@material-ui/icons/Add'
import LoadingFab from '@app/components/loading-fab'
import Badge from '@material-ui/core/Badge'
import Notification from '@core/stores/notification'
import { splitByChunks } from '@core/utils/hooks/array'
import asyncDelay from '@core/utils/hooks/asyncDelay'

@injectStore(({
  term,
  notification,
}) => ({
  term,
  notification,
}))
@observer
export default class TermAdd extends Component {
  static propTypes = {
    term: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
    termName: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    onAdded: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  state = {
    terms: '',
    loading: false,
    howManySends: null,
  }

  handleChange = ({ target }) => this.setState({
    [target.name]: target.value,
  })

  get splittedTerms() {
    return this.state.terms.split(/\r|\n/)
  }

  get validateTerms() {
    return this.state.terms.length >= 2
  }

  makeRequest(dictionaryId, terms, parentId) {
    const body = {
      dictionaryId,
    }

    if (terms.length === 1)
      body.term = terms[0].term
    else
      body.terms = terms

    if (parentId)
      body.parentId = parentId

    return body
  }

  async sendByChunks(chunks) {
    const { dictionary, parentId } = this.props

    for (const [index, chunk] of chunks.entries()) {
      if (chunks.length > 1)
        this.setState({ howManySends: `${index + 1}/${chunks.length}` })

      await this.props.term.post(this.makeRequest(dictionary.id, chunk, parentId))

      if (chunks.length - 1 > index)
        await asyncDelay(10000)
      else if (chunks.length > 1)
        this.setState({ howManySends: null })
    }
  }

  async addTerms() {
    try {
      this.setState({ loading: true })

      const
        terms = this.splittedTerms.map((term) => ({ term })),
        chunks = terms::splitByChunks(25)

      await this.sendByChunks(chunks)

      this.props.onAdded()

      this.setState({
        terms: '',
        loading: false,
      })
      this.props.notification.notify({
        variant: Notification.SUCCESS,
        message: 'Термины успешно добавлены',
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      this.props.notification.notify({
        variant: Notification.ERROR,
        message: 'Ошибка добавления терминов',
      })
      this.setState({ loading: false })
    }
  }

  makePlaceholder(termName, placeholderRule) {
    let placeholder = `Впишите сюда новые термины в столбик для «${termName}»`
    if (placeholderRule)
      placeholder += `\n\nПо примеру: ${placeholderRule}`
    return placeholder
  }

  render() {
    const
      { disabled, termName, dictionary } = this.props,
      { howManySends } = this.state

    return (
      <FullSizeInput
        placeholder={this.makePlaceholder(termName, dictionary.placeholderRule)}
        value={this.state.terms}
        disabled={disabled}
        name='terms'
        onChange={this.handleChange}>
        <Grid container justify='flex-end'>
          <Grow in timeout={1000}>
            <Badge badgeContent={howManySends} invisible={howManySends === null} color='primary'>
              <LoadingFab
                loading={this.state.loading}
                color='secondary'
                disabled={!this.validateTerms}
                onClick={::this.addTerms}>
                <AddIcon />
              </LoadingFab>
            </Badge>
          </Grow>
        </Grid>
      </FullSizeInput >
    )
  }
}
