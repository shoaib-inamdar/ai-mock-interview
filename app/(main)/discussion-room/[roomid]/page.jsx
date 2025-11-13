"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Options";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { AIModel, getToken, ConvertTextToSpeech } from "@/services/GlobalServices";
import { Loader2Icon } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import { UserContext } from '@/app/_context/UserContext';
import Webcam from "react-webcam";

let RecordRTC;

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });

  const [audioUrl, setAudioUrl] = useState(null);
  const [expert, setExpert] = useState();
  const [enabled, setEnabled] = useState(false);
  const recorder = useRef(null);
  const [transcribe, setTranscribe] = useState();
  const socket = useRef(null);
  const updateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const updateUserToken = useMutation(api.users.UpdateUserToken);
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
  const {userData,setUserdata}=useContext(UserContext);

  
  let silenceTimeout;
  const [conversation, setConversation] = useState([{
    role: "assistant",
    content: "Hello"
  },
  {
    role: "user",
    content: "Hello"
  }]);
  const [loading, setLoading] = useState(false);

  // --- AI Rate Limiting and Batching ---
  const aiRequestQueue = useRef([]); // Queue for pending user utterances
  const aiRequestsThisMinute = useRef(0); // Counter for requests sent in the current minute
  const aiTimer = useRef(null); // Timer for resetting the counter
  const isProcessingQueue = useRef(false); // Prevent concurrent queue processing

  // Helper to process the queue respecting the rate limit
  const processAIQueue = async () => {
  if (isProcessingQueue.current) return;
  isProcessingQueue.current = true;
  try {
    while (aiRequestsThisMinute.current < 4 && aiRequestQueue.current.length > 0) {
      let toSend = [];
      if (aiRequestQueue.current.length > 4) {
        // Batch all as one multi-turn user input
        toSend = aiRequestQueue.current.splice(0, aiRequestQueue.current.length);
      } else {
        // Single utterance
        toSend = [aiRequestQueue.current.shift()];
      }

      // Get CURRENT conversation snapshot (before appending new users)
      const currentConversation = [...conversation];  // Clone to avoid stale closure

      setLoading(true);
      // Pass full history + new utterances
      const aiResp = await AIModel(
        DiscussionRoomData.topic,
        DiscussionRoomData.coachingOption,
        currentConversation,
        toSend.map(item => item.utterance)  // Array for batching
      );
      setLoading(false);

      // Convert to speech (unchanged)
      const url = await ConvertTextToSpeech(aiResp.content, DiscussionRoomData.expertName);
      setAudioUrl(url);

      // Append: new user utterances FIRST, then AI response (maintains order)
      setConversation(prev => [
        ...prev,
        ...toSend.map(item => ({ role: "user", content: item.utterance })),
        aiResp  // { role: "assistant", content: ... }
      ]);
      aiRequestsThisMinute.current++;
    }
  } finally {
    isProcessingQueue.current = false;
  }
};

  // Timer to reset the request counter every minute and process the queue
  useEffect(() => {
    aiTimer.current = setInterval(() => {
      aiRequestsThisMinute.current = 0;
      processAIQueue();
    }, 60 * 1000);
    return () => clearInterval(aiTimer.current);
  }, []);

  // When a new utterance is received, push to queue and process
  const handleUserUtterance = (utterance) => {
    aiRequestQueue.current.push({ utterance });
    processAIQueue();
  };

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (expert) => expert.name === DiscussionRoomData.expertName
      );
      setExpert(Expert);
    }
    console.log("[DiscussionRoomData]", DiscussionRoomData);
  }, [DiscussionRoomData]);

  const connectToServer = async () => {
    console.log("[Step 1] Connect button clicked");
    setEnabled(true);
    setLoading(true);

    try {
      if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        // Step 2: Load RecordRTC
        if (!RecordRTC) {
          console.log("[Step 2] Dynamically importing RecordRTC...");
          const module = await import("recordrtc");
          RecordRTC = module.default || module;
          console.log("[Step 2] RecordRTC imported:", RecordRTC);
        }

        // Step 3: Get AssemblyAI token and connect manually to WebSocket
        console.log("[Step 3] Fetching token...");
        const token = await getToken();
        const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=16_000&token=${token}`;

        console.log("[Step 3] Connecting to AssemblyAI WebSocket manually...");
        socket.current = new WebSocket(wsUrl);

        socket.current.onopen = () => {
          console.log("[WebSocket] Connected to AssemblyAI");
          setLoading(false);
        };

        socket.current.onerror = (error) => {
          console.error("[WebSocket] Error:", error);
        };

        socket.current.onmessage = async (message) => {
          console.log("[WebSocket] Message received:", message);
          const data = JSON.parse(message.data);
          /*if (data.text) {
            console.log("[Transcript]", data.text);
            setTranscribe(data.text);
          }else if(data.transcript){
            setTranscribe(data.transcript);
          }*/
          if (data.type === "Turn" && data.end_of_turn && data.transcript) {
            const newUtterance = data.transcript;
            setTranscribe(newUtterance);
            // Instead of calling AIModel directly, queue the request
            handleUserUtterance(newUtterance);
          }



        };

        // Step 4: Request microphone access
        console.log("[Step 4] Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("[Step 4] Microphone access granted");

        // Step 5: Initialize and start RecordRTC
        console.log("[Step 5] Initializing RecordRTC...");
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
            if (!socket.current || socket.current.readyState !== 1) {
              console.warn("[WebSocket] Not connected or not ready");
              return;
            }

            clearTimeout(silenceTimeout);

            const buffer = await blob.arrayBuffer();
            console.log("[Step 6] Sending audio buffer to AssemblyAI...");
            socket.current.send(buffer);

            silenceTimeout = setTimeout(() => {
              console.log("Silence detected: User stopped talking");
            }, 2000);
          },
        });

        console.log("[Step 5] Starting recording...");
        recorder.current.startRecording();
        console.log("[Step 5] Recorder started");
      }
    } catch (err) {
      console.error("Error during connection setup:", err);
      setEnabled(false);
    }
  };

  const disconnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("[Disconnect] Initiated");

    if (socket.current) {
      socket.current.close();
      console.log("[Disconnect] WebSocket closed");
    }

    if (recorder.current) {
      recorder.current.stopRecording(() => {
        recorder.current = null;
        console.log("[Disconnect] Recorder stopped and cleared");
      });
    } else {
      console.warn("[Disconnect] Recorder is already null or not initialized");
    }

    await updateConversation({
      id: DiscussionRoomData._id,
      conversation: conversation
    });

    

    setEnabled(false);
    setLoading(false);
    setEnableFeedbackNotes(true);
  };


  const updateUserCredits = async(text)=>{
    const tokencount = text.trim()?text.trim().split(/\s+/).length:0;
    const result = await updateUserToken({
      id: userData._id,
      credits: Number(userData.credits) - Number(tokencount)
    });

    setUserdata(prev=>({
      ...prev,
      credits: Number(userData.credits) - Number(tokencount)
    }))
  }

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary rounded-4xl flex flex-col items-center justify-center relative">
            {expert?.avatar && (
              <Image
                src={expert.avatar}
                alt="avatar"
                width={200}
                height={200}
                className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
              />
            )}
            <h2 className="text-gray-500">{expert?.name}</h2>

            <audio src={audioUrl} type="audio/mp3" autoPlay />



            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>


            {/*<div className="absolute bottom-10 right-10">
              <Webcam height={80} width={130} className="rounded-2xl"/>
            </div>*/}
          </div>

          <div className="mt-5 flex items-center justify-center">
            {!enabled ? (
              <Button onClick={connectToServer} disabled={loading}>{loading && <Loader2Icon className="animate-spin" />}Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                {loading && <Loader2Icon className="animate-spin" />}
                Disconnect
              </Button>
            )}
          </div>
        </div>

        <div>
          <ChatBox conversation={conversation}  
          enableFeedbackNotes={enableFeedbackNotes}
          coachingOption={DiscussionRoomData?.coachingOption}/>
        </div>
      </div>

      <div>
        <h2>{transcribe}</h2>
      </div>
      <h3 className="text-md font-semibold text-gray-700">Conversation</h3>
      <div className="space-y-2">
        {conversation.map((utterance, index) => (
          <p key={index} className="text-gray-800">
            <span className="font-bold">
              {utterance.role === "assistant" ? "🤖 AI:" : "🧑 Me:"}
            </span>{" "}
            {utterance.content}
          </p>
        ))}
      </div>



    </div>
  );
}

export default DiscussionRoom;
