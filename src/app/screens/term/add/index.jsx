import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import FullSizeInput from '@app/components/fullsize-input'
import LoadingButton from '@app/components/loading-button'
import Grow from '@material-ui/core/Grow'


@injectStore(stores => ({
  term: stores.term,
}))
@observer
export default class TermAdd extends Component {
  static propTypes = {
    term: PropTypes.object.isRequired,
    dictionaryName: PropTypes.string,
    dictionaryId: PropTypes.string.isRequired,
    termName: PropTypes.string.isRequired,
    parent: PropTypes.string,
    fullTerm: PropTypes.string.isRequired,
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

  makeRequest(dictionaryId, terms) {
    const body = {
      dictionaryId,
    }

    if (terms.length === 1)
      body.term = terms[0].term
    else
      body.terms = terms

    // if (parent && fullTerm !== dictionaryName) {
    //   body.parent = parent
    //   body.term = term
    // }

    return body
  }

  addTerms = async () => {
    const {
      term,

      // dictionaryName,
      dictionaryId,
      // termName,
      // parent,
      // fullTerm,
      onAdded,
      onError,
    } = this.props

    try {
      const
        terms = this.splittedTerms.map((term) => ({ term })),
        body = this.makeRequest(dictionaryId, terms)

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
            onClick={this.addTerms}>
            Добавить термины
        </LoadingButton>
        </Grow>
      </Grid>
    </FullSizeInput>

}
