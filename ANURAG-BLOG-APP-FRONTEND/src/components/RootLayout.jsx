import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import Footer from './Footer'
import { pageBackground } from '../styles/common'

function RootLayout() {
  return (
    <div className={pageBackground}>
        <Header/>
        <div className='min-h-screen'>
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout