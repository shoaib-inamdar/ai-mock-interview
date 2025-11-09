"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { coachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { ConvertTextToSpeech, getToken } from "@/services/GlobalServices";
import { RealtimeTranscriber } from "assemblyai";
import ChatBox from "./_components/ChatBox";
//import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

// ✅ Dynamic import for RecordRTC to prevent SSR issues
const RecordRTCImport = dynamic(() => import("recordrtc"), { ssr: false });

function DiscussionRoom() {
  const { roomid } = useParams();

  // ✅ Convert roomid safely (Convex expects an ID, not a string like "1")
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid ? String(roomid) : undefined,
  });

  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const [audioUrl,setAudioUrl]=useState();
  const recorder = useRef(null);
  const realtimeTranscriber = useRef(null);
  const [conversation, setConversation] = useState([
    { role: "assistant", content: "Hi, I’m your discussion assistant." },
    { role: "user", content: "Hello!" },
  ]);

  let silenceTimeout;

  // ✅ Load expert details safely
  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = coachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      setExpert(Expert || null);
    }
  }, [DiscussionRoomData]);

  const connectToServer = async () => {
    try {
      setEnableMic(true);

      // ✅ Initialize AssemblyAI Realtime
      realtimeTranscriber.current = new RealtimeTranscriber({
        token: await getToken(),
        sample_rate: 16_000,
      });

      realtimeTranscriber.current.on("transcript", async (transcript) => {
        console.log("Transcript:", transcript.text);

        // 🧠 Simulated AI model response (replace with your actual function)
        const lastTwoMsg= conversation.slice(-8);
        const aiResp=await AIModel(
          DiscussionRoomData.topic,
          DiscussionRoomData.coachingOptions,
          lastTwoMsg

        );
        const url =await ConvertTextToSpeech(aiResp.content,DiscussionRoom.expertName);
        console.log(url)
        setAudioUrl(url);
        setConversation(prev => [...prev,aiResp])

      });

      await realtimeTranscriber.current.connect();

      // ✅ Ask for microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const RecordRTCModule = await RecordRTCImport;
      const RecordRTC = RecordRTCModule.default;
      const StereoAudioRecorder = RecordRTCModule.StereoAudioRecorder;

      // ✅ Initialize Recorder
      const recorderInstance = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm;codecs=pcm",
        recorderType: StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: async (blob) => {
          if (!realtimeTranscriber.current) return;
          clearTimeout(silenceTimeout);
          const buffer = await blob.arrayBuffer();
          realtimeTranscriber.current.sendAudio(buffer);
          silenceTimeout = setTimeout(() => {
            console.log("User stopped talking");
          }, 2000);
        },
      });

      recorder.current = recorderInstance;
      recorder.current.startRecording();
    } catch (error) {
      console.error("Error connecting microphone or AI:", error);
      setEnableMic(false);
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
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOptions || "Loading..."}
      </h2>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* -------- Left Section -------- */}
        <div className="lg:col-span-2">
          <div
            className="h-[60vh] bg-secondary border rounded-4xl
            flex flex-col items-center justify-center relative"
          >
            <Image
              src={expert?.avatar || "/default-avatar.png"}
              alt="Avatar"
              width={200}
              height={200}
              className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
            />
            <h2 className="text-gray-500">{expert?.name || "Loading..."}</h2>
            <audio src={audioUrl} type ="audio/mp3" autoplay/>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>

        {/* -------- Right Section -------- */}
        <div>
          <ChatBox conversation={conversation || []} />
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;
