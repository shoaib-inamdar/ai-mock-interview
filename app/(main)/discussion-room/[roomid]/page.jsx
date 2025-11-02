'use client'

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import { UserButton } from '@stackframe/stack';


import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'



function DiscussionRoom() {
    const {roomid}=useParams();
   //const DiscussionRoomData=useQuery(api.DiscussionRoom.getDiscussionRoom,{id:roomid});
   const [expert,setExpert]=useState();


   useEffect(() => {
     const DiscussionRoomData = {
      expertName: 'John Doe',
      coachingOption: 'AI Mock Interview',
    };
   // if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name ==DiscussionRoomData.expertName
      )
      console.log(Expert)
      setExpert(Expert);
    //}
  }, [])//


  return (


    <div className='-mt-16'>
       
        <h2 className='text-lg font-bold'> DiscussionRoom</h2>
        <h2 className='text-lg font-bold'>
            
        </h2>
 <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
  <div className='lg:col-span-2'> 
  <div className=' h-[60vh] bg-secondary border rounded-4xl flex flex-col
     items-center justify-center relative'>
       
    <Image 
      src={expert?.avatar || '/t1.avif'} 
      alt='avatar' 
      width={200} 
      height={200}
      className='h-[80px] w-[80px] rounded-full object-cover animate-pulse' 
    />
    <h2 className='text-gray-500 mt-2'>{expert?.name}</h2>

    
    <div className='absolute bottom-5 right-5 bg-gray-200 p-3 rounded-lg shadow-md'>
      <UserButton />
    </div>
  </div>
  <div className='mt-5 flex items-center justify-center'>
    <Button>Connect</Button>
  </div>
</div>
  <div >
  <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative'>
    Chat Section
  </div>
  <h2 className='mt-4 text-gray-400 text-sm '>
    At the end of the conversation we will automatically generate feedback/notes from your conversation 
  </h2>
  </div>
</div>

</div> 
    
  )
}

export default DiscussionRoom