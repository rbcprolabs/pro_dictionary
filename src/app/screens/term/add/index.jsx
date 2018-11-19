import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import Grid from '@material-ui/core/Grid'
import FullSizeInput from '@app/components/fullsize-input'
import LoadingButton from '@app/components/loading-button'
import Grow from '@material-ui/core/Grow'


@injectStore(stores => ({
  termStore: stores.term,
}))
@observer
export default class TermAdd extends Component {
  static propTypes = {
    termStore: PropTypes.object.isRequired,
    dictionaryName: PropTypes.string,
    dictionary: PropTypes.string.isRequired,
    term: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
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

  validateTerms = () => this.state.terms.length > 0 && this.state.terms.split(/\r|\n/).length < 25

  addTerms = async () => {
    const {
      termStore,

      dictionaryName,
      dictionary,
      term,
      parent,
      fullTerm,
      onAdded,
      onError,
    } = this.props

    try {
      const body = {
        dictionary,
        items: this.state.terms.split(/\r|\n/).map((term) => ({ term }))
      }

      if (fullTerm !== dictionaryName) {
        body.parent = parent
        body.term = term
      }

      await termStore.post(body);

      (typeof onAdded === 'function') && onAdded()
      this.setState({
        terms: '',
      })
    } catch (error) {
      (typeof onError === 'function') && onError(error)
    }
  }

  render() {

    return (
      <FullSizeInput
        placeholder={`Впишите сюда новые термины в столбик для «${this.props.term}»`}
        value={this.state.terms}
        id='terms'
        onChange={this.handleChange}>
        <Grid container justify='center'>
          <Grow in={true} timeout={1000}>
            <LoadingButton
              loading={false}
              variant='contained'
              color='secondary'
              disabled={!this.validateTerms()}
              onClick={this.addTerms}>
              Добавить термины
          </LoadingButton>
          </Grow>
        </Grid>
      </FullSizeInput>
    )
  }

}
