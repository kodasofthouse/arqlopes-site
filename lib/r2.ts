/**
 * Cloudflare R2 Storage Utilities
 * Handles all R2 bucket operations with proper typing
 */

import {
  R2_PATHS,
  generateTrashKey,
  ALLOWED_IMAGE_MIME_TYPES,
  IMAGE_CACHE_TTL_SECONDS,
  type AllowedImageMimeType,
} from './api-config';
import type { ImageListItem } from '@/types/content';

// ============================================================================
// Types
// ============================================================================

/**
 * Cloudflare R2 Bucket binding type
 * Available in Cloudflare Functions runtime via env bindings
 */
export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions): Promise<R2Object>;
  delete(key: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
  head(key: string): Promise<R2Object | null>;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
}

export interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2ListOptions {
  prefix?: string;
  delimiter?: string;
  cursor?: string;
  limit?: number;
  include?: ('httpMetadata' | 'customMetadata')[];
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

// ============================================================================
// Environment Interface
// ============================================================================

export interface CloudflareEnv {
  R2_ASSETS: R2Bucket;
  NEXT_PUBLIC_R2_URL?: string;
}

// ============================================================================
// JSON Operations
// ============================================================================

/**
 * Reads and parses a JSON file from R2
 */
export async function readJsonFromR2<T>(
  bucket: R2Bucket,
  key: string
): Promise<T | null> {
  const object = await bucket.get(key);
  
  if (!object) {
    return null;
  }
  
  return object.json<T>();
}

/**
 * Writes a JSON object to R2
 */
export async function writeJsonToR2<T>(
  bucket: R2Bucket,
  key: string,
  data: T
): Promise<R2Object> {
  const jsonString = JSON.stringify(data, null, 2);
  
  return bucket.put(key, jsonString, {
    httpMetadata: {
      contentType: 'application/json',
      cacheControl: 'no-cache',
    },
  });
}

// ============================================================================
// Image Operations
// ============================================================================

/**
 * Uploads an image to R2 with proper cache headers
 */
export async function uploadImageToR2(
  bucket: R2Bucket,
  key: string,
  data: ArrayBuffer,
  contentType: AllowedImageMimeType
): Promise<R2Object> {
  return bucket.put(key, data, {
    httpMetadata: {
      contentType,
      cacheControl: `public, max-age=${IMAGE_CACHE_TTL_SECONDS}, immutable`,
    },
  });
}

/**
 * Soft-deletes a file by moving it to the _trash folder
 */
export async function softDeleteFromR2(
  bucket: R2Bucket,
  key: string
): Promise<void> {
  const object = await bucket.get(key);
  
  if (!object) {
    throw new Error(`File not found: ${key}`);
  }
  
  const trashKey = generateTrashKey(key);
  const arrayBuffer = await object.arrayBuffer();
  
  await bucket.put(trashKey, arrayBuffer, {
    httpMetadata: object.httpMetadata,
    customMetadata: {
      ...object.customMetadata,
      originalKey: key,
      deletedAt: new Date().toISOString(),
    },
  });
  
  await bucket.delete(key);
}

/**
 * Lists all images in R2 bucket
 */
export async function listImagesFromR2(
  bucket: R2Bucket,
  prefix?: string
): Promise<ImageListItem[]> {
  const images: ImageListItem[] = [];
  let cursor: string | undefined;
  
  const searchPrefix = prefix ?? R2_PATHS.IMAGES;
  
  do {
    const result = await bucket.list({
      prefix: searchPrefix,
      cursor,
      include: ['httpMetadata'],
    });
    
    for (const obj of result.objects) {
      const contentType = obj.httpMetadata?.contentType;
      
      if (contentType && ALLOWED_IMAGE_MIME_TYPES.includes(contentType as AllowedImageMimeType)) {
        images.push({
          key: obj.key,
          url: `${process.env.NEXT_PUBLIC_R2_URL}/${obj.key}`,
          size: obj.size,
          lastModified: obj.uploaded.toISOString(),
          contentType,
        });
      }
    }
    
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);
  
  return images;
}

/**
 * Lists all folder prefixes in the images directory
 */
export async function listImageFoldersFromR2(
  bucket: R2Bucket
): Promise<string[]> {
  const result = await bucket.list({
    prefix: `${R2_PATHS.IMAGES}/`,
    delimiter: '/',
  });
  
  return result.delimitedPrefixes.map((prefix) =>
    prefix.replace(/\/$/, '')
  );
}

// ============================================================================
// Content Operations
// ============================================================================

/**
 * Gets the R2 key for a content section
 */
export function getContentKey(section: string): string {
  return `${R2_PATHS.CONTENT}/${section}.json`;
}

/**
 * Gets the R2 key for a version file
 */
export function getVersionKey(section: string, versionId: string): string {
  return `${R2_PATHS.VERSIONS}/${section}/${versionId}.json`;
}

/**
 * Gets the R2 key for a version index
 */
export function getVersionIndexKey(section: string): string {
  return `${R2_PATHS.VERSIONS}/${section}/_index.json`;
}

// ============================================================================
// Copy Operations
// ============================================================================

/**
 * Copies an object within R2
 */
export async function copyObjectInR2(
  bucket: R2Bucket,
  sourceKey: string,
  destinationKey: string
): Promise<R2Object | null> {
  const sourceObject = await bucket.get(sourceKey);
  
  if (!sourceObject) {
    return null;
  }
  
  const arrayBuffer = await sourceObject.arrayBuffer();
  
  return bucket.put(destinationKey, arrayBuffer, {
    httpMetadata: sourceObject.httpMetadata,
    customMetadata: sourceObject.customMetadata,
  });
}

// ============================================================================
// Existence Check
// ============================================================================

/**
 * Checks if an object exists in R2
 */
export async function existsInR2(
  bucket: R2Bucket,
  key: string
): Promise<boolean> {
  const head = await bucket.head(key);
  return head !== null;
}

/**
 * Gets object metadata without fetching the body
 */
export async function getObjectMetadata(
  bucket: R2Bucket,
  key: string
): Promise<R2Object | null> {
  return bucket.head(key);
}
