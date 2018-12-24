import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Link from 'react-router-dom/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'

const
  styles = (theme) => ({
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
  }),
  listItemTypographyPropsPreset = (className) => ({ noWrap: true, className })

const termListItem = ({ id, term, parent, fullTerm, childrens }, listItemTypographyProps, onEdit) =>
  <Fragment key={id}>
    <ListItem button component={Link} to={`/${fullTerm}`}>
      <ListItemText
        primary={term}
        secondary={childrens && childrens.join(', ')}
        secondaryTypographyProps={listItemTypographyProps} />
      <ListItemSecondaryAction>
        <IconButton aria-label='Edit' onClick={onEdit(parent, id)}>
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
  </Fragment>

termListItem.propTypes = {
  id: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  fullTerm: PropTypes.string.isRequired,
  childrens: PropTypes.arrayOf(PropTypes.string),
}

const termListFlatItem = ({ id, term, parent }, onEdit) =>
  <Fragment key={id}>
    <ListItem>
      <ListItemText primary={term}/>
      <ListItemSecondaryAction>
        <IconButton aria-label='Edit' onClick={onEdit(parent, id)}>
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
  </Fragment>

termListFlatItem.propTypes = {
  id: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
}

const TermList = ({ classes, items, isFlat, onEdit }) => {
  const listItemTypographyProps = listItemTypographyPropsPreset(classes.itemSubTitle)

  return (
    <List>
      {!isFlat
        ? items.map((term) => termListItem(term, listItemTypographyProps, onEdit))
        : items.map((term) => termListFlatItem(term, onEdit))}
    </List>
  )
}

TermList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array,
  isFlat: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
}

export default withStyles(styles)(TermList)
