import React from 'react'
import PropTypes from 'prop-types'
import CenteredContainer from '@widget/components/centered-container'
import Loader from '@widget/components/loader'
import Hint from '@widget/components/hint'

const Init = ({ cantInit }) =>
  <CenteredContainer>
    {!cantInit
      ? <Loader />
      : <Hint>Расширение не может быть инициализировано. Попробуйте перезагрузить страницу</Hint>}
  </CenteredContainer>

Init.propTypes = {
  cantInit: PropTypes.bool,
}

export default Init
