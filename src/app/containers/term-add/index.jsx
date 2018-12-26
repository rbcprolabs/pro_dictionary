import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import FullSizeInput from '@app/components/fullsize-input'
import Grow from '@material-ui/core/Grow'
import AddIcon from '@material-ui/icons/Add'
import LoadingFab from '@app/components/loading-fab';
import Notification from '@core/stores/notification'

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
  }

  state = {
    terms: '',
    loading: false,
  }

  handleChange = ({ target }) => this.setState({
    [target.name]: target.value,
  })

  get splittedTerms() {
    return this.state.terms.split(/\r|\n/)
  }

  get validateTerms() {
    return this.state.terms.length > 0 && this.splittedTerms.length < 25
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

  async addTerms() {
    const {
      term,
      dictionary,
      parentId,
      onAdded,
    } = this.props

    try {
      this.setState({ loading: true })

      const
        terms = this.splittedTerms.map((term) => ({ term })),
        body = this.makeRequest(dictionary.id, terms, parentId)

      await term.post(body)

      onAdded()

      this.setState({
        terms: '',
        loading: false,
      })
      this.props.notification.notify({
        variant: Notification.SUCCESS,
        message: 'Термины успешно добавлены',
      })
    } catch (error) {
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
    const { termName, dictionary } = this.props

    return (
      <FullSizeInput
        placeholder={this.makePlaceholder(termName, dictionary.placeholderRule)}
        value={this.state.terms}
        name='terms'
        onChange={this.handleChange}>
        <Grid container justify='flex-end'>
          <Grow in={true} timeout={1000}>
            <LoadingFab
              loading={this.state.loading}
              color='secondary'
              disabled={!this.validateTerms}
              onClick={::this.addTerms}>
              <AddIcon />
          </LoadingFab>
        </Grow>
      </Grid>
    </FullSizeInput >
    )
  }
}
