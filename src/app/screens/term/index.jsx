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
import Slide from '@material-ui/core/Slide'
import Notification from '@core/stores/notification'
import threeArray from '@core/utils/threeArray'
import { updateByProperty } from '@core/utils/hooks/array'

import TermList from './list'
import TermAdd from './add'
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
    editFullTerm: null,
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
      app.dictionaryId = fetchedData.dictionary.id

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

  async onAdded() {
    this.props.notification.notify({
      variant: Notification.SUCCESS,
      message: 'Термины успешно добавлены',
    })

    const items = await this.handleError(this.props.term.get, this.state.fullTerm, true)
    this.setState({ items })
  }

  onAddError() {
    this.props.notification.notify({
      variant: Notification.ERROR,
      message: 'Ошибка добавления терминов',
    })
  }

  onEdit = (parent, id) => () => this.setState({ editFullTerm: {
    parent,
    id,
  }})

  onEditSuccess(result) {
    const items = this.state.items::updateByProperty('id', result.id, result)
    this.setState({ editFullTerm: null, items })
  }

  onEditCancel() {
    this.setState({ editFullTerm: null })
  }

  render() {
    const
      {
        classes,
        term,
        dictionary: dictionaryStore,
      } = this.props,
      {
        items = [],
        dictionary,
        three,
        termName,
        parent,
        editFullTerm,
      } = this.state

    const content = !!dictionary && items.length > 0
      ? <TermList items={items} isFlat={dictionary.isFlat} onEdit={this.onEdit} />
      : <CenteredContainer fullHeight>
          <Typography
            variant='h6'
            align='center'
            color='textSecondary'>
            Пусто
          </Typography>
        </CenteredContainer>

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
          {!dictionary
            ? <CenteredProgress fullHeight />
            : <>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={9}
                  xl={9}
                  className={classes.itemsContainer}>
                    {term.loading || dictionaryStore.loading
                      ? <CenteredProgress fullHeight />
                      : content
                    }
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={3}
                  xl={3}>
                  <TermAdd
                    dictionary={dictionary}
                    termName={termName}
                    parentId={parent && parent.id}
                    onAdded={::this.onAdded}
                    onError={::this.onAddError} />
                </Grid>
              </>
          }
        </Grid>
        <TermEdit
          open={editFullTerm !== null}
          editData={editFullTerm}
          onClose={::this.onEditCancel}
          onSuccess={::this.onEditSuccess} />
      </>
    )
  }
}
