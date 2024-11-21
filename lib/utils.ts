// lib/utils.ts
import { FileSystemItem } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function getFileIconByMimeType(mimeType: string): string {
  const iconMap: { [key: string]: string } = {
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'javascript',
    'application/json': 'json',
    'image/png': 'image',
    'image/jpeg': 'image',
    'image/gif': 'image',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
    'application/vnd.ms-excel': 'spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
    'application/zip': 'archive',
    'text/plain': 'text',
    'audio/mpeg': 'audio',
    'video/mp4': 'video'
  };

  return iconMap[mimeType] || 'file';
}

export const parseGroupFolder = (
  name: string
): Pick<FileSystemItem, "groupNumber" | "groupSubject"> => {
  const match = name.match(/Group (\d+) - (.+)/);
  if (match) {
    return {
      groupNumber: match[1],
      groupSubject: match[2] as FileSystemItem["groupSubject"],
    };
  }
  return {};
};

export const parseSubjectFolder = (
  name: string
): Pick<FileSystemItem, "subject" | "level"> => {
  const parts = name.split("_");
  if (parts.length === 2) {
    return {
      subject: parts[0] as FileSystemItem["subject"],
      level: parts[1] as FileSystemItem["level"],
    };
  }
  return {};
};

export const parseExamSessionFolder = (
  name: string
): Pick<FileSystemItem, "year" | "month"> => {
  const match = name.match(/(\d{4}) (May|November)/);
  if (match) {
    return {
      year: parseInt(match[1]),
      month: match[2] as FileSystemItem["month"],
    };
  }
  return {};
};

export const parseFileName = (name: string): Partial<FileSystemItem> => {
  const parts = name.split("_");
  const properties: Partial<FileSystemItem> = {};

  if (parts.length < 3) return properties;

  properties.subject = parts[0] as FileSystemItem["subject"];

  // Parse paper number
  const paperMatch = parts[2].match(/^\d/);
  if (paperMatch) {
    properties.paperNumber = parseInt(paperMatch[0]) as 1 | 2 | 3;
  }

  // Parse timezone
  const tzPart = parts.find((p) => p.startsWith("TZ"));
  if (tzPart) {
    properties.timeZoneNumber = parseInt(tzPart.substring(2)) as 1 | 2 | 3;
  }

  // Parse level
  const levelPart = parts.find((p) => p === "HL" || p === "SL");
  if (levelPart) {
    properties.level = levelPart as "HL" | "SL";
  }

  // Parse language (if present)
  const langIndex = parts.findIndex((p) => p === "HL" || p === "SL") + 1;
  if (langIndex < parts.length && !parts[langIndex].includes(".")) {
    properties.language = parts[langIndex];
  }

  // Parse paper type
  properties.paperType = parts.includes("markscheme")
    ? "markscheme"
    : "question paper";

  return properties;
};

export const enrichItemWithProperties = (item: FileSystemItem): FileSystemItem => {
  const pathParts = item.path.split("/").filter(Boolean);
  let properties: Partial<FileSystemItem> = {};

  // Process based on item depth in the hierarchy
  if (pathParts.length >= 1) {
    properties = { ...properties, ...parseGroupFolder(pathParts[0]) };
  }

  if (pathParts.length >= 2) {
    properties = { ...properties, ...parseSubjectFolder(pathParts[1]) };
  }

  if (pathParts.length >= 3) {
    properties = { ...properties, ...parseExamSessionFolder(pathParts[2]) };
  }

  // If it's a file, parse the filename
  if (item.type === "file") {
    properties = { ...properties, ...parseFileName(item.name) };
  }

  // Recursively process children if they exist
  if (item.children) {
    item.children = item.children.map(enrichItemWithProperties);
  }

  console.log(properties);

  return { ...item, ...properties };
};