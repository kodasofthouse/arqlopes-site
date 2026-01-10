/**
 * API Configuration and Constraints
 * All limits and constants from the specification
 */

// ============================================================================
// Size Limits (in bytes)
// ============================================================================

/** Maximum image file size: 10MB */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

/** Maximum JSON content file size: 1MB */
export const MAX_JSON_SIZE_BYTES = 1 * 1024 * 1024;

// ============================================================================
// Content Limits
// ============================================================================

/** Maximum number of gallery projects */
export const MAX_GALLERY_PROJECTS = 50;

/** Maximum number of client logos */
export const MAX_CLIENT_LOGOS = 30;

/** Maximum number of versions to keep per section */
export const MAX_VERSIONS_PER_SECTION = 10;

/** Maximum number of hero background images */
export const MAX_HERO_BACKGROUND_IMAGES = 4;

// ============================================================================
// Allowed Image Formats
// ============================================================================

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

// ============================================================================
// Cache Configuration
// ============================================================================

/** Cache TTL for JSON content (seconds) */
export const CONTENT_CACHE_TTL_SECONDS = 60;

/** Cache TTL for images (immutable) - 1 year */
export const IMAGE_CACHE_TTL_SECONDS = 31536000;

// ============================================================================
// R2 Configuration
// ============================================================================

/** Public R2 bucket URL for content delivery */
export const R2_PUBLIC_URL = 'https://pub-9def9de695584c4c8300c62ce8af1bbd.r2.dev';

export const R2_PATHS = {
  CONTENT: 'content',
  VERSIONS: '_versions',
  IMAGES: 'images',
  TRASH: '_trash',
} as const;

// ============================================================================
// HTTP Headers
// ============================================================================

export const CLOUDFLARE_ACCESS_EMAIL_HEADER = 'cf-access-authenticated-user-email';

// ============================================================================
// Validation Messages
// ============================================================================

export const VALIDATION_MESSAGES = {
  INVALID_SECTION: 'Invalid content section',
  CONTENT_TOO_LARGE: `Content exceeds maximum size of ${MAX_JSON_SIZE_BYTES / 1024 / 1024}MB`,
  IMAGE_TOO_LARGE: `Image exceeds maximum size of ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`,
  INVALID_IMAGE_TYPE: `Invalid image type. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
  MAX_GALLERY_EXCEEDED: `Maximum of ${MAX_GALLERY_PROJECTS} gallery projects allowed`,
  MAX_CLIENTS_EXCEEDED: `Maximum of ${MAX_CLIENT_LOGOS} client logos allowed`,
  MAX_HERO_IMAGES_EXCEEDED: `Maximum of ${MAX_HERO_BACKGROUND_IMAGES} hero background images allowed`,
  VERSION_NOT_FOUND: 'Version not found',
  CONTENT_NOT_FOUND: 'Content not found',
  UNAUTHORIZED: 'Unauthorized access',
  MISSING_USER_EMAIL: 'User email not found in request headers',
  INVALID_REQUEST_BODY: 'Invalid request body',
  FILE_NOT_FOUND: 'File not found',
  UPLOAD_FAILED: 'Failed to upload file',
  DELETE_FAILED: 'Failed to delete file',
  ROLLBACK_FAILED: 'Failed to rollback to version',
} as const;

// ============================================================================
// Content Section Filenames
// ============================================================================

export const CONTENT_FILENAMES = {
  hero: 'hero.json',
  about: 'about.json',
  gallery: 'gallery.json',
  clients: 'clients.json',
  footer: 'footer.json',
  metadata: 'metadata.json',
} as const;

// ============================================================================
// Version Timestamp Format
// ============================================================================

/**
 * Generates a version ID from a date in format: YYYY-MM-DDTHH-mm-ss
 * Uses dashes instead of colons for filesystem compatibility
 */
export function generateVersionId(date: Date = new Date()): string {
  return date.toISOString().replace(/:/g, '-').split('.')[0];
}

/**
 * Parses a version ID back to a Date object
 */
export function parseVersionId(versionId: string): Date {
  const isoString = versionId.replace(/-(\d{2})-(\d{2})$/, ':$1:$2') + '.000Z';
  return new Date(isoString);
}

// ============================================================================
// Image Key Generation
// ============================================================================

/**
 * Generates a unique key for uploaded images
 */
export function generateImageKey(folder: string, filename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
  return `${folder}/${timestamp}-${sanitizedFilename}`;
}

// ============================================================================
// Trash Key Generation
// ============================================================================

/**
 * Generates a trash key for soft-deleted files
 */
export function generateTrashKey(originalKey: string): string {
  const timestamp = Date.now();
  return `${R2_PATHS.TRASH}/${timestamp}-${originalKey.replace(/\//g, '-')}`;
}
