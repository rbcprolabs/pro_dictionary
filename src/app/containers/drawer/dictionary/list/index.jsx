import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer, inject as injectStore } from 'mobx-react'
import withStyles from '@material-ui/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Link from 'react-router-dom/Link'
import Grow from '@material-ui/core/Grow'
import CenteredProgress from '@app/components/centered-progress'
import { alphabet } from '@core/utils/sort'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ReorderIcon from '@material-ui/icons/Reorder'
import LineStyleIcon from '@material-ui/icons/LineStyle'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import CancelIcon from '@material-ui/icons/Cancel'
import withDrawerSize from '@app/containers/drawer/withDraweSize'

const
  styles = (theme) => ({
    container: {
      padding: theme.spacing.unit * 2,
    },
    offset: {
      margin: `${theme.spacing.unit * 4}px 0`,
    },
    list: {
      maxHeight: '45vh',
      overflowY: 'auto',
      paddingTop: 0,
      paddingBottom: 0,
      ...theme.mixins.scrollbar,
    },
    listItemIcon: {
      marginRight: 0,
      '& svg': {
        fill: '#a7a7a7',
      }
    },
    addButton: {
      height: 42,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    additionalIcon: {
      width: 24,
      marginRight: 0,
      marginLeft: -8,
    },
  }),
  listItemTypographyProp = { align: 'center' }

@withDrawerSize('small')
@withStyles(styles)
@injectStore(({
  app,
  dictionary,
}) => ({
  app,
  dictionary,
}))
@observer
export default class DictionaryList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
    onCreateClick: PropTypes.func,
    onEditClick: PropTypes.func,
  }

  state = {
    edit: false,
  }

  toggleEdit() {
    this.setState({ edit: !this.state.edit })
  }

  componentDidMount() {
    this.props.dictionary.items.length < 1 && this.props.dictionary.getAll()
  }

  sortByAlphabet(a, b) {
    return alphabet(a.name, b.name)
  }

  renderItem({ id, name, isFlat, isOpen = false }, index) {
    const
      { app, classes, onEditClick } = this.props,
      { edit } = this.state

    return (
      <Grow in timeout={1000 + index * 100} key={id}>
        <ListItem button component={Link} to={`/${name}`} selected={id === app.dictionaryId}>
          <ListItemIcon className={classes.listItemIcon}>
            {!isFlat
              ? <LineStyleIcon />
              : <ReorderIcon />}
          </ListItemIcon>
          <ListItemText primary={name} primaryTypographyProps={listItemTypographyProp} />
          {isFlat && !edit
            ? <ListItemIcon className={classNames(classes.listItemIcon, classes.additionalIcon)}>
              {isOpen
                ? <LockOpenIcon />
                : <LockIcon />}
            </ListItemIcon>
            : !edit && <div className={classes.additionalIcon} />
          }
          {edit &&
            <ListItemSecondaryAction>
              <IconButton aria-label='Edit' onClick={onEditClick(id)}>
                <EditIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          }
        </ListItem>
      </Grow>
    )
  }

  render() {
    const { onCreateClick, classes, dictionary } = this.props

    return (
      <Grid container direction='column'>
        <Grid item className={classes.offset}>
          {dictionary.items.length < 1
            ? dictionary.loading
              ? <CenteredProgress />
              : <Grow direction='down' in timeout={1000}>
                  <Typography variant='h6' color='textSecondary' align='center'>
                    Словарей ещё нет
                  </Typography>
                </Grow>
            : <List className={classes.list}>
                {dictionary.items.sort(this.sortByAlphabet).map(::this.renderItem)}
              </List>
          }
        </Grid>
        <Grid item className={classes.container}>
          <Grid container justify='space-between' alignItems='center'>
            <Grow direction='down' in timeout={1200}>
              <Button
                variant='contained'
                color='secondary'
                className={classes.addButton}
                onClick={onCreateClick}>
                <AddIcon className={classes.leftIcon} />
                Добавить
              </Button>
            </Grow>
            <Grow direction='down' in timeout={1300}>
              <Tooltip
                title={`${!this.state.edit ? 'Включить' : 'Выключить'} режим редактирования словарей`}
                aria-label='Редактировать'
                placement='top-end'>
                <IconButton
                  variant='contained'
                  color='secondary'
                  onClick={::this.toggleEdit}>
                  {!this.state.edit
                    ? <EditIcon />
                    : <CancelIcon />}
                </IconButton>
              </Tooltip>
            </Grow>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
