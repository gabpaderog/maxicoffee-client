import React from 'react'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div>
      <Header/>
      <Outlet/>
    </div>
  )
}

export default RootLayout