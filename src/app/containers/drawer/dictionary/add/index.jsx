import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { observer, inject as injectStore } from 'mobx-react'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Divider from '@material-ui/core/Divider'
import Grow from '@material-ui/core/Grow'
import LoadingButton from '@app/components/loading-button'
import Notification from '@core/stores/notification'
import cyrillicToTranslit from '@core/utils/cyrillic-to-translit'
import withDrawerSize from '@app/containers/drawer/withDraweSize'

const styles = (theme) => ({
  container: {
    height: '100%',
    overflow: 'hidden',
  },
  centeredContainer: {
    padding: theme.spacing.unit * 3,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
})

@withDrawerSize('medium')
@withStyles(styles)
@injectStore(({
  dictionary,
  notification,
}) => ({
  dictionary,
  notification,
}))
@observer
export default class DictionaryAdd extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dictionary: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    onBackClick: PropTypes.func.isRequired,
  }

  state = {
    name: '',
    placeholderRule: '',
    isFlat: false,
    isOpen: true,
  }

  _validators = {
    form: () =>
      this.state.name.length >= 2
        && this._validators.name()
        && this._validators.slug()
        && this._validators.placeholderRule(),
    name: () =>
      !this.state.name || /^[а-я ]{1,80}$/gi.test(this.state.name),
    slug: () =>
      !this.state.slug || /^[a-z_]{1,80}$/g.test(this.state.slug),
    placeholderRule: () =>
      !this.state.placeholderRule || /^[а-яa-z0-9 ,.|:_-–—]{1,160}$/gi.test(this.state.placeholderRule),
  }

  validate(target) {
    return this._validators[target]()
  }

  handleChange = ({ target }) => this.setState({
    [target.name]: target.type === 'radio'
      ? target.value === 'true'
      : target.type === 'text'
        ? target.value
        : target.checked
  })

  async handleSubmit(event) {
    event.preventDefault()

    const {
      name,
      slug = cyrillicToTranslit(name, '_').toLowerCase(),
      isFlat,
      isOpen,
      placeholderRule,
    } = this.state

    const body = {
      name,
      slug,
      isFlat,
      ...(() => isFlat && { isOpen })(),
      ...(() => placeholderRule && { placeholderRule })(),
    }

    try {
      await this.props.dictionary.post(body)
      this.props.notification.notify({
        variant: Notification.SUCCESS,
        message: 'Словарь успешно добавлен',
      })
      this.props.onBackClick()
    } catch (error) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message: 'Ошибка добавления словаря',
      })
    }
  }

  render() {
    const
      { classes, onBackClick, dictionary } = this.props,
      { placeholderRule, name, isFlat, isOpen } = this.state,
      slug = typeof this.state.slug === 'string'
        ? this.state.slug
        : cyrillicToTranslit(name, '_').toLowerCase()

    return (
      <Grid
        container
        alignItems='center'
        className={classes.container}
        component='form'
        onSubmit={::this.handleSubmit}>
        <Grid
          container
          spacing={24}
          direction='column'
          className={classes.centeredContainer}>
          <Grid item>
            <Grow in timeout={800}>
              <Typography variant='h5'>
                Добавление словаря
              </Typography>
            </Grow>
          </Grid>
          <Grid item>
            <Grow in timeout={900}>
              <TextField
                error={!::this.validate('name')}
                required
                fullWidth
                name='name'
                label='Название словаря'
                type='text'
                value={name}
                onChange={this.handleChange}
                margin='normal' />
            </Grow>
            <Grow in timeout={1000}>
              <TextField
                error={!::this.validate('slug')}
                required
                fullWidth
                name='slug'
                label='Английская версия без пробелов'
                type='text'
                value={slug}
                onChange={this.handleChange}
                margin='normal' />
            </Grow>
            <Grow in timeout={1100}>
              <TextField
                error={!::this.validate('placeholderRule')}
                fullWidth
                name='placeholderRule'
                label='Пример заполнения'
                type='text'
                value={placeholderRule}
                onChange={this.handleChange}
                margin='normal' />
            </Grow>
          </Grid>
          <Grid item>
            <Grow in timeout={1100}>
              <RadioGroup
                aria-label='Тип'
                name='isFlat'
                value={String(isFlat)}
                onChange={this.handleChange}>
                <FormControlLabel value='false' control={<Radio />} label='Иерархический' />
                <FormControlLabel value='true' control={<Radio />} label='Плоский' />
              </RadioGroup>
            </Grow>
          </Grid>
          {isFlat && (<>
            <Grid item>
              <Grow in timeout={800}>
                <Divider className={classes.divider} />
              </Grow>
            </Grid>
            <Grid item>
              <Grow in timeout={1000}>
                <FormControlLabel
                  name='isOpen'
                  checked={isOpen}
                  value={String(isOpen)}
                  onChange={this.handleChange}
                  control={<Checkbox />}
                  label='Можно добавлять «термин» при классификации' />
              </Grow>
            </Grid>
          </>)}
          <Grid item>
            <Grid
              container
              spacing={16}
              justify='center'>
              <Grid item xs={6}>
                <Grow in timeout={1300}>
                  <Button
                    fullWidth
                    color='secondary'
                    onClick={onBackClick}>
                    Отменить
                </Button>
                </Grow>
              </Grid>
              <Grid item xs={6}>
                <Grow in timeout={1400}>
                  <LoadingButton
                    fullWidth
                    loading={dictionary.loading}
                    variant='contained'
                    color='secondary'
                    type='submit'
                    disabled={!::this.validate('form')}>
                    Добавить
                </LoadingButton>
                </Grow>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
