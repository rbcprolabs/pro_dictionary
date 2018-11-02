import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import withRouter from 'react-router/withRouter'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import LoadingButton from 'components/loading-button'
import FullSizeInput from 'components/fullsize-input'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Link from 'react-router-dom/Link'
import CenteredProgress from 'components/centered-progress'
import Typography from '@material-ui/core/Typography'
import CenteredContainer from 'components/centered-container'

const
  styles = (theme) => ({
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
    itemSubTitle: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
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
@injectStore('term')
@observer
export default class Term extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  listItemTypographyProps = { noWrap: true, className: this.props.classes.itemSubTitle }

  state = {
    items: [],
  }

  getDataFromURL() {
    const
      {
        match,
      } = this.props,
      { params } = match,
      dictionary = params.dictionary,
      terms = params.terms ? params.terms.split('/') : [],
      three =  [dictionary, ...terms]

    return {
      three,
      fullTerm: three.join('/'),
      term: three[three.length - 1],
    }
  }

  componentWillMount() {
    const { term } = this.props

    this.data = this.getDataFromURL()

    // console.log(match, this.props.location, this.props.history)

    term.get(this.data.fullTerm).then((items) => this.setState({ items }))
  }

  componentDidUpdate(prevProps) {
    const locationChanged = this.props.location !== prevProps.location
    if (locationChanged) {
      this.data = this.getDataFromURL()
      this.props.term.get(this.data.fullTerm).then((items) => this.setState({ items }))
    }
  }

  renderList = (items) =>
    <List>
      {items.map(({term, children}) =>
        <Fragment key={term}>
          <ListItem button component={Link} to={`/${this.data.fullTerm}/${term}`}>
            <ListItemText
              primary={term}
              secondary={children && children.join(', ')}
              secondaryTypographyProps={this.listItemTypographyProps}/>
            <ListItemSecondaryAction>
              <IconButton aria-label='Edit'>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider/>
        </Fragment>
      )}
    </List>

  makeTabItems = (items) => items.map((item, index, arr) => {

    let link = '/'

    for(let i = 0; i < index + 1; i++) {
      link += arr[i] + '/'
      console.log(item, arr[i])
    }

    return (<Tab classes={{root: this.props.classes.tabRoot}} key={item} label={item} component={Link} to={link.slice(0, -1)}/>)
  })

  render() {
    const
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

    console.log(three, this.state.items)

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
          <Grid container>
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
                  : this.state.items.length > 0
                    ? this.renderList(this.state.items)
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
              <FullSizeInput
                placeholder={`Впишите сюда новые термины в столбик для «${term}»`}>
                <Grid container justify='center'>
                  <LoadingButton
                    loading={false}
                    variant='contained'
                    color='secondary'>
                    Добавить термины
                  </LoadingButton>
                </Grid>
              </FullSizeInput>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }
}
