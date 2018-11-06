import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Zoom from '@material-ui/core/Zoom'
import CenteredContainer from 'components/centered-container'

const Home = () =>
  <CenteredContainer fullHeight>
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
  </CenteredContainer>

export default Home
