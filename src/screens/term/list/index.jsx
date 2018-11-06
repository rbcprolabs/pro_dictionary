import React from 'react'
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
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
  }),
  listItemTypographyPropsPreset = (className) => ({ noWrap: true, className })

const TermListItem = ({ term, fullTerm, children, listItemTypographyProps }) =>
  <>
    <ListItem button component={Link} to={`/${fullTerm}`}>
      <ListItemText
        primary={term}
        secondary={children && children.join(', ')}
        secondaryTypographyProps={listItemTypographyProps} />
      <ListItemSecondaryAction>
        <IconButton aria-label='Edit'>
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
  </>

TermListItem.propTypes = {
  term: PropTypes.string.isRequired,
  fullTerm: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.string),
  listItemTypographyProps: PropTypes.object.isRequired,
}

const TermList = ({ items, classes }) => {
  const listItemTypographyProps = listItemTypographyPropsPreset(classes.itemSubTitle)

  return (
    <List>
      {items.map(({ fullTerm, term, children }) =>
        <TermListItem
          key={term}
          term={term}
          fullTerm={fullTerm}
          children={children}
          listItemTypographyProps={listItemTypographyProps} />
      )}
    </List>
  )
}

TermList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array,
}

export default withStyles(styles)(TermList)
