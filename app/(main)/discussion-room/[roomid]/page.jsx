"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/services/GlobalServices";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { RealtimeTranscriber } from "assemblyai";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// const RecordRTC=dynamic(()=>import("recordrtc"),{ssr:false})
import RecordRTC from "recordrtc";

function DiscussionRoom() {
  const { roomid } = useParams();
  //  const DiscussionRoomData=useQuery(api.DiscussionRoom.GetDiscussionRoom,{id:roomid});
  const [expert, setExpert] = useState();
  const [enableMic,setEnableMic]=useState(false);
  const recorder=useRef(null)
  const realtimeTranscriber=useRef(null)
  const [conversation,setConversation]=useState([]);
  const [transcribe,setTranscribe]=useState()
  let silenceTimeout;
  let texts={};

  useEffect(() => {
    const DiscussionRoomData = {
      expertName: "John Doe",
      coachingOption: "AI Mock Interview",
    };
     if (DiscussionRoomData) {
    const Expert = CoachingExpert.find(
      (item) => item.name == DiscussionRoomData.expertName
    );
    console.log(Expert);
    setExpert(Expert);
    }
  }, []);

  const connectToServer =async () => {
    setEnableMic(true);

    realtimeTranscriber.current=new RealtimeTranscriber({
      token:await getToken(),
      sample_rate:16_000
    })

    realtimeTranscriber.current.on('transcript',async(transcript)=>{
      console.log(transcript);
      let msg=''
      if(transcribe.message_type=='FinalTranscript'){
        setConversation(prev=>[...prev,{
          role:'user',
          content:transcript.text
        }])
      }
      texts[transcript.audio_start]=transcript.text;
      const keys=Object.keys(texts)
      keys.sort((a,b)=>a-b);

      for(const key of keys){
        if(texts[key]){
          msg+=`${texts[key]}`
        }
      }
      setTranscribe(msg)
    })

    await realtimeTranscriber.current.connect()

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm",
            recorderType: RecordRTC.StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              if (!realtimeTranscriber.current) return;
              // Reset the silence detection timer on audio input
              clearTimeout(silenceTimeout);
              const buffer = await blob.arrayBuffer();
              console.log(buffer)
              realtimeTranscriber.current.sendAudio(buffer);
              // Restart the silence detection timer
              silenceTimeout = setTimeout(() => {
                console.log("User stopped talking");
                // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
              }, 2000);
            },
          });
          recorder.current.startRecording();
        })
        .catch((err) => console.error(err));
    }
  };

  const disconnect=async(e)=>{
    e.preventDefault();
    if (recorder.current) {
      if (recorder.current.stopRecording) recorder.current.stopRecording();
      else if (recorder.current.stop) recorder.current.stop();
      else console.error("Recorder instance invalid:", recorder.current);
    }    recorder.current=null;
    await realtimeTranscriber.current.close(true);
    setEnableMic(false)
  }
  return (
    <div className="-mt-16">
      <h2 className="text-lg font-bold"> DiscussionRoom</h2>
      <h2 className="text-lg font-bold"></h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div
            className=" h-[60vh] bg-secondary border rounded-4xl flex flex-col
     items-center justify-center relative"
          >
            <Image
              src={expert?.avatar || "/t1.avif"}
              alt="avatar"
              width={200}
              height={200}
              className="h-20 w-20 rounded-full object-cover animate-pulse"
            />
            <h2 className="text-gray-500 mt-2">{expert?.name}</h2>

            <div className="absolute bottom-5 right-5 bg-gray-200 p-3 rounded-lg shadow-md">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
           {!enableMic? <Button onClick={connectToServer}>Connect</Button>
           :
           <Button variant="destructive" onClick={disconnect}>Disconnect</Button>
           }
          </div>
        </div>
        <div>
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            Chat Section
          </div>
          <h2 className="mt-4 text-gray-400 text-sm ">
            At the end of the conversation we will automatically generate
            feedback/notes from your conversation
          </h2>
        </div>
      </div>
      <div className="">
        <h2>{transcribe}</h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;
