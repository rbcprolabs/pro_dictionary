import React from 'react'
import style from './style.scss'

const Loader = () =>
  <svg width='60' height='60' className={style.Loader} xmlns='http://www.w3.org/2000/svg'>
    <path d='M10 30a20 20 0 0 0 20 20' />
    <path d='M30 10a20 20 0 0 0-20 20' />
    <path d='M50 30a20 20 0 0 0-20-20' />
  </svg>


export default Loader
