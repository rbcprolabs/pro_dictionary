import React, { Component } from 'react'
import style from './style.scss'
import Input from '@widget/components/input'
import Button from '@widget/components/button'

export default class TermAdd extends Component {

  render() {
    return (
      <div className={style.TermAdd}>
        <h2>Добавление нового термина</h2>
        <p>Термин</p>
        <Input />
        <div className={style.BottomBar}>
          <Button>Оменить</Button>
          <Button>Добавить термин</Button>
        </div>
      </div>
    )
  }
}
