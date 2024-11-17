// lib/utils.ts
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

