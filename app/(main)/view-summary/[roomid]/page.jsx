"use client"
import React from 'react'
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { ExpertsList } from '@/services/Options';
import moment from 'moment';
import ChatBox from '../../discussion-room/[roomid]/_components/ChatBox';
import SummeryBox from '../_components/SummeryBox';




function ViewSummary() {

    const {roomid} = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
        id: roomid,
      });

      const GetAbstractImages=(option)=>{
        const coachingOption = ExpertsList.find((item)=>item.name==option);
        return coachingOption?.abstract ?? '/ab1.png';
    }


    return (
        <div className='-mt-10'>
            <div className='flex justify-between items-end'>
           <div className='flex items-center gap-7 mb-3'>
            <Image src={GetAbstractImages(DiscussionRoomData?.coachingOption)} alt='abstract' width={100} height={100} className='w-[70px] h-[70px] rounded-full'></Image>
            <div >
                            <h2 className='font-bold text-lg'>{DiscussionRoomData?.topic}</h2>
                            <h2 className='text-gray-400'>{DiscussionRoomData?.coachingOption}</h2>
                            
                        </div>
           </div>
           <h2 className='text-gray-400 mb-3'>{moment(DiscussionRoomData?._creationTime).fromNow()}</h2>
           </div>

           <div className='grid grid-cols-1 lg:grid-cols-5 gap-5'>
                <div className='col-span-3'>
                    <h2 className='text-lg font-bold mb-6'>Summery of Your Conversation</h2>
                    <SummeryBox summary={DiscussionRoomData?.summary}/>
                </div>
                <div className='col-span-2'>
                <h2 className='text-lg font-bold mb-6'>Your Conversation</h2>
                {DiscussionRoomData?.conversation&&<ChatBox conversation={DiscussionRoomData?. conversation}
                coachingOption={DiscussionRoomData?.coachingOption}
                enableFeedbackNotes={false}
                />}
                </div>
                </div>






        </div>
    )
}

export default ViewSummary
