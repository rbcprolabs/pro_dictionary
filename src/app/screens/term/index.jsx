import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import withRouter from 'react-router/withRouter'
import withStyles from '@material-ui/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import CenteredProgress from '@app/components/centered-progress'
import Typography from '@material-ui/core/Typography'
import CenteredContainer from '@app/components/centered-container'
import Fade from '@material-ui/core/Fade'
import Slide from '@material-ui/core/Slide'
import Notification from '@core/stores/notification'
import { updateByProperty, removeByProperty } from '@core/utils/hooks/array'

import TermHeader from '@app/containers/term-header'
import TermList from '@app/containers/term-list'
import TermAdd from '@app/containers/term-add'
import TermEdit from '@app/containers/term-edit'

const styles = (theme) => ({
  container: {
    height: '100%',
    paddingTop: theme.spacing.unit * 6,
  },
  itemsContainer: {
    overflowY: 'auto',
    borderRight: `1px solid ${theme.palette.divider}`,
    ...theme.mixins.scrollbar,
  },
})

@withRouter
@withStyles(styles)
@injectStore((stores) => ({
  app: stores.app,
  dictionary: stores.dictionary,
  term: stores.term,
  notification: stores.notification,
}))
@observer
export default class Term extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
  }

  search = React.createRef()

  state = {
    /** @type {string[]} */
    three: [],
    /** @type {string} */
    parent: '',
    /** @type {string} */
    termName: '',
    /** @type {string} */
    fullTerm: '',
    dictionary: null,
    items: [],
    editTermData: null,
  }

  prepareRouterData() {
    const
      { match } = this.props,
      dictionaryName = match.params.dictionary,
      terms = match.params.terms ? match.params.terms.split('/') : [],
      three = [dictionaryName, ...terms],
      fullTerm = three.join('/'),
      parent = [].concat(three).splice(0, three.length - 1).join('/') || null,
      termName = three[three.length - 1]

    return {
      dictionaryName,
      three,
      fullTerm,
      parent,
      termName,
    }
  }

  async fetchDataDictionary(dictionaryName, fullTerm) {
    const [ dictionary, items ] = await Promise.all([
      this.handleError(this.props.dictionary.getByName, dictionaryName),
      this.handleError(this.props.term.get, fullTerm),
    ])

    return {
      dictionary,
      items,
    }
  }

  async fetchDataTerm(dictionaryName, parentTerm, fullTerm) {
    const [ dictionary, items, parent ] = await Promise.all([
      this.handleError(this.props.dictionary.getByName, dictionaryName),
      this.handleError(this.props.term.get, fullTerm),
      this.handleError(this.props.term.getByFullTerm, parentTerm, fullTerm),
    ])

    return {
      dictionary,
      items,
      parent,
    }
  }

  async fetchDataFind(dictionaryId, query) {
    return await this.handleError(this.props.term.findAllByDictionary, dictionaryId, query)
  }

  async getData() {
    const {
      dictionaryName,
      three,
      fullTerm,
      parent,
      termName,
    } = this.prepareRouterData()

    const fetchedData = await (parent
      ? this.fetchDataTerm(dictionaryName, parent, fullTerm)
      : this.fetchDataDictionary(dictionaryName, fullTerm))

    if (fetchedData.dictionary)
      this.props.app.setDictionaryId(fetchedData.dictionary.id)

    return {
      three,
      fullTerm,
      parent,
      termName,
      ...fetchedData,
    }
  }

  async updateData() {
    const data = await this.getData()

    if (this.search.current && this.search.current.isOpen)
      this.search.current.cancel()

    this.setState({
      searchItems: null,
      ...data,
    })
  }

  async handleError(apiCall, ...args) {
    try {
      return await apiCall(...args)
    } catch (error) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message: 'Ошибка загрузки терминов',
      })
    }
  }

  componentDidMount() {
    this.updateData()
  }

  componentDidUpdate(prevProps) {
    const locationChanged = this.props.location !== prevProps.location
    if (locationChanged) this.updateData()
  }

  async onAdded() {
    const items = await this.handleError(this.props.term.get, this.state.fullTerm, true)
    this.setState({ items })
  }

  handleEdit = (parent, id) => () => this.setState({ editTermData: {
    parent,
    id,
  }})

  handleEditUpdate(result) {
    const items = this.state.items::updateByProperty('id', result.id, result)
    this.setState({ editTermData: null, items })
  }

  handleEditRemove(id) {
    const items = this.state.items::removeByProperty('id', id)
    this.setState({ editTermData: null, items })
  }

  handleEditCancel() {
    this.setState({ editTermData: null })
  }

  async handleSearch(searchQuery) {
    const searchItems = await this.fetchDataFind(this.state.dictionary.id, searchQuery)
    this.setState({ searchItems, searchQuery })
  }

  handleSearchCencel() {
    this.setState({ searchItems: null, searchQuery: null })
  }

  renderTermList() {
    const
      { dictionary, searchItems, searchQuery } = this.state,
      isSearch = searchItems !== null,
      items = isSearch ? searchItems : this.state.items

    return (!!dictionary && items.length > 0
      ? <TermList
          items={items}
          isSearch={isSearch}
          searchQuery={searchQuery}
          isFlat={dictionary.isFlat}
          onEdit={this.handleEdit}/>
      : <CenteredContainer fullHeight>
          <Typography
            variant='h6'
            align='center'
            color='textSecondary'>
            Пусто
          </Typography>
        </CenteredContainer>
    )
  }

  render() {
    const
      { classes, term, dictionary: dictionaryStore } = this.props,
      { dictionary, three, termName, parent, editTermData, searchItems } = this.state

    if (!dictionary && term.loading || dictionaryStore.loading)
      return (<CenteredProgress fullHeight />)
    else if (!dictionary && !term.loading && !dictionaryStore.loading)
      return (
        <CenteredContainer fullHeight>
          <Typography
            variant='h6'
            align='center'
            color='textSecondary'>
            Словарь не найден
          </Typography>
        </CenteredContainer>
      )

    return (
      <>
        <Slide in timeout={600} direction='down'>
          {three.length > 0 &&
            <TermHeader
              innerRef={this.search}
              items={three}
              loading={term.findLoading}
              onSearch={::this.handleSearch}
              onSearchCancel={::this.handleSearchCencel} /> }
        </Slide>
        <Grid container className={classes.container}>
          <Fade in timeout={600}>
            <Grid item xs={12} md={6} lg={9} xl={9} className={classes.itemsContainer}>
                {term.loading || dictionaryStore.loading
                  ? <CenteredProgress fullHeight />
                  : this.renderTermList()
                }
            </Grid>
          </Fade>
          <Fade in timeout={800}>
            <Grid item xs={12} md={6} lg={3} xl={3}>
              <TermAdd
                dictionary={dictionary}
                termName={termName}
                parentId={parent && parent.id}
                disabled={searchItems && (dictionary.isFlat ? searchItems.length > 0 : true)}
                onAdded={::this.onAdded} />
            </Grid>
          </Fade>
        </Grid>
        <TermEdit
          open={editTermData !== null}
          editData={editTermData}
          onClose={::this.handleEditCancel}
          onUpdate={::this.handleEditUpdate}
          onRemove={::this.handleEditRemove} />
      </>
    )
  }
}
