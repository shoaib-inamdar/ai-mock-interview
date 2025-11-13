import axios from "axios";
import OpenAI from "openai";
import { ExpertsList } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";


export const getToken = async () => {
        const result = await axios.get('/api/getToken');
        return result.data;
}

const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
});

export const AIModel = async (topic, coachingOption,conversation, newUserUtterances) => {
        //const option = ExpertsList.find(item => item.name === topic);
        const option = ExpertsList.find(item => item.name === coachingOption);
  const PROMPT = option.prompt.replace('{user_topic}', topic);
        const messages = [
    { role: "system", content: PROMPT },  // Use "system" for persistent instructions
    ...conversation,  // Full prior turns (user/assistant alternations)
    // Append new user utterance(s); if batched, treat as multi-turn user input
    ...(Array.isArray(newUserUtterances) ? newUserUtterances : [newUserUtterances]).map(utt => ({
      role: "user",
      content: utt
    }))
  ];

        const completion = await openai.chat.completions.create({
                model: "openrouter/polaris-alpha",
                messages
        });

        console.log(completion.choices[0].message);
        return completion.choices[0].message;
}

export const AIModelToGenerateFeedbackAndNotes = async (ExpertsLists, conversation) => {
        //const option = ExpertsList.find(item => item.name === topic);
        const option = ExpertsList.find(item => item.name === ExpertsLists);
        const PROMPT = (option.summeryPrompt)

        const completion = await openai.chat.completions.create({
                model: "openrouter/polaris-alpha",
                messages: [
                  ...conversation,
                        { role: "assistant", content: PROMPT },
                ],
        });

        console.log(completion.choices[0].message);
        return completion.choices[0].message;
}

// export const ConvertTextToSpeech = async (text, expertName) => {
//         const pollyClient = new PollyClient({
//                 region: "us-east-1",
//                 credentials: {
//                         accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
//                         secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
//                 }
//         });
//         const command = new SynthesizeSpeechCommand({
//                 Text: text,
//                 OutputFormat: "mp3",
//                 VoiceId: expertName
//         })
//         try {
//                 const { AudioStream } = await pollyClient.send(command);

//                 const audioArrayBuffer = await AudioStream.transformToByteArray();
//                 const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mp3' });

//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 return audioUrl;

//         } catch (e) {
//                 console.log(e);
//         }


// }


export const ConvertTextToSpeech = async (text, voiceId) => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg', 
        'Content-Type': 'application/json',
        'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {  
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status} - ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;

  } catch (e) {
    console.error('ElevenLabs TTS failed:', e);
    return null; 
  }
};