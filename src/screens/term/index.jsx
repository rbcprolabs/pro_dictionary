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
    overflowY: 'auto',
    paddingTop: theme.spacing.unit * 6,
  },
  itemsContainer: {
    borderRight: `1px solid ${theme.palette.divider}`,
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

  async componentWillMount() {
    const {
      term,
      history,
    } = this.props

    this.data = this.getDataFromURL()

    try {
      const items = await term.get(this.data.fullTerm)
      this.setState({ items })
    } catch (error) {
      history.go('/404')
    }
  }

  async componentDidUpdate(prevProps) {
    const locationChanged = this.props.location !== prevProps.location
    if (locationChanged) {
      this.data = this.getDataFromURL()
      const items = await this.props.term.get(this.data.fullTerm)
      this.setState({ items })
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

  onAdded = async () => {
    this.props.notification.notify({
      variant: Notification.SUCCESS,
      message: 'Термины успешно добавлены',
    })
    const items = await this.props.term.get(this.data.fullTerm, true)
    this.setState({ items })
  }

  onAddError = (error) => {
    console.error(error)
    this.props.notification.notify({
      variant: Notification.ERROR,
      message: 'Ошибка добавления терминов',
    })
  }

  render() {
    const
      { items = [] } = this.state,
      {
        classes,
        term: {
          loading,
        },
      } = this.props,
      {
        three,
        term,
      } = this.data

    return (
      <>
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
        <Grid container className={classes.container}>
          <Grid
            item
            xs={12}
            md={6}
            lg={9}
            xl={10}
            className={classes.itemsContainer}>
            {
              loading
                ? <CenteredProgress fullHeight />
                : items.length > 0
                  ? <TermList items={items} />
                  : <CenteredContainer fullHeight>
                    <Typography
                      variant='h6'
                      align='center'
                      color='textSecondary'>
                      Пусто
                </Typography>
                  </CenteredContainer>
            }
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={3}
            xl={2}>
            <TermAdd
              dictionaryName={this.data.dictionaryName}
              term={term}
              parent={this.data.parent}
              fullTerm={this.data.fullTerm}
              onAdded={this.onAdded}
              onError={this.onAddError} />
          </Grid>
        </Grid>
      </>
    )
  }
}
