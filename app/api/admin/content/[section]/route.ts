/**
 * PUT /api/admin/content/:section
 * Protected endpoint to update content for a specific section
 */

import { NextResponse } from 'next/server';
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { isValidSection, validateContent } from '@/lib/validation';
import { VALIDATION_MESSAGES } from '@/lib/api-config';
import { writeJsonToR2, getContentKey } from '@/lib/r2';
import { createVersion } from '@/lib/versioning';
import type { CloudflareEnv } from '@/lib/r2';
import type { ContentSection } from '@/types/content';

export const runtime = 'edge';

interface RouteContext {
  params: Promise<{
    section: string;
  }>;
}

export async function PUT(
  request: Request,
  context: RouteContext
): Promise<Response> {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  const { email } = authResult;
  
  const { section } = await context.params;
  
  if (!isValidSection(section)) {
    return createErrorResponse(VALIDATION_MESSAGES.INVALID_SECTION, 400);
  }
  
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse(VALIDATION_MESSAGES.INVALID_REQUEST_BODY, 400);
  }
  
  const validationResult = validateContent(section as ContentSection, body);
  if (!validationResult.valid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: validationResult.errors,
      },
      { status: 400 }
    );
  }
  
  const env = (process as unknown as { env: CloudflareEnv }).env;
  
  if (!env.R2_ASSETS) {
    return createErrorResponse('R2 bucket not configured', 500);
  }
  
  const bucket = env.R2_ASSETS;
  
  const versionResult = await createVersion(bucket, {
    section: section as ContentSection,
    userEmail: email,
    note: 'Content update',
  });
  
  if (!versionResult.success) {
    console.error('Failed to create version backup:', versionResult.error);
  }
  
  try {
    const contentKey = getContentKey(section);
    await writeJsonToR2(bucket, contentKey, body);
    
    return createSuccessResponse({
      section,
      updatedAt: new Date().toISOString(),
      updatedBy: email,
      versionCreated: versionResult.versionId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update content';
    return createErrorResponse(message, 500);
  }
}
