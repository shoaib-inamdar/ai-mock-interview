import React, { useContext } from 'react'
import { UserContext } from '@/app/_context/UserContext';
import Image from 'next/image';
import { useUser } from '@stackframe/stack';


function Credits() {

    const {userData} = useContext(UserContext);
    const user = useUser();
  return (
    <div>
        <div className='flex gap-5 items-center'>
            <Image src={user?.profileImageUrl} alt='user' width={60} height={60}
            className='rounded-full'></Image>
            <div>
              <h2 className='text-lg font-bold'>{user?.displayName}</h2>
              <h2 className='text-gray-500'>{user?.primaryEmail}</h2>

            </div>
        </div>
        <hr className='my-3'></hr>
        
    </div>
  )
}
export default Credits;