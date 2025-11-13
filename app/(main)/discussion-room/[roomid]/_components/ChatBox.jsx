import { Button } from "@/components/ui/button";
import { AIModelToGenerateFeedbackAndNotes } from "@/services/GlobalServices";
import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import {React,useState} from "react";
import { toast } from "sonner";
import { api } from '@/convex/_generated/api';
import { useParams } from "next/navigation";


const ChatBox = ({conversation, enableFeedbackNotes,coachingOption}) => {

    const [loading,setLoading] = useState(false);
    const updateSummary = useMutation(api.DiscussionRoom.UpdateSummary);
    const {roomid} = useParams();
    const GenerateFeedbackNotes = async() => {
        try{
        setLoading(true);
        const result = await AIModelToGenerateFeedbackAndNotes(coachingOption,conversation);
        console.log(result.content);
        setLoading(false);
        await updateSummary({
            id:roomid,
            summary:result.content
        })
        toast('Feedback/Notes Generated Successfully')
    }catch(error){
        console.log(error);
        setLoading(false);
        toast('Error Generating Feedback/Notes')
    }
        
    }
    

    return (
        <div>
        <div className="h-[60vh] bg-secondary rounded-4xl flex flex-col relative p-4 overflow-auto">
            
                {conversation.map((item,index)=>(
                    <div key={index} className={`flex ${item.role === 'user'&&'justify-end'}`}>
                        {item.role === 'assistant'?
                        <h2 className="p-1 px-2 bg-primary mt-1 text-white inline-block rounded-md">{item?.content}</h2>:
                        <h2 className="p-1 px-2 bg-gray-200 mt-1 inline-block rounded-md">{item?.content}</h2>
                        }
                        
                    </div>
                ))}
            
          </div>
          {!enableFeedbackNotes? <h2 className="mt-4 text-gray-400 text-smaller">
            
            
          </h2>
          :<Button onClick ={GenerateFeedbackNotes} disabled={loading} className='mt-7 w-full'>
            {loading&&<LoaderCircle className="animate-spin"/>}
            Generate Feedback/Notes</Button>}
          </div>
    );
};

export default ChatBox;
