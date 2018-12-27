import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/styles/withStyles'
import Link from 'react-router-dom/Link'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import LinearProgress from '@material-ui/core/LinearProgress'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel'
import Grow from '@material-ui/core/Grow'
import threeArray from '@core/utils/threeArray'
import Slide from '@material-ui/core/Slide'

const styles = (theme) => ({
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
  },
  tab: {
    minWidth: 72,
  },
  input: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    color: '#fff',
    height: '100%',
  },
  searchButton: {
    width: 48,
    marginRight: theme.spacing.unit * 2,
  },
  loading: {
    height: 4,
    margintop: -2,
  },
})

@withStyles(styles)
export default class TermHeader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSearch: PropTypes.func.isRequired,
    onSearchCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    innerRef: PropTypes.func,
  }

  state = {
    search: false,
    query: '',
  }

  componentDidMount() {
    if (this.props.innerRef)
      this.props.innerRef(this)
  }
  componentWillUnmount() {
    if (this.props.innerRef)
      this.props.innerRef(undefined)
  }

  handleChange = ({ target }) => this.setState({
    [target.name]: target.value,
  })

  makeTabItems = (items) => items::threeArray(true).map(({ origin, deep }, index) =>
    <Grow in timeout={600 + index * 100} key={deep}>
      <Tab
        classes={{ root: this.props.classes.tab }}
        label={origin} component={Link}
        to={deep} />
    </Grow>
  )

  get isOpen() {
    return this.state.search
  }

  cancel() {
    this.setState({ search: false, query: '' })
  }

  toggleSearch() {
    if (this.state.search)
      this.props.onSearchCancel()

    this.setState({ search: !this.state.search })
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.query.length < 2) return
    this.props.onSearch(this.state.query)
  }

  render() {
    const
      { classes, items, loading } = this.props,
      { search, query } = this.state

    return (
      <AppBar position='absolute'>
        <div className={classes.appBar}>
          {!search
            ? <Slide in direction='down'>
                <Tabs
                  indicatorColor='secondary'
                  value={items.length - 1}
                  scrollable
                  scrollButtons='auto'
                  className={classes.container}>
                  {this.makeTabItems(items)}
                </Tabs>
              </Slide>
            : <form className={classes.container} onSubmit={::this.handleSubmit}>
                <Slide in direction='up'>
                  <InputBase
                    placeholder='Введите искомый термин или его синоним'
                    fullWidth
                    autoFocus
                    name='query'
                    value={query}
                    onChange={this.handleChange}
                    className={classes.input}/>
                </Slide>
              </form>
          }
          <IconButton
            color='inherit'
            className={classes.searchButton}
            onClick={::this.toggleSearch}>
            {!search
              ? <SearchIcon />
              : <CancelIcon />}
          </IconButton>
        </div>
        {loading && <LinearProgress color='secondary' className={classes.loading} />}
      </AppBar>
    )
  }
}
