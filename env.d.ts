/**
 * Environment Type Declarations
 * Extends NodeJS namespace with Cloudflare bindings
 */

import type { R2Bucket } from './lib/r2';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Public R2 URL for assets */
      NEXT_PUBLIC_R2_URL: string;
    }
  }
}

/**
 * Cloudflare Functions environment bindings
 * These are available in the edge runtime
 */
declare module 'cloudflare:workers' {
  interface Env {
    /** R2 bucket for storing content and images */
    R2_ASSETS: R2Bucket;
  }
}

export {};
