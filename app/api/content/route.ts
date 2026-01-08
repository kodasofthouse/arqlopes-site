/**
 * GET /api/content
 * Public endpoint to fetch all content sections
 */

import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/content';
import { CONTENT_CACHE_TTL_SECONDS } from '@/lib/api-config';

export const runtime = 'edge';

export async function GET(): Promise<Response> {
  try {
    const content = await getAllContent();
    
    return NextResponse.json(
      {
        success: true,
        data: content,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': `public, s-maxage=${CONTENT_CACHE_TTL_SECONDS}, stale-while-revalidate=${CONTENT_CACHE_TTL_SECONDS * 2}`,
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content';
    
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
