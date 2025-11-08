"use client"
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { coachingExpert } from '@/services/Options';
import { UserButton } from '@stackframe/stack';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { getToken } from '@/services/GlobalServices';
import { RealtimeTranscriber } from 'assemblyai';

// import RecordRTC from 'recordrtc';
// const RecordRTC = dynamic(()=>import("recordrtc"),{ssr:false});

function DiscussionRoom() {
    const {roomid}=useParams();
    const DiscussionRoomData=useQuery(api.DiscussionRoom.GetDiscussionRoom,{id:roomid});
    console.log(DiscussionRoomData);
    const [expert,setExpert]=useState();
    const [enableMic,setEnableMic]=useState(false);
    const recorder=useRef(null)
    const realtimeTranscriber=useRef(null);
    let silenceTimeout;
    useEffect(()=>{
        if(DiscussionRoomData){
            const Expert=coachingExpert.find(item=>item.name==DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    },[DiscussionRoomData])

const connectToServer = async () => {
  setEnableMic(true);

   //Init asssembly AI
   realtimeTranscriber.current=new RealtimeTranscriber({
    token:await getToken(),
    sample_rate: 16_000
   })

   realtimeTranscriber.current.on('transcript',async(transcript)=>{
    console.log(transcript);
   })

  await realtimeTranscriber.current.connect();

  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // ✅ Dynamically import RecordRTC
      const RecordRTCModule = await import('recordrtc');
      const RecordRTC = RecordRTCModule.default;
      const StereoAudioRecorder = RecordRTCModule.StereoAudioRecorder;

      // ✅ Create the recorder instance
      const recorderInstance = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        recorderType: StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: async (blob) => {
          if(!realtimeTranscriber.current) return;
          clearTimeout(silenceTimeout);
          const buffer = await blob.arrayBuffer();
          console.log(buffer);
          realtimeTranscriber.current.sendAudio(buffer)
          silenceTimeout = setTimeout(() => {
            console.log('User stopped talking');
          }, 2000);
        }
      });

      // ✅ Save and start
      recorder.current = recorderInstance;
      recorder.current.startRecording();

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }
};

const disconnect = async (e) => {
  e.preventDefault();

  if (realtimeTranscriber.current) {
    await realtimeTranscriber.current.close();
    realtimeTranscriber.current = null;
  }

  if (recorder.current) {
    recorder.current.pauseRecording();
    recorder.current = null;
  }

  setEnableMic(false);
};
  return (
    <div className='-mt-12'>
        <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOptions}</h2>
        <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
            
            <div className='lg:col-span-2'>
            <div className='h-[60vh] bg-secondary border rounded-4xl
            flex flex-col items-center justify-center relative
            '>
                <Image src={expert?.avatar || "/default-avatar.png"} alt='Avatar' width={200} height={200}
                className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'
                />
                <h2 className='text-gray-500'>{expert?.name}</h2>
                <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
                    <UserButton/>
                </div>
            </div>
            <div className='mt-5 flex items-center justify-center'>
            {!enableMic ?<Button onClick={connectToServer}>Connect</Button>
            :
            <Button variant="destructive" onClick={disconnect}>Disconnect</Button>}
            </div>
            </div>
             <div>
            <div className='h-[60vh] bg-secondary border rounded-4xl
            flex flex-col items-center justify-center relative
            '>
                <h2>Chat Section</h2>
            </div>
            <h2 className='mt-4 text-grey-400 text-sm'>
                At the end of youe conversation we will automatically generate feedback/notes from your conversation
            </h2>
             </div>
        </div>
    </div>
  )
}

export default DiscussionRoom