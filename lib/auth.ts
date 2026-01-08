/**
 * Authentication Utilities for Cloudflare Access
 * Extracts and validates user information from request headers
 */

import { CLOUDFLARE_ACCESS_EMAIL_HEADER, VALIDATION_MESSAGES } from './api-config';

// ============================================================================
// Types
// ============================================================================

export interface AuthResult {
  authenticated: boolean;
  email?: string;
  error?: string;
}

// ============================================================================
// Header Extraction
// ============================================================================

/**
 * Extracts the authenticated user email from Cloudflare Access headers
 * This header is automatically set by Cloudflare Access when the user is authenticated
 */
export function getAuthenticatedUser(request: Request): AuthResult {
  const email = request.headers.get(CLOUDFLARE_ACCESS_EMAIL_HEADER);
  
  if (!email) {
    return {
      authenticated: false,
      error: VALIDATION_MESSAGES.MISSING_USER_EMAIL,
    };
  }
  
  if (!isValidEmail(email)) {
    return {
      authenticated: false,
      error: 'Invalid email format in authentication header',
    };
  }
  
  return {
    authenticated: true,
    email,
  };
}

/**
 * Validates an email format
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Middleware helper to require authentication
 * Returns a Response if not authenticated, null if authenticated
 */
export function requireAuth(request: Request): { email: string } | Response {
  const auth = getAuthenticatedUser(request);
  
  if (!auth.authenticated || !auth.email) {
    return new Response(
      JSON.stringify({
        success: false,
        error: auth.error ?? VALIDATION_MESSAGES.UNAUTHORIZED,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  return { email: auth.email };
}

/**
 * Creates a JSON error response
 */
export function createErrorResponse(
  error: string,
  status: number = 400
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Creates a JSON success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Creates a no-cache JSON response
 */
export function createNoCacheResponse<T>(
  data: T,
  status: number = 200
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    }
  );
}
