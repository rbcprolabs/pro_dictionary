import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer, inject as injectStore } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Link from 'react-router-dom/Link'
import Grow from '@material-ui/core/Grow'
import CenteredProgress from '@app/components/centered-progress'
import { alphabet } from '@core/utils/sort'
import LineStyle from '@material-ui/icons/LineStyle'
import Reorder from '@material-ui/icons/Reorder'
import Lock from '@material-ui/icons/Lock'
import LockOpen from '@material-ui/icons/LockOpen'

const
  styles = (theme) => ({
    root: {
      marginTop: theme.spacing.unit * 6,
    },
    container: {
      padding: theme.spacing.unit * 3,
    },
    offset: {
      margin: `${theme.spacing.unit * 4}px 0`,
    },
    list: {
      maxHeight: '45vh',
      overflowY: 'auto',
      ...theme.mixins.scrollbar,
    },
    listItemIcon: {
      '& svg': {
        fill: '#a7a7a7',
      }
    },
    additionalIcon: {
      width: 24,
      marginRight: 0,
      marginLeft: 16,
    },
  }),
  listItemTypographyProp = { align: 'center' }

@withStyles(styles)
@injectStore((stores) => ({
  app: stores.app,
  dictionary: stores.dictionary,
}))
@observer
export default class DictionaryList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
    onCreateClick: PropTypes.func,
  }

  componentDidMount() {
    this.props.dictionary.items.length < 1 && this.props.dictionary.getAll()
  }

  sortByAlphabet(a, b) {
    return alphabet(a.name, b.name)
  }

  dictionariesList(items, className) {
    const { app, classes } = this.props

    return (
      <List className={className}>
        {items.sort(this.sortByAlphabet).map(({ id, name, isFlat, isOpen = false }, index) =>
          <Grow in={true} timeout={1000 + index * 100} key={id}>
            <ListItem button component={Link} to={`/${name}`} selected={id === app.dictionaryId}>
              <ListItemIcon className={classes.listItemIcon}>
                {!isFlat
                  ? <LineStyle />
                  : <Reorder/>}
              </ListItemIcon>
              <ListItemText primary={name} primaryTypographyProps={listItemTypographyProp} />
              {isFlat
                ? <ListItemIcon className={classNames(classes.listItemIcon, classes.additionalIcon)}>
                    {isOpen
                      ? <LockOpen />
                      : <Lock />}
                  </ListItemIcon>
                : <div className={classes.additionalIcon} />
              }
            </ListItem>
          </Grow>
        )}
      </List>
    )
  }

  render() {
    const {
      onCreateClick,
      classes,
      dictionary,
    } = this.props

    return (
      <Grid container direction='column' className={classes.root}>
        <Grid item className={classes.container}>
          <Grow direction='down' in={true} timeout={600} mountOnEnter unmountOnExit>
            <TextField
              fullWidth
              id='search'
              label='Поиск терминов'
              type='text' />
          </Grow>
        </Grid>
        <Grid item className={classes.offset}>
          {
            dictionary.items.length < 1
              ? dictionary.loading
                ? <CenteredProgress />
                : <Grow direction='down' in={true} timeout={1000} mountOnEnter unmountOnExit>
                  <Typography variant='h6' color='textSecondary' align='center'>
                    Словарей ещё нет
                    </Typography>
                </Grow>
              : this.dictionariesList(dictionary.items, classes.list)
          }
        </Grid>
        <Grid item className={classes.container}>
          <Grid container justify='center'>
            <Grow direction='down' in={true} timeout={700} mountOnEnter unmountOnExit>
              <Button
                variant='contained'
                color='secondary'
                onClick={onCreateClick}>
                Добавить словарь
              </Button>
            </Grow>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
