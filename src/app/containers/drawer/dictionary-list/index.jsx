import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject as injectStore } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Link from 'react-router-dom/Link'
import Grow from '@material-ui/core/Grow'
import CenteredProgress from '@app/components/centered-progress'

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
      maxHeight: 400,
      overflowY: 'auto',
      ...theme.mixins.scrollbar,
    },
  }),
  listItemTypographyProp = { align: 'center' }


@withStyles(styles)
@injectStore('dictionary')
@observer
export default class DictionaryList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
    onCreateClick: PropTypes.func,
  }

  componentDidMount() {
    this.props.dictionary.items.length < 1 && this.props.dictionary.getAll()
  }

  dictionariesList = ({ items, className }) =>
    <List className={className}>
      {items.map(({ name, slug }, index) =>
        <Grow in={true} timeout={1000 + index * 100} key={slug}>
          <ListItem button component={Link} to={`/${name}`}>
            <ListItemText primary={name} primaryTypographyProps={listItemTypographyProp} />
          </ListItem>
        </Grow>
      )}
    </List>

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
              : <this.dictionariesList items={dictionary.items} className={classes.list} />
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
