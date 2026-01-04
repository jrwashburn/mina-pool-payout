import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

/**
 * Get directory name from import.meta.url (ESM equivalent of __dirname)
 * Works in both CommonJS and ESM contexts
 * @param importMetaUrl - The import.meta.url from the calling module
 * @returns The directory name
 */
export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}
