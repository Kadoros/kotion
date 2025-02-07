import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  userRoles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("manager"), v.literal("admin")), // Role validation
  }).index("by_user", ["userId"]),

  words: defineTable({
    word: v.string(),
    phonetic: v.optional(v.string()), // Make phonetic optional
    phonetics: v.array(
      v.object({
        text: v.string(),
        audio: v.optional(v.string()),
      })
    ),
    meanings: v.array(
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
    ),
    createdAt: v.number(),
    progress: v.number(),
    language: v.string(),
    userId: v.string(),
    wordListId: v.optional(v.id("wordLists")),
  })
    .index("by_word", ["word"])
    .index("by_user", ["userId"])
    .index("by_language", ["language"]),
  wordLists: defineTable({
    name: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    mode: v.union(v.literal("translation"), v.literal("definition")), // Mode validation (optional)
  }).index("by_user", ["userId"]),
});
