import React from 'react'
import Typography from '@material-ui/core/Typography'
import Zoom from '@material-ui/core/Zoom'
import CenteredContainer from '@app/components/centered-container'

const Home = () =>
  <CenteredContainer fullHeight>
    <Zoom in={true} timeout={600}>
      <Typography
        variant='h6'
        align='center'
        color='textSecondary'>
        Выберите словарь
      </Typography>
    </Zoom>
  </CenteredContainer>

export default Home
