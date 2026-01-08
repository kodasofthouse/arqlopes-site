/**
 * Content Versioning System
 * Handles version creation, listing, and rollback
 */

import type { VersionIndex, VersionEntry, ContentSection } from '@/types/content';
import type { R2Bucket } from './r2';
import {
  readJsonFromR2,
  writeJsonToR2,
  getContentKey,
  getVersionKey,
  getVersionIndexKey,
  copyObjectInR2,
  existsInR2,
  getObjectMetadata,
} from './r2';
import {
  generateVersionId,
  MAX_VERSIONS_PER_SECTION,
  VALIDATION_MESSAGES,
} from './api-config';

// ============================================================================
// Types
// ============================================================================

export interface CreateVersionOptions {
  section: ContentSection;
  userEmail: string;
  note?: string;
}

export interface CreateVersionResult {
  success: boolean;
  versionId?: string;
  error?: string;
}

export interface RollbackResult {
  success: boolean;
  restoredVersionId?: string;
  newVersionId?: string;
  error?: string;
}

// ============================================================================
// Version Index Operations
// ============================================================================

/**
 * Gets the version index for a section, creating if it doesn't exist
 */
export async function getVersionIndex(
  bucket: R2Bucket,
  section: ContentSection
): Promise<VersionIndex> {
  const indexKey = getVersionIndexKey(section);
  const existing = await readJsonFromR2<VersionIndex>(bucket, indexKey);
  
  if (existing) {
    return existing;
  }
  
  const newIndex: VersionIndex = {
    section,
    versions: [],
  };
  
  await writeJsonToR2(bucket, indexKey, newIndex);
  
  return newIndex;
}

/**
 * Saves the version index
 */
async function saveVersionIndex(
  bucket: R2Bucket,
  section: ContentSection,
  index: VersionIndex
): Promise<void> {
  const indexKey = getVersionIndexKey(section);
  await writeJsonToR2(bucket, indexKey, index);
}

// ============================================================================
// Version Creation
// ============================================================================

/**
 * Creates a new version backup of the current content
 * Called BEFORE overwriting the current content file
 */
export async function createVersion(
  bucket: R2Bucket,
  options: CreateVersionOptions
): Promise<CreateVersionResult> {
  const { section, userEmail, note } = options;
  
  const contentKey = getContentKey(section);
  
  const contentExists = await existsInR2(bucket, contentKey);
  if (!contentExists) {
    return { success: true };
  }
  
  const metadata = await getObjectMetadata(bucket, contentKey);
  if (!metadata) {
    return { success: true };
  }
  
  const versionId = generateVersionId();
  const versionKey = getVersionKey(section, versionId);
  
  const copyResult = await copyObjectInR2(bucket, contentKey, versionKey);
  if (!copyResult) {
    return {
      success: false,
      error: 'Failed to copy content to version file',
    };
  }
  
  const index = await getVersionIndex(bucket, section);
  
  const newEntry: VersionEntry = {
    id: versionId,
    createdAt: new Date().toISOString(),
    createdBy: userEmail,
    size: metadata.size,
    note,
  };
  
  index.versions.unshift(newEntry);
  
  if (index.versions.length > MAX_VERSIONS_PER_SECTION) {
    const versionsToDelete = index.versions.slice(MAX_VERSIONS_PER_SECTION);
    index.versions = index.versions.slice(0, MAX_VERSIONS_PER_SECTION);
    
    await cleanupOldVersions(bucket, section, versionsToDelete);
  }
  
  await saveVersionIndex(bucket, section, index);
  
  return {
    success: true,
    versionId,
  };
}

/**
 * Deletes old version files that exceed the limit
 */
async function cleanupOldVersions(
  bucket: R2Bucket,
  section: ContentSection,
  versionsToDelete: VersionEntry[]
): Promise<void> {
  const keysToDelete = versionsToDelete.map((v) =>
    getVersionKey(section, v.id)
  );
  
  if (keysToDelete.length > 0) {
    await bucket.delete(keysToDelete);
  }
}

// ============================================================================
// Version Listing
// ============================================================================

/**
 * Lists all versions for a section
 */
export async function listVersions(
  bucket: R2Bucket,
  section: ContentSection
): Promise<VersionEntry[]> {
  const index = await getVersionIndex(bucket, section);
  return index.versions;
}

// ============================================================================
// Version Rollback
// ============================================================================

/**
 * Rolls back to a specific version
 * 
 * Flow:
 * 1. Verify the version exists
 * 2. Create a backup of current content (becomes a new version)
 * 3. Copy the selected version to content/
 */
export async function rollbackToVersion(
  bucket: R2Bucket,
  section: ContentSection,
  versionId: string,
  userEmail: string,
  note?: string
): Promise<RollbackResult> {
  const versionKey = getVersionKey(section, versionId);
  
  const versionExists = await existsInR2(bucket, versionKey);
  if (!versionExists) {
    return {
      success: false,
      error: VALIDATION_MESSAGES.VERSION_NOT_FOUND,
    };
  }
  
  const backupResult = await createVersion(bucket, {
    section,
    userEmail,
    note: note ?? `Rollback to version ${versionId}`,
  });
  
  if (!backupResult.success) {
    return {
      success: false,
      error: backupResult.error,
    };
  }
  
  const contentKey = getContentKey(section);
  const copyResult = await copyObjectInR2(bucket, versionKey, contentKey);
  
  if (!copyResult) {
    return {
      success: false,
      error: VALIDATION_MESSAGES.ROLLBACK_FAILED,
    };
  }
  
  return {
    success: true,
    restoredVersionId: versionId,
    newVersionId: backupResult.versionId,
  };
}

// ============================================================================
// Version Content Retrieval
// ============================================================================

/**
 * Gets the content from a specific version
 */
export async function getVersionContent<T>(
  bucket: R2Bucket,
  section: ContentSection,
  versionId: string
): Promise<T | null> {
  const versionKey = getVersionKey(section, versionId);
  return readJsonFromR2<T>(bucket, versionKey);
}
