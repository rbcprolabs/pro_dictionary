import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/styles/makeStyles'

const useStyles = makeStyles({
  container: {
    height: '100%',
  },
})

const NotFound = () => {
  const classes = useStyles()

  return (
    <Grid
      container
      alignItems='center'
      justify='center'
      className={classes.container}>
      <Grid
        item
        xs={10}
        sm={8}
        lg={6}>
        <Typography
          variant='h4'
          align='center'
          color='textSecondary'>
          Данного раздела на сайте нет
        </Typography>
      </Grid>
    </Grid>
  )
}

export default NotFound
