import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Zoom from '@material-ui/core/Zoom'

const styles = {
  container: {
    height: '100%',
  },
}

@withStyles(styles)
export default class Home extends Component {
  render() {
    const {
      classes,
    } = this.props

    return (
      <Grid
        container
        alignItems='center'
        justify='center'
        className={classes.container}>
        <Grid
          item
          xs={8}
          sm={6}
          md={4}
          lg={3}
          xl={2}>
          <Zoom in={true} timeout={600} mountOnEnter unmountOnExit>
            <Typography
              variant='h6'
              align='center'
              color='textSecondary'>
              Выберите словарь
            </Typography>
          </Zoom>
        </Grid>
      </Grid>
    )
  }
}
