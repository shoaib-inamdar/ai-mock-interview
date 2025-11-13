import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'

function AppHeader() {
    return (
        <div className='p-3 shadow-sm flex justify-between items-center'>
            <Image src = {'/logo.svg'} alt='logo'
            width={200}
            height={30}/>

            <UserButton/>
        </div>
    )
}

export default AppHeader