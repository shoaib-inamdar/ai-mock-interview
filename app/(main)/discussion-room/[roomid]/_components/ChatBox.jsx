import React from 'react'

function ChatBox({conversation}) {
  return (
    <div>
   <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col p-4 relative overflow-auto scrollbar-hide">
           
          {/* <div> */}
            {conversation.map((item,index)=>
            <div  key={index}  className={`flex ${item.role == 'user' && 'justify-end '}`}>
                {item.role == 'assistant'?
                 <h2 className='p-1 px-2 bg-primary mt-2 text-white inline-block rounded-md '>{item.content}</h2>
                 :
               <h2  className='p-1 px-2 bg-gray-200 mt-2 inline-block rounded-md  justify-end '>{item?.content}</h2>}
            </div>
          )}
         {/*</div> */}
                    </div>

          <h2 className="mt-4 text-gray-400 text-sm ">
            At the end of the conversation we will automatically generate
            feedback/notes from your conversation
          </h2>
          </div>
  )

}

export default ChatBox