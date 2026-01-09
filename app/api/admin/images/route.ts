/**
 * GET /api/admin/images
 * Protected endpoint to list all images in R2
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { requireAuth, createErrorResponse, createNoCacheResponse } from '@/lib/auth';
import { listImagesFromR2, listImageFoldersFromR2 } from '@/lib/r2';
import type { CloudflareEnv } from '@/lib/r2';
import type { ImageListResponse } from '@/types/content';



export async function GET(request: Request): Promise<Response> {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const url = new URL(request.url);
  const prefix = url.searchParams.get('folder') ?? undefined;
  
  const { env } = await getCloudflareContext<CloudflareEnv>();
  
  if (!env.R2_ASSETS) {
    return createErrorResponse('R2 bucket not configured', 500);
  }
  
  try {
    const [images, folders] = await Promise.all([
      listImagesFromR2(env.R2_ASSETS, prefix),
      listImageFoldersFromR2(env.R2_ASSETS),
    ]);
    
    const response: ImageListResponse = {
      images,
      total: images.length,
      folders,
    };
    
    return createNoCacheResponse(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list images';
    return createErrorResponse(message, 500);
  }
}
