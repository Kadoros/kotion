import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addWord = mutation({
  args: {
    word: v.string(), // The word itself
    phonetic: v.string(), // Phonetic transcription
    phonetics: v.array(
      v.object({
        text: v.string(),
        audio: v.optional(v.string()), // Optional audio URL for phonetic
      })
    ), // Array of phonetic representations
    meanings: v.array(
      v.object({
        partOfSpeech: v.optional(v.string()), // Part of speech
        definitions: v.array(
          v.object({
            definition: v.string(), // The definition
            example: v.optional(v.string()), // Optional example sentence
            synonyms: v.array(v.string()), // List of synonyms
            antonyms: v.array(v.string()), // List of antonyms
          })
        ),
        synonyms: v.array(v.string()), // Additional synonyms at the meaning level
        antonyms: v.array(v.string()), // Additional antonyms at the meaning level
      })
    ), // Array of meanings
    wordListId: v.optional(v.id("wordLists")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (args.wordListId) {
      const wordList = await ctx.db
        .query("wordLists")
        .filter((q) => q.eq(q.field("_id"), args.wordListId))
        .first();

      if (!wordList) {
        throw new Error("The provided wordListId does not exist.");
      }
    } else {
      // If wordListId is not provided, find the word list named "main" for the current user
      const wordList = await ctx.db
        .query("wordLists")
        .filter(
          (q) =>
            q.eq(q.field("name"), "main") && q.eq(q.field("userId"), userId)
        )
        .first();

      if (!wordList) {
        throw new Error("The 'main' word list for the user does not exist.");
      }

      // Set wordListId to the found word list's ID
      args.wordListId = wordList._id;
    }

    // Insert the word into the database
    const word = await ctx.db.insert("words", {
      word: args.word,
      phonetic: args.phonetic, // `phonetic` is optional, will be `null` if not provided
      phonetics: args.phonetics,
      meanings: args.meanings,
      createdAt: Date.now(),
      language: "en", // Default to English or pass this in the arguments
      userId, // Associate with the user who added the word
      progress: 0,
      wordListId: args.wordListId, // Associate with the word list
    });

    return word;
  },
});
export const getWordById = query({
  args: { wordId: v.id("words") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const word = await ctx.db.get(args.wordId);

    if (!word) {
      throw new Error("Word not found");
    }

    // If the user is not authenticated, throw an error
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // If the word does not belong to the authenticated user, throw an error
    if (word.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return word;
  },
});
export const getWords = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // If the user is not authenticated, throw an error
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Fetch all words associated with the user ID
    const words = await ctx.db
      .query("words")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    return words;
  },
});
export const getWordsByWordListId = query({
  args: { wordListId: v.id("wordLists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // If the user is not authenticated, throw an error
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Fetch all words associated with the given wordListId and userId
    const words = await ctx.db
      .query("words")
      .filter((q) => q.eq(q.field("wordListId"), args.wordListId))
      .filter((q) => q.eq(q.field("userId"), userId)) // Ensure the word belongs to the authenticated user
      .collect();

    return words;
  },
});
