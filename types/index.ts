// types.ts
export interface FileSystemItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileSystemItem[];
  size?: number;
  modifiedAt?: string;
}


export enum UserRole {
  USER = "user",
  MANAGER = "manager",
  ADMIN = "admin", // Add this to match the enum-based structure
}

export type UserData = {
  id: string;
  avatar: string;
  role: UserRole;
  email: string;
  lastSignedInTime:string;
  
};

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface Phonetic {
  text: string;
  audio?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
}

export interface DictionaryCardProps {
  text?: string | null;
  className?: string;
}

export interface TranslatorCardProps {
  text?: string | null;
  className?: string;
}
