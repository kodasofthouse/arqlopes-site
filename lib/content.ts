/**
 * Content Library for Public Reads
 * Fetches content from R2 with caching support
 */

import { CONTENT_CACHE_TTL_SECONDS } from './api-config';
import type {
  ContentSection,
  ContentTypeMap,
  AllContent,
  HeroContent,
  AboutContent,
  GalleryContent,
  ClientsContent,
  FooterContent,
  SiteMetadata,
} from '@/types/content';

// ============================================================================
// Configuration
// ============================================================================

/**
 * R2 Base URL from environment
 * Falls back to empty string for build-time type safety
 */
function getR2BaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_R2_URL;
  if (!url) {
    console.warn('NEXT_PUBLIC_R2_URL is not configured');
    return '';
  }
  return url;
}

// ============================================================================
// Generic Content Fetcher
// ============================================================================

/**
 * Fetches content for a specific section from R2
 * Uses Next.js fetch caching with revalidation
 */
export async function getContent<K extends ContentSection>(
  section: K
): Promise<ContentTypeMap[K]> {
  const baseUrl = getR2BaseUrl();
  
  if (!baseUrl) {
    throw new Error('R2 URL is not configured');
  }
  
  const url = `${baseUrl}/content/${section}.json`;
  
  const response = await fetch(url, {
    next: { revalidate: CONTENT_CACHE_TTL_SECONDS },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${section}: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// ============================================================================
// Typed Section Fetchers
// ============================================================================

/**
 * Fetches hero section content
 */
export async function getHeroContent(): Promise<HeroContent> {
  return getContent('hero');
}

/**
 * Fetches about section content
 */
export async function getAboutContent(): Promise<AboutContent> {
  return getContent('about');
}

/**
 * Fetches gallery section content
 */
export async function getGalleryContent(): Promise<GalleryContent> {
  return getContent('gallery');
}

/**
 * Fetches clients section content
 */
export async function getClientsContent(): Promise<ClientsContent> {
  return getContent('clients');
}

/**
 * Fetches footer section content
 */
export async function getFooterContent(): Promise<FooterContent> {
  return getContent('footer');
}

/**
 * Fetches site metadata
 */
export async function getSiteMetadata(): Promise<SiteMetadata> {
  return getContent('metadata');
}

// ============================================================================
// All Content Fetcher
// ============================================================================

/**
 * Fetches all content sections in parallel
 */
export async function getAllContent(): Promise<AllContent> {
  const [hero, about, gallery, clients, footer, metadata] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getGalleryContent(),
    getClientsContent(),
    getFooterContent(),
    getSiteMetadata(),
  ]);
  
  return {
    hero,
    about,
    gallery,
    clients,
    footer,
    metadata,
  };
}

// ============================================================================
// Optional Content Fetchers (with fallback)
// ============================================================================

/**
 * Fetches content with a fallback value if fetch fails
 */
export async function getContentWithFallback<K extends ContentSection>(
  section: K,
  fallback: ContentTypeMap[K]
): Promise<ContentTypeMap[K]> {
  try {
    return await getContent(section);
  } catch (error) {
    console.error(`Failed to fetch ${section}, using fallback:`, error);
    return fallback;
  }
}

// ============================================================================
// Cache Invalidation (for use after content updates)
// ============================================================================

/**
 * Fetches fresh content bypassing cache
 * Use this after content updates to get the latest version
 */
export async function getFreshContent<K extends ContentSection>(
  section: K
): Promise<ContentTypeMap[K]> {
  const baseUrl = getR2BaseUrl();
  
  if (!baseUrl) {
    throw new Error('R2 URL is not configured');
  }
  
  const url = `${baseUrl}/content/${section}.json`;
  
  const response = await fetch(url, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${section}: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
