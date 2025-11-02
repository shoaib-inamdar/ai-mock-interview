import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userData = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (userData?.length === 0) {
      
      const result = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        credits: 5000,
      });
      console.log(result);
      return data;
    }
    return userData[0];
  },
});
