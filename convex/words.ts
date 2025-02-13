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
    last_review: v.optional(v.number()), // The last review timestamp
    interval: v.optional(v.number()), // Spaced repetition interval
    repetition: v.optional(v.number()), // Number of repetitions
    ease: v.optional(v.float64()), // Ease factor for the spaced repetition
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
      last_review: args.last_review, // Set the last review time
      interval: args.interval ?? 1, // Default interval to 1 if not provided
      repetition: args.repetition ?? 0, // Default repetition to 0 if not provided
      ease: args.ease ?? 2.5, // Default ease to 2.5 if not provided
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
  args: { wordListId: v.optional(v.id("wordLists")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // If the user is not authenticated, throw an error
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (args.wordListId) {
      const words = await ctx.db
        .query("words")
        .filter((q) => q.eq(q.field("wordListId"), args.wordListId))
        .filter((q) => q.eq(q.field("userId"), userId)) // Ensure the word belongs to the authenticated user
        .collect();

      return words;
    }

    return null;
  },
});


export const updateWords = mutation({
  args: {
    words: v.array(
      v.object({
        _id: v.id("words"),
        word: v.optional(v.string()),
        phonetic: v.optional(v.string()),
        phonetics: v.optional(
          v.array(
            v.object({
              text: v.string(),
              audio: v.optional(v.string()),
            })
          )
        ),
        meanings: v.optional(
          v.array(
            v.object({
              partOfSpeech: v.optional(v.string()),
              definitions: v.array(
                v.object({
                  definition: v.string(),
                  example: v.optional(v.string()),
                  synonyms: v.array(v.string()),
                  antonyms: v.array(v.string()),
                })
              ),
              synonyms: v.array(v.string()),
              antonyms: v.array(v.string()),
            })
          )
        ),
        wordListId: v.optional(v.id("wordLists")),
        last_review: v.optional(v.number()),
        interval: v.optional(v.number()),
        repetition: v.optional(v.number()),
        ease: v.optional(v.float64()),
        progress: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("Word updates to be sent:", JSON.stringify(args.words, null, 2));

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Add detailed logging to understand what data we're receiving
    console.log("Raw words input:", JSON.stringify(args.words, null, 2));

    // Filter out invalid entries
    const updatedWords = await Promise.all(
      args.words.map(async (wordData) => {
        const { _id, ...rest } = wordData;
        const existingWord = await ctx.db.get(_id);
        console.log("Existing word:", JSON.stringify(existingWord, null, 2));
        
        if (!existingWord) {
          throw new Error(`Word not found: ${_id}`);
        }

        if (existingWord.userId !== userId) {
          throw new Error("Unauthorized");
        }

        // Combine the existing word data with the updates
        const updatedWord = {
          ...existingWord,
          ...rest, // This will overwrite the fields with the updated values
        };
        console.log(updatedWord);
        

        // Update the word in the database
        await ctx.db.patch(_id, updatedWord);
        return updatedWord;
      })
    );

    console.log("Updated words:", JSON.stringify(updatedWords, null, 2));

    return updatedWords;
  },
});

