"use client"
import { UserContext } from '@/app/_context/UserContext';
import { useConvex } from 'convex/react';
import React, { useContext, useEffect, useState } from 'react'
import { api } from '@/convex/_generated/api';
import { ExpertsList } from '@/services/Options';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import Link from 'next/link';

function History() {

    const {userData} = useContext(UserContext);
    const convex = useConvex();
    const [discussionRoomList,setDiscussionRoomList] = useState([]);


    useEffect(()=>{
        userData && GetDiscussionRooms();
    },[userData]);



    const GetDiscussionRooms=async()=>{
        const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom,{
            uid:userData?._id
        })

        console.log(result);
        setDiscussionRoomList(result);
    }

    const GetAbstractImages=(option)=>{
        const coachingOption = ExpertsList.find((item)=>item.name==option);
        return coachingOption?.abstract;
    }




    return (
        <div>
            <h2 className='font-bold text-xl'>Your Prevoius Lectures</h2>

            {discussionRoomList?.length==0&&<h2 className='text-gray-400'>you dont have any previous sessions</h2>}


            <div className='mt-5'>
                {discussionRoomList?.map((item,index)=> (item.coachingOption=='Topic Base Lecture'||item.coachingOption=='Learn Language'||item.coachingOption=='Meditation')&&(
                    <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'> 
                        <div className='items-center flex gap-7'>
                            <Image src={GetAbstractImages(item.coachingOption)} alt='abstract' width={50} height={50} className='rounded-full w-10 h-10' />
                           

                        <div>
                            <h2 className='font-bold'>{item.topic}</h2>
                            <h2 className='text-gray-400'>{item.coachingOption}</h2>
                            <h2 className='text-gray-400 text-sm'>{moment(item._creationTime).fromNow()}</h2>
                            



                        </div>
                        </div>
                        <Link href={'/view-summary/'+item._id}> 
                        <Button variant={'outline'} className='invisible group-hover:visible'>View Feedback</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>


    )
}

export default History