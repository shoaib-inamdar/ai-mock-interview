import { handler } from "next/dist/build/templates/app-page";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const CreateNewRoom = mutation({
  args: {
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("DiscussionRoom", {
      coachingOption: args.coachingOption,
      topic: args.topic,
      expertName: args.expertName,
    });
    return result;
  },
});
export const getDiscussionRoom=query({
  args:{
  id:v.id('DiscussionRoom'),
    }
   ,handler:async(ctx,args)=>{
    const result= await ctx.db.get(args.id);
    return result;

   }
})
