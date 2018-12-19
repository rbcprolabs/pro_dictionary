import React from 'react'
import classNames from 'classnames'
import style from './style.scss'

const Circle = ({className, ...props}) =>
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='60'
    height='60'
    className={classNames(style.Loader, className)}
    {...props}>
    <path d='M10 30a20 20 0 0 0 20 20' />
    <path d='M30 10a20 20 0 0 0-20 20' />
    <path d='M50 30a20 20 0 0 0-20-20' />
  </svg>


export default Circle
