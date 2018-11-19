import React from 'react'
import PropTypes from 'prop-types'
import Hint from '@widget/components/hint'
import Button from '@widget/components/button'

const Auth = ({
  loginWindowIsOpen,
  onClickAuth,
}) =>
  <>
    <Hint>Для использования словаря вам необходимо авторизироваться</Hint>
    {!loginWindowIsOpen
      ? <Button type='primary' onClick={onClickAuth}>Войти</Button>
      : <Hint>Пожалуйста авторизируйтесь в открытом окне</Hint>
    }
  </>

Auth.propTypes = {
  loginWindowIsOpen: PropTypes.bool.isRequired,
  onClickAuth: PropTypes.func,
}

export default Auth
