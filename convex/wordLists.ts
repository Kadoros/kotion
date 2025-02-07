import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    mode: v.union(v.literal("translation"), v.literal("definition")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const wordList = await ctx.db.insert("wordLists", {
      name: args.name,
      userId: userId,
      createdAt: Date.now(),
      mode: args.mode,
    });

    return wordList;
  },
});
export const getWordLists = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    // Build the query based on provided arguments
    let queryBuilder = ctx.db
      .query("wordLists")
      .filter((q) => q.eq(q.field("userId"), userId));

    // Fetch the word lists
    const wordLists = await queryBuilder.collect();

    return wordLists;
  },
});
export const getWordListNames = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Query to fetch word lists for the authenticated user
    const wordLists = await ctx.db
      .query("wordLists")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Extract and return only the names of the word lists
    const wordListNames = wordLists.map((wordList) => wordList.name);

    return wordListNames;
  },
});
