import React from 'react'
import classNames from 'classnames'
import style from './style.scss'

const CubeGrid = ({className, ...props}) =>
  <div className={classNames(style.Loader, className)} {...props}>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
    <div className={style.Cube}/>
  </div>

export default CubeGrid
