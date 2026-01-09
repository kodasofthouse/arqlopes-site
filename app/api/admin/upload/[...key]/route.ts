/**
 * DELETE /api/admin/upload/:key
 * Protected endpoint to delete images from R2 (soft delete to _trash)
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { VALIDATION_MESSAGES, R2_PATHS } from '@/lib/api-config';
import { softDeleteFromR2 } from '@/lib/r2';
import type { CloudflareEnv } from '@/lib/r2';



interface RouteContext {
  params: Promise<{
    key: string[];
  }>;
}

export async function DELETE(
  request: Request,
  context: RouteContext
): Promise<Response> {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const { key: keyParts } = await context.params;
  
  if (!keyParts || keyParts.length === 0) {
    return createErrorResponse('Image key is required', 400);
  }
  
  const key = keyParts.join('/');
  
  if (!key.startsWith(R2_PATHS.IMAGES)) {
    return createErrorResponse('Invalid image key - must be in images folder', 400);
  }
  
  const { env } = await getCloudflareContext<CloudflareEnv>();
  
  if (!env.R2_ASSETS) {
    return createErrorResponse('R2 bucket not configured', 500);
  }
  
  try {
    await softDeleteFromR2(env.R2_ASSETS, key);
    
    return createSuccessResponse({
      deleted: true,
      key,
      movedToTrash: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : VALIDATION_MESSAGES.DELETE_FAILED;
    
    if (message.includes('not found')) {
      return createErrorResponse(VALIDATION_MESSAGES.FILE_NOT_FOUND, 404);
    }
    
    return createErrorResponse(message, 500);
  }
}
