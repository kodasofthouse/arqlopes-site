/**
 * POST /api/admin/versions/:section/rollback
 * Protected endpoint to rollback to a specific version
 */

import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { isValidSection } from '@/lib/validation';
import { VALIDATION_MESSAGES } from '@/lib/api-config';
import { rollbackToVersion } from '@/lib/versioning';
import type { CloudflareEnv } from '@/lib/r2';
import type { ContentSection, RollbackRequest } from '@/types/content';



interface RouteContext {
  params: Promise<{
    section: string;
  }>;
}

export async function POST(
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
  
  let body: RollbackRequest;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse(VALIDATION_MESSAGES.INVALID_REQUEST_BODY, 400);
  }
  
  if (!body.versionId || typeof body.versionId !== 'string') {
    return NextResponse.json(
      {
        success: false,
        error: 'versionId is required',
      },
      { status: 400 }
    );
  }
  
  const { env } = getCloudflareContext() as { env: CloudflareEnv };
  
  if (!env.R2_ASSETS) {
    return createErrorResponse('R2 bucket not configured', 500);
  }
  
  try {
    const result = await rollbackToVersion(
      env.R2_ASSETS,
      section as ContentSection,
      body.versionId,
      email,
      body.note
    );
    
    if (!result.success) {
      return createErrorResponse(result.error ?? VALIDATION_MESSAGES.ROLLBACK_FAILED, 400);
    }
    
    return createSuccessResponse({
      section,
      restoredVersionId: result.restoredVersionId,
      backupVersionId: result.newVersionId,
      rolledBackAt: new Date().toISOString(),
      rolledBackBy: email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : VALIDATION_MESSAGES.ROLLBACK_FAILED;
    return createErrorResponse(message, 500);
  }
}
