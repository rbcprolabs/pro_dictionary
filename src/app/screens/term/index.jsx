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
    notification: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
  }

  state = {
    three: [],
    parent: '',
    term: '',
    fullTerm: '',
    dictionary: null,
  }

  async getData() {
    const
      {
        match: {
          params,
        },
        dictionary,
      } = this.props,
      dictionaryName = params.dictionary,
      terms = params.terms ? params.terms.split('/') : [],
      three = [dictionaryName, ...terms],
      fullTerm = three.join('/')

    return {
      three,
      fullTerm,
      parent: [].concat(three).splice(0, three.length - 1).join('/'),
      dictionary: await dictionary.getByName(dictionaryName),
      term: three[three.length - 1],
      items: await this.getTerms(fullTerm),
    }
  }

  getTerms = (fullTerm, loadMore = false) => this.props.term.get(fullTerm, loadMore)

  componentWillMount() {
    this.getData().then((data) => this.setState(data))
  }

  componentDidUpdate(prevProps) {
    const locationChanged = this.props.location !== prevProps.location
    if (locationChanged) this.getData().then((data) => this.setState(data))
  }

  makeTabItems = (items) => items.map((item, index, arr) => {
    let link = '/'

    for (let i = 0; i < index + 1; i++) link += arr[i] + '/'

    return (
      <Grow
        in={true}
        timeout={600 + index * 100}
        key={item}>
        <Tab
          classes={{ root: this.props.classes.tabRoot }}
          label={item} component={Link}
          to={link.slice(0, -1)} />
      </Grow>
    )
  })

  onAdded = () => {
    this.props.notification.notify({
      variant: Notification.SUCCESS,
      message: 'Термины успешно добавлены',
    })
    this.getTerms(this.state.fullTerm, true).then((items) => this.setState({items}))
  }

  onAddError = (error) => {
    console.error(error)
    this.props.notification.notify({
      variant: Notification.ERROR,
      message: 'Ошибка добавления терминов',
    })
  }

  renderAdd(dictionary, children) {
    const
      { classes } = this.props,
      {
        parent,
        term,
        dictionaryName,
        fullTerm,
      } = this.state

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
      {
        classes,
        term,
        dictionary: dictionaryStore,
      } = this.props,
      {
        items = [],
        dictionary,
        three,
      } = this.state

    const content = !!dictionary && items.length > 0
      ? <TermList items={items} isFlat={dictionary.isFlat} />
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
          {term.loading || dictionaryStore.loading || !dictionary
            ? <CenteredProgress fullHeight />
            : this.renderAdd(dictionary.slug, content)
          }
        </Grid>
      </>
    )
  }
}
