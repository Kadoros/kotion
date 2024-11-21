// types.ts
export interface FileSystemItem {
  // Base properties
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileSystemItem[];
  size?: number;
  modifiedAt?: string;

  // Group properties (1st layer)
  groupNumber?: string;
  groupSubject?: string;

  // Subject properties (2nd layer)
  subject?: string;
  level?: "HL" | "SL";

  // Examination Session properties (3rd layer)
  year?: number;
  month?: "May" | "November";

  // File specific properties
  paperNumber?: number;
  timeZoneNumber?: number;
  language?: string;
  paperType?: "question paper" | "markscheme";
}

export interface ItemProps {
  item: FileSystemItem;
  level?: number;
  expanded?: boolean;
  onExpand?: () => void;
  useFileSystem: () => FileSystemHook;
}

export interface FileSystemHook {
  loading: boolean;
  error: Error | string | null;
  fetchDirectoryStructure: () => Promise<FileSystemItem[]>;
  searchItems: (query: string, type?: string) => Promise<FileSystemItem[]>;
  getChildren: (path: string) => Promise<FileSystemItem[]>; // Retrieves children for a given path
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
  lastSignedInTime: string;
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
