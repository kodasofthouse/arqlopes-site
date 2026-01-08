/**
 * GET /api/admin/versions/:section
 * Protected endpoint to list all versions for a section
 */

import { requireAuth, createErrorResponse, createNoCacheResponse } from '@/lib/auth';
import { isValidSection } from '@/lib/validation';
import { VALIDATION_MESSAGES } from '@/lib/api-config';
import { listVersions } from '@/lib/versioning';
import type { CloudflareEnv } from '@/lib/r2';
import type { ContentSection } from '@/types/content';

export const runtime = 'edge';

interface RouteContext {
  params: Promise<{
    section: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext
): Promise<Response> {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const { section } = await context.params;
  
  if (!isValidSection(section)) {
    return createErrorResponse(VALIDATION_MESSAGES.INVALID_SECTION, 400);
  }
  
  const env = (process as unknown as { env: CloudflareEnv }).env;
  
  if (!env.R2_ASSETS) {
    return createErrorResponse('R2 bucket not configured', 500);
  }
  
  try {
    const versions = await listVersions(env.R2_ASSETS, section as ContentSection);
    
    return createNoCacheResponse({
      section,
      versions,
      count: versions.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list versions';
    return createErrorResponse(message, 500);
  }
}
