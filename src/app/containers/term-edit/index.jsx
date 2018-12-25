import React from 'react'
import PropTypes from 'prop-types'
import { inject as injectStore } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import Notification from '@core/stores/notification'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Grow from '@material-ui/core/Grow'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import removeSpaces from '@core/utils/remove-spaces'

const styles = (theme) => ({
  synonymsInput: {
    marginTop: 8,
  },
  synonymsContainer: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  deleteButton: {
    marginRight: 'auto',
    color: '#B71C1C',
  },
  deleteButtonIcon: {
    marginRight: theme.spacing.unit,
  }
})

@withStyles(styles)
@injectStore((stores) => ({
  term: stores.term,
  notification: stores.notification,
}))
export default class TermEdit extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    open: PropTypes.bool,
    editData: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  state = {
    synonyms: [],
    childrens: [],
    term: '',
    synonymsAdd: '',
  }

  componentDidUpdate(prevProps) {
    const fullTermChanged = this.props.editData !== prevProps.editData
    if (fullTermChanged && this.props.editData !== null) this.updateData()
  }

  async updateData() {
    const term = await this.props.term.getById(this.props.editData.parent, this.props.editData.id)
    this.setState({
      synonyms: [],
      childrens: [],
      ...term,
    })
  }

  handleChange = ({ target }) => this.setState({
    [target.name]: target.value,
  })

  removeSynonym = (removableSynonym) => () => {
    this.setState({
      synonyms: this.state.synonyms.filter((synonym) => synonym !== removableSynonym),
    })
  }

  addSynonyms() {
    const
      newSynonyms = this.state.synonymsAdd.split(',')
        .map((synonym) => synonym.toLowerCase()::removeSpaces()),
      synonyms = Array.from(new Set(this.state.synonyms.concat(newSynonyms)))
    this.setState({
      synonymsAdd: '',
      synonyms,
    })
  }

  validate() {
    return this.state.synonymsAdd.length === 0
  }

  async handleSubmit(event) {
    event.preventDefault()

    const body = {
      parent: this.state.parent,
      term: this.state.term,
    }

    if (this.state.childrens.length > 0)
      body.childrens = this.state.childrens

    if (this.state.synonyms.length > 0)
      body.synonyms = this.state.synonyms

    try {
      const result = await this.props.term.update(this.state.id, body)
      this.props.onUpdate(result)
      this.props.notification.notify({
        variant: Notification.SUCCESS,
        message: 'Термин успешно обновлен',
      })
    } catch (error) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message: 'Ошибка обновления термина',
      })
    }
  }

  async removeTerm() {
    try {
      await this.props.term.delete(this.state.parent, this.state.id)
      this.props.onRemove(this.state.id)
      this.props.notification.notify({
        variant: Notification.SUCCESS,
        message: 'Термин успешно удален',
      })
    } catch (error) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message: 'Ошибка удаления термина',
      })
    }
  }

  render() {
    const
      { classes } = this.props,
      { synonyms, term, synonymsAdd } = this.state

    return (
      <Dialog
        fullWidth
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby='form-dialog-title'>
        <Grow in timeout={800}>
          <DialogTitle id='form-dialog-title'>Редактирование термина</DialogTitle>
        </Grow>
        <form onSubmit={::this.handleSubmit}>
          <DialogContent>
              <Grow in timeout={800}>
                <TextField
                  margin='dense'
                  name='term'
                  label='Термин'
                  type='text'
                  value={term}
                  onChange={this.handleChange}
                  fullWidth/>
              </Grow>
              <Grid container spacing={16} className={classes.synonymsContainer}>
                {synonyms.map((synonym, index) =>
                  <Grid item key={index}>
                    <Grow in timeout={1000 + index * 100}>
                      <Chip
                        label={synonym}
                        onDelete={::this.removeSynonym(synonym)} />
                    </Grow>
                  </Grid>
                )}
              </Grid>
              <Grow in timeout={800}>
                <Grid container direction='row'>
                  <Grid item xs>
                    <TextField
                      className={classes.synonymsInput}
                      name='synonymsAdd'
                      placeholder='Синонимы через запятую'
                      type='text'
                      value={synonymsAdd}
                      onChange={this.handleChange}
                      fullWidth/>
                  </Grid>
                  <Grid item>
                    <IconButton aria-label='Добавить' onClick={::this.addSynonyms}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grow>
          </DialogContent>
          <DialogActions>
            <Grow in timeout={1100}>
              <Button
                classes={{root: classes.deleteButton}}
                onClick={::this.removeTerm}>
                <DeleteIcon className={classes.deleteButtonIcon} />
                Удалить термин
              </Button>
            </Grow>
            <Grow in timeout={1200}>
              <Button
                onClick={this.props.onClose}
                color='primary'>
                Отменить
              </Button>
            </Grow>
            <Grow in timeout={1300}>
              <Button
                type='submit'
                color='primary'
                disabled={!this.validate()}>
                Изменить
              </Button>
            </Grow>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}
