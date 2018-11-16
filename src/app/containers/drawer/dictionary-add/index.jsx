import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
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

@withStyles(styles)
@injectStore('dictionary')
@injectStore('notification')
@observer
export default class DictionaryAdd extends Component {
  state = {
    name: '',
    isFlat: false,
    isOpen: false,
  }

  validateForm = () => this.state.name.length > 0

  validateName = (value) => /^[а-яА-Я ]+$/g.test(value)
  validateSlug = (value) => /^[a-z_]+$/g.test(value)

  handleChange = ({ target }) => this.setState({
    [target.name]: target.type === 'radio'
      ? target.value === 'true'
      : target.type === 'text'
        ? target.value
        : target.checked
  })

  handleSubmit = async (event) => {
    event.preventDefault()

    const {
      name,
      isFlat,
      isOpen,
      slug = cyrillicToTranslit(name, '_').toLowerCase()
    } = this.state

    try {
      await this.props.dictionary.post({
        name,
        slug,
        isFlat,
        isOpen,
      })
      this.props.notification.notify({
        variant: Notification.SUCCESS,
        message: 'Словарь успешно добавлен',
      })
    } catch (error) {
      this.props.notification.notify({
        variant: Notification.ERROR,
        message: 'Ошибка добавления словаря',
      })
    }

    this.props.onBackClick()
  }

  render() {
    const
      {
        classes,
        onBackClick,
        dictionary: {
          loading,
        },
      } = this.props,
      slug = this.state.slug || cyrillicToTranslit(this.state.name, '_').toLowerCase()

    return (
      <Grid
        container
        alignItems='center'
        className={classes.container}
        component='form'
        onSubmit={this.handleSubmit}>
        <Grid
          container
          spacing={24}
          direction='column'
          className={classes.centeredContainer}>
          <Grid item>
            <Grow in={true} timeout={800}>
              <Typography variant='h5'>
                Добавление словаря
              </Typography>
            </Grow>
          </Grid>
          <Grid item>
            <Grow in={true} timeout={900}>
              <TextField
                error={!!this.state.name && !this.validateName(this.state.name)}
                required
                fullWidth
                name='name'
                label='Название словаря'
                type='text'
                value={this.state.name}
                onChange={this.handleChange}/>
            </Grow>
            <Grow in={true} timeout={1000}>
              <TextField
                error={!!slug && !this.validateSlug(slug)}
                required
                fullWidth
                name='slug'
                label='Английская версия без пробелов'
                type='text'
                value={slug}
                onChange={this.handleChange}
                margin='normal' />
            </Grow>
          </Grid>
          <Grid item>
            <Grow in={true} timeout={1100}>
              <RadioGroup
                aria-label='Тип'
                name='isFlat'
                value={String(this.state.isFlat)}
                onChange={this.handleChange}>
                <FormControlLabel value='false' control={<Radio />} label='Иерархический' />
                <FormControlLabel value='true' control={<Radio />} label='Плоский' />
              </RadioGroup>
            </Grow>
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item>
            <Grow in={true} timeout={1200}>
              <FormControlLabel
                name='isOpen'
                checked={this.state.isOpen}
                value={String(this.state.isOpen)}
                onChange={this.handleChange}
                control={<Checkbox />}
                label='Можно добавлять «термин» при классификации' />
            </Grow>
          </Grid>
          <Grid item>
            <Grid
              container
              spacing={16}
              justify='center'>
              <Grid item xs={6}>
                <Grow in={true} timeout={1300}>
                  <Button
                    fullWidth
                    color='secondary'
                    onClick={onBackClick}>
                    Отменить
                </Button>
                </Grow>
              </Grid>
              <Grid item xs={6}>
                <Grow in={true} timeout={1400}>
                  <LoadingButton
                    fullWidth
                    loading={loading}
                    variant='contained'
                    color='secondary'
                    type='submit'
                    disabled={!this.validateForm}>
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
