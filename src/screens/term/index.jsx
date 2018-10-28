import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
export default class Term extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const
      {
        classes,
        match,
      } = this.props,
      { params } = match,
      dictionary = params.dictionary,
      terms = params.terms ? params.terms.split('/') : [],
      three = [dictionary, ...terms],
      concatedThree = three.join('/')


    console.log(match, this.props.location, this.props.history)

    console.log(three, three.join('/'))

    return (
      <>
        <AppBar position='absolute'>
          <Tabs
            indicatorColor='secondary'
            value={three.length - 1}
            scrollable
            scrollButtons='auto'
            className={classes.whiteText}>
            {
              three.map((item, index) =>
                <Tab classes={{root: classes.tabRoot}} key={item+index} label={item} />
              )
            }
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
              <List>
                <ListItem button component={Link} to={`/${concatedThree}/eat`}>
                  <ListItemText
                    primary='Продукты питания'
                    secondary='Свежие, Замороженные, Маринованные, Консервы, Соленые, Сушеные, Полуфабрикаты, Овощи, Зелень, Грибы…'
                    secondaryTypographyProps={{ noWrap: true, className: classes.itemSubTitle }}/>
                  <ListItemSecondaryAction>
                    <IconButton aria-label='Edit'>
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button component={Link} to={`/${concatedThree}/conservi`}>
                  <ListItemText primary='Маринованные' />
                </ListItem>
                <Divider />
              </List>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={3}
              xl={2}>
              <FullSizeInput
                placeholder='Впишите сюда новые термины в столбик для «Кукуруза»'>
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
