import React from 'react'
import AppHeader from './_components/AppHeader'

function DashboardLayout({children}) {
  return (
    <div className=''>
      <AppHeader/>
      <div className="p-10 mt-14 md:px-20 lg:px-32 xl:px-56 2xl:px-56">
      {children}
      </div>
      </div>
  )
}

export default DashboardLayout