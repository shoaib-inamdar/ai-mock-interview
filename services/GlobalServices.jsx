// services/GlobalServices.jsx
import axios from "axios";
import OpenAI from "openai";


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true // Note: In prod, move to server action for security
});

export const AIModel = async (topic, coachingOptionStr, lastTwoConversation) => { // Renamed param for clarity
  // Assume CoachingExpert or similar array; adjust if it's a different import
  const coachingOptions = coachingExpert || []; // Fallback if not imported here—import if needed
  const option = coachingOptions.find((item) => item.name === coachingOptionStr); // String compare
  if (!option) {
    console.warn('Coaching option not found:', coachingOptionStr);
    return { role: 'assistant', content: 'Sorry, coaching option unavailable.' };
  }
  const PROMPT = option.prompt.replace("{user_topic}", topic);

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-exp:free",
    messages: [
      { role: "system", content: PROMPT }, // Changed to 'system' for prompt—'assistant' works but system is better for context
      ...lastTwoConversation, // Assumes these have role/content
    ],
  });

  console.log(completion.choices[0].message);
  return completion.choices[0].message;
};
export const getToken=async()=>{
    const result=await axios.get('/api/getToken');
    return result.data;
}