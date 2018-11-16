import React from 'react'
import Hint from '@widget/components/hint'
import Button from '@widget/components/button'

export default ({
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
