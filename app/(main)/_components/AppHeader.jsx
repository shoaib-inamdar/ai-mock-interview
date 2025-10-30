import React from 'react'
import Image from 'next/image'
import { UserButton } from '@stackframe/stack'

function AppHeader() {
  return (
    <div className=' w-full p-3  flex justify-between'>
        <Image src={'./logo.svg'} width={160} height={200} alt='logo'/>
        
        <UserButton/>
    </div>
  )
}

export default AppHeader