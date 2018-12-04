import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import FullSizeInput from '@app/components/fullsize-input'
import LoadingButton from '@app/components/loading-button'
import Grow from '@material-ui/core/Grow'


@injectStore('term')
@observer
export default class TermAdd extends Component {
  static propTypes = {
    term: PropTypes.object.isRequired,
    dictionaryId: PropTypes.string.isRequired,
    termName: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    onAdded: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  state = {
    terms: '',
  }

  handleChange = ({ target }) => this.setState({
    [target.id]: target.value,
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

      dictionaryId,
      parentId,
      onAdded,
      onError,
    } = this.props

    try {
      const
        terms = this.splittedTerms.map((term) => ({ term })),
        body = this.makeRequest(dictionaryId, terms, parentId)

      await term.post(body)

      onAdded()

      this.setState({
        terms: '',
      })
    } catch (error) {
      onError(error)
    }
  }

  render = () =>
    <FullSizeInput
      placeholder={`Впишите сюда новые термины в столбик для «${this.props.termName}»`}
      value={this.state.terms}
      id='terms'
      onChange={this.handleChange}>
      <Grid container justify='center'>
        <Grow in={true} timeout={1000}>
          <LoadingButton
            loading={false}
            variant='contained'
            color='secondary'
            disabled={!this.validateTerms}
            onClick={::this.addTerms}>
            Добавить термины
        </LoadingButton>
        </Grow>
      </Grid>
    </FullSizeInput>
}
