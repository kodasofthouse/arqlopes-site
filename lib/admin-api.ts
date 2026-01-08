/**
 * Admin API Client
 * Client-side functions for interacting with admin API endpoints
 */

import type {
  ContentSection,
  ContentTypeMap,
  VersionEntry,
  ImageListItem,
  ApiResponse,
  UploadResponse,
  RollbackRequest,
} from '@/types/content';

// ============================================================================
// Error Handling
// ============================================================================

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string[]
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json() as ApiResponse<T>;
  
  if (!response.ok || !data.success) {
    throw new AdminApiError(
      data.error ?? 'Request failed',
      response.status,
      (data as { details?: string[] }).details
    );
  }
  
  return data.data as T;
}

// ============================================================================
// Content API
// ============================================================================

/**
 * Fetches content for a section
 */
export async function fetchContent<K extends ContentSection>(
  section: K
): Promise<ContentTypeMap[K]> {
  const response = await fetch(`/api/content/${section}`);
  return handleResponse<ContentTypeMap[K]>(response);
}

/**
 * Updates content for a section
 */
export async function updateContent<K extends ContentSection>(
  section: K,
  content: ContentTypeMap[K]
): Promise<{
  section: string;
  updatedAt: string;
  updatedBy: string;
  versionCreated?: string;
}> {
  const response = await fetch(`/api/admin/content/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  
  return handleResponse(response);
}

// ============================================================================
// Versions API
// ============================================================================

export interface VersionsResponse {
  section: string;
  versions: VersionEntry[];
  count: number;
}

/**
 * Lists all versions for a section
 */
export async function fetchVersions(section: ContentSection): Promise<VersionsResponse> {
  const response = await fetch(`/api/admin/versions/${section}`);
  return handleResponse<VersionsResponse>(response);
}

/**
 * Rolls back to a specific version
 */
export async function rollbackVersion(
  section: ContentSection,
  request: RollbackRequest
): Promise<{
  section: string;
  restoredVersionId: string;
  backupVersionId: string;
  rolledBackAt: string;
  rolledBackBy: string;
}> {
  const response = await fetch(`/api/admin/versions/${section}/rollback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  return handleResponse(response);
}

// ============================================================================
// Upload API
// ============================================================================

/**
 * Uploads an image to R2
 */
export async function uploadImage(
  file: File,
  folder: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });
  
  return handleResponse<UploadResponse>(response);
}

/**
 * Deletes an image from R2
 */
export async function deleteImage(key: string): Promise<{ deleted: boolean; key: string }> {
  const response = await fetch(`/api/admin/upload/${key}`, {
    method: 'DELETE',
  });
  
  return handleResponse(response);
}

// ============================================================================
// Images API
// ============================================================================

export interface ImagesResponse {
  images: ImageListItem[];
  total: number;
  folders: string[];
}

/**
 * Lists all images in R2
 */
export async function fetchImages(folder?: string): Promise<ImagesResponse> {
  const url = folder ? `/api/admin/images?folder=${encodeURIComponent(folder)}` : '/api/admin/images';
  const response = await fetch(url);
  return handleResponse<ImagesResponse>(response);
}
