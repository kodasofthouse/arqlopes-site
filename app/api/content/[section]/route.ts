/**
 * GET /api/content/:section
 * Public endpoint to fetch content for a specific section
 */

import { NextResponse } from 'next/server';
import { getContent } from '@/lib/content';
import { isValidSection } from '@/lib/validation';
import { CONTENT_CACHE_TTL_SECONDS, VALIDATION_MESSAGES } from '@/lib/api-config';
import type { ContentSection } from '@/types/content';

export const runtime = 'edge';

interface RouteParams {
  params: Promise<{
    section: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<Response> {
  const { section } = await params;
  
  if (!isValidSection(section)) {
    return NextResponse.json(
      {
        success: false,
        error: VALIDATION_MESSAGES.INVALID_SECTION,
      },
      { status: 400 }
    );
  }
  
  try {
    const content = await getContent(section as ContentSection);
    
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
    
    const status = message.includes('404') ? 404 : 500;
    
    return NextResponse.json(
      {
        success: false,
        error: status === 404 ? VALIDATION_MESSAGES.CONTENT_NOT_FOUND : message,
      },
      { status }
    );
  }
}
