/**
 * POST /api/admin/upload
 * Protected endpoint to upload images to R2
 */

import { NextResponse } from 'next/server';
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { validateImage } from '@/lib/validation';
import { generateImageKey, VALIDATION_MESSAGES } from '@/lib/api-config';
import { uploadImageToR2 } from '@/lib/r2';
import type { CloudflareEnv } from '@/lib/r2';
import type { AllowedImageMimeType } from '@/lib/api-config';
import { IMAGE_FOLDERS, type ImageFolder, type UploadResponse } from '@/types/content';

export const runtime = 'edge';

export async function POST(request: Request): Promise<Response> {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return createErrorResponse('Invalid form data', 400);
  }
  
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return createErrorResponse('No file provided', 400);
  }
  
  const folderParam = formData.get('folder');
  if (!folderParam || typeof folderParam !== 'string') {
    return createErrorResponse('folder is required', 400);
  }
  
  if (!IMAGE_FOLDERS.includes(folderParam as ImageFolder)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid folder',
        validFolders: IMAGE_FOLDERS,
      },
      { status: 400 }
    );
  }
  
  const folder = folderParam as ImageFolder;
  
  const validationResult = validateImage(file.size, file.type, file.name);
  if (!validationResult.valid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Image validation failed',
        details: validationResult.errors,
      },
      { status: 400 }
    );
  }
  
  const env = (process as unknown as { env: CloudflareEnv }).env;
  
  if (!env.R2_ASSETS) {
    return createErrorResponse('R2 bucket not configured', 500);
  }
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const key = generateImageKey(folder, file.name);
    
    await uploadImageToR2(
      env.R2_ASSETS,
      key,
      arrayBuffer,
      file.type as AllowedImageMimeType
    );
    
    const r2Url = process.env.NEXT_PUBLIC_R2_URL ?? '';
    
    const response: UploadResponse = {
      url: `${r2Url}/${key}`,
      key,
      size: file.size,
      contentType: file.type,
    };
    
    return createSuccessResponse(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : VALIDATION_MESSAGES.UPLOAD_FAILED;
    return createErrorResponse(message, 500);
  }
}
