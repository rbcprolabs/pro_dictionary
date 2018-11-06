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
import CenteredProgress from 'components/centered-progress'
import Typography from '@material-ui/core/Typography'
import CenteredContainer from 'components/centered-container'
import Grow from '@material-ui/core/Grow'
import Notification from 'stores/notification'

import TermList from './list'
import TermAdd from './add'

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
@injectStore('notification')
@injectStore('dictionary')
@injectStore('term')
@observer
export default class Term extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {}

  getDataFromURL() {
    const
      { match } = this.props,
      { params } = match,
      dictionaryName = params.dictionary,
      terms = params.terms ? params.terms.split('/') : [],
      three = [dictionaryName, ...terms]

    return {
      three,
      fullTerm: three.join('/'),
      parent: [].concat(three).splice(0, three.length - 1).join('/'),
      dictionaryName,
      term: three[three.length - 1],
    }
  }

  componentWillMount() {
    this.data = this.getDataFromURL()
    this.getTerms()
  }

  getTerms = async (loadMore = false) => {
    const items = await this.props.term.get(this.data.fullTerm, loadMore)
    this.setState({ items })
  }

  componentDidUpdate(prevProps) {
    const locationChanged = this.props.location !== prevProps.location
    if (locationChanged) {
      this.data = this.getDataFromURL()
      this.getTerms()
    }
  }

  makeTabItems = (items) => items.map((item, index, arr) => {
    let link = '/'

    for (let i = 0; i < index + 1; i++) {
      link += arr[i] + '/'
    }

    return (
      <Grow in={true} timeout={600 + index * 100} key={item}>
        <Tab classes={{ root: this.props.classes.tabRoot }} label={item} component={Link} to={link.slice(0, -1)} />
      </Grow>
    )
  })

  onAdded = () => {
    this.props.notification.notify({
      variant: Notification.SUCCESS,
      message: 'Термины успешно добавлены',
    })
    this.getTerms(true)
  }

  onAddError = (error) => {
    console.error(error)
    this.props.notification.notify({
      variant: Notification.ERROR,
      message: 'Ошибка добавления терминов',
    })
  }

  withAdd (dictionary, children) {
    const
      {
        classes,
      } = this.props,
      {
        parent,
        term,
        dictionaryName,
        fullTerm,
      } = this.data

    return (
      <>
        <Grid
          item
          xs={12}
          md={6}
          lg={9}
          xl={10}
          className={classes.itemsContainer}>
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          xl={2}>
          <TermAdd
            dictionaryName={dictionaryName}
            dictionary={dictionary}
            term={term}
            parent={parent}
            fullTerm={fullTerm}
            onAdded={this.onAdded}
            onError={this.onAddError} />
        </Grid>
      </>
    )
  }

  render() {
    const
      { items = [] } = this.state,
      {
        classes,
        term,
        dictionary: dictionaryStore,
      } = this.props
    let dictionary = null

    if (!dictionaryStore.loading)
      dictionary = dictionaryStore.items.find(({ name }) =>
        this.data.dictionaryName == name
      )

    const content = items.length > 0
        ? <TermList items={items} />
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
        <AppBar position='absolute'>
          <Tabs
            indicatorColor='secondary'
            value={this.data.three.length - 1}
            scrollable
            scrollButtons='auto'
            className={classes.whiteText}>
            {this.makeTabItems(this.data.three)}
          </Tabs>
        </AppBar>
        <Grid container className={classes.container}>
          {
            term.loading || dictionaryStore.loading
              ? <CenteredProgress fullHeight />
              : dictionary.isOpen
                ? this.withAdd(dictionary.slug, content)
                : content
          }
        </Grid>
      </>
    )
  }
}
