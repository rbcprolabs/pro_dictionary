import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import withRouter from 'react-router/withRouter'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Link from 'react-router-dom/Link'
import CenteredProgress from '@app/components/centered-progress'
import Typography from '@material-ui/core/Typography'
import CenteredContainer from '@app/components/centered-container'
import Grow from '@material-ui/core/Grow'
import Fade from '@material-ui/core/Fade'
import Slide from '@material-ui/core/Slide'
import Notification from '@core/stores/notification'
import threeArray from '@core/utils/threeArray'
import { updateByProperty, removeByProperty } from '@core/utils/hooks/array'

import TermList from '@app/containers/term-list'
import TermAdd from '@app/containers/term-add'
import TermEdit from '@app/containers/term-edit'

const styles = (theme) => ({
  nestedStringText: {
    maxWidth: '100%',
  },
  container: {
    height: '100%',
    paddingTop: theme.spacing.unit * 6,
  },
  itemsContainer: {
    overflowY: 'auto',
    borderRight: `1px solid ${theme.palette.divider}`,
    ...theme.mixins.scrollbar,
  },
  whiteText: {
    color: '#fff',
  },
  tabRoot: {
    minWidth: 72,
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

  async getData() {
    const
      { match, app } = this.props,
      dictionaryName = match.params.dictionary,
      terms = match.params.terms ? match.params.terms.split('/') : [],
      three = [dictionaryName, ...terms],
      fullTerm = three.join('/'),
      parent = [].concat(three).splice(0, three.length - 1).join('/') || null

    const fetchedData = await (parent
      ? this.fetchDataTerm(dictionaryName, parent, fullTerm)
      : this.fetchDataDictionary(dictionaryName, fullTerm))

    if (fetchedData.dictionary)
      app.setDictionaryId(fetchedData.dictionary.id)

    return {
      three,
      fullTerm,
      parent,
      termName: three[three.length - 1],
      ...fetchedData,
    }
  }

  async updateData() {
    const data = await this.getData()
    this.setState(data)
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

  onEdit = (parent, id) => () => this.setState({ editTermData: {
    parent,
    id,
  }})

  onEditUpdate(result) {
    const items = this.state.items::updateByProperty('id', result.id, result)
    this.setState({ editTermData: null, items })
  }

  onEditRemove(id) {
    const items = this.state.items::removeByProperty('id', id)
    this.setState({ editTermData: null, items })
  }

  onEditCancel() {
    this.setState({ editTermData: null })
  }

  makeTabItems = (items) => items::threeArray(true).map(({ origin, deep }, index) =>
    <Grow
      in={true}
      timeout={600 + index * 100}
      key={deep}>
      <Tab
        classes={{ root: this.props.classes.tabRoot }}
        label={origin} component={Link}
        to={deep} />
    </Grow>
  )

  renderContent() {
    const {
      items = [],
      dictionary,
    } = this.state

    return (!!dictionary && items.length > 0
      ? <TermList items={items} isFlat={dictionary.isFlat} onEdit={this.onEdit} />
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
      { dictionary, three, termName, parent, editTermData } = this.state

    if (!dictionary && term.loading || dictionaryStore.loading)
      return (<CenteredProgress fullHeight />)
    else if (!dictionary && !dictionaryStore.loading)
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
        {three.length > 0 &&
          <Slide in={true} timeout={600} direction='down'>
            <AppBar position='absolute'>
              <Tabs
                indicatorColor='secondary'
                value={three.length - 1}
                scrollable
                scrollButtons='auto'
                className={classes.whiteText}>
                {this.makeTabItems(three)}
              </Tabs>
            </AppBar>
          </Slide>
        }
        <Grid container className={classes.container}>
          <Fade in={true} timeout={600}>
            <Grid item xs={12} md={6} lg={9} xl={9} className={classes.itemsContainer}>
                {term.loading || dictionaryStore.loading
                  ? <CenteredProgress fullHeight />
                  : this.renderContent()
                }
            </Grid>
          </Fade>
          <Fade in={true} timeout={800}>
            <Grid item xs={12} md={6} lg={3} xl={3}>
              <TermAdd
                dictionary={dictionary}
                termName={termName}
                parentId={parent && parent.id}
                onAdded={::this.onAdded} />
            </Grid>
          </Fade>
        </Grid>
        <TermEdit
          open={editTermData !== null}
          editData={editTermData}
          onClose={::this.onEditCancel}
          onUpdate={::this.onEditUpdate}
          onRemove={::this.onEditRemove} />
      </>
    )
  }
}
