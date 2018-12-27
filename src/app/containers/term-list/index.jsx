import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/styles/withStyles'
import Link from 'react-router-dom/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import NestingString from '@app/components/nesting-string'

const styles = (theme) => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemSubTitle: {
    [theme.breakpoints.down('xl')]: {
      maxWidth: 1200,
    },
    [theme.breakpoints.down('lg')]: {
      maxWidth: 600,
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: 400,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 200,
    },
  },
})

function removeDictionaryName(fullTerm) {
  const fulTermSplitted = fullTerm.split('/')
  return fulTermSplitted.slice(1, fulTermSplitted.length)
}

function makeNestingString(fullTerm, searchQuery) {
  return (
    <NestingString
      strings={removeDictionaryName(fullTerm)}
      highlight={searchQuery}
      delimeter=' ➜ '/>
  )
}

const termListItem = (
  { id, term, parent, fullTerm, childrens },
  isSearch,
  searchQuery,
  listItemTypographyProps,
  onEdit,
) =>
  <ListItem key={id} button component={Link} to={`/${fullTerm}`} divider>
    <ListItemText
      primary={!isSearch ? term : makeNestingString(fullTerm, searchQuery)}
      secondary={childrens && childrens.join(', ')}
      secondaryTypographyProps={listItemTypographyProps} />
    <ListItemSecondaryAction>
      <IconButton aria-label='Edit' onClick={onEdit(parent, id)}>
        <EditIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>

termListItem.propTypes = {
  id: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  fullTerm: PropTypes.string.isRequired,
  childrens: PropTypes.arrayOf(PropTypes.string),
}

const termListFlatItem = ({ id, term, parent }, onEdit) =>
  <ListItem key={id} divider>
    <ListItemText primary={term}/>
    <ListItemSecondaryAction>
      <IconButton aria-label='Edit' onClick={onEdit(parent, id)}>
        <EditIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>

termListFlatItem.propTypes = {
  id: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
}

const TermList = ({ classes, isSearch, searchQuery, items, isFlat, onEdit }) => {
  const listItemTypographyProps = ({ noWrap: true, className: classes.itemSubTitle })

  return (
    <List className={classes.list}>
      {!isFlat
        ? items.map((term) => termListItem(term, isSearch, searchQuery, listItemTypographyProps, onEdit))
        : items.map((term) => termListFlatItem(term, onEdit))}
    </List>
  )
}

TermList.propTypes = {
  classes: PropTypes.object.isRequired,
  isSearch: PropTypes.bool,
  searchQuery: PropTypes.string,
  items: PropTypes.array,
  isFlat: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
}

export default withStyles(styles)(TermList)
