/**
 * Content Validation Layer
 * Validates all content types and images against spec constraints
 */

import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_JSON_SIZE_BYTES,
  MAX_GALLERY_PROJECTS,
  MAX_CLIENT_LOGOS,
  MAX_HERO_BACKGROUND_IMAGES,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  VALIDATION_MESSAGES,
  type AllowedImageMimeType,
} from './api-config';
import {
  CONTENT_SECTIONS,
  type ContentSection,
  type HeroContent,
  type AboutContent,
  type GalleryContent,
  type ClientsContent,
  type FooterContent,
  type SiteMetadata,
} from '@/types/content';

// ============================================================================
// Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// Generic Validators
// ============================================================================

/**
 * Validates that a string is not empty
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a value is a non-negative number
 */
function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

/**
 * Validates that a value is a valid URL string
 */
function isValidUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  if (value.startsWith('/')) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a hex color string
 */
function isValidHexColor(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

/**
 * Validates an email string
 */
function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validates an array with items
 */
function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Validates optional string URL (can be undefined or valid URL)
 */
function isOptionalUrl(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true;
  return isValidUrl(value);
}

// ============================================================================
// Section Validator
// ============================================================================

/**
 * Validates that a section name is valid
 */
export function isValidSection(section: string): section is ContentSection {
  return CONTENT_SECTIONS.includes(section as ContentSection);
}

// ============================================================================
// Image Validators
// ============================================================================

/**
 * Validates image file size
 */
export function validateImageSize(sizeBytes: number): ValidationResult {
  if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      errors: [VALIDATION_MESSAGES.IMAGE_TOO_LARGE],
    };
  }
  return { valid: true, errors: [] };
}

/**
 * Validates image MIME type
 */
export function validateImageType(contentType: string): ValidationResult {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(contentType as AllowedImageMimeType)) {
    return {
      valid: false,
      errors: [VALIDATION_MESSAGES.INVALID_IMAGE_TYPE],
    };
  }
  return { valid: true, errors: [] };
}

/**
 * Validates image file extension
 */
export function validateImageExtension(filename: string): ValidationResult {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (!ext || !ALLOWED_IMAGE_EXTENSIONS.includes(ext as typeof ALLOWED_IMAGE_EXTENSIONS[number])) {
    return {
      valid: false,
      errors: [VALIDATION_MESSAGES.INVALID_IMAGE_TYPE],
    };
  }
  return { valid: true, errors: [] };
}

/**
 * Full image validation
 */
export function validateImage(
  sizeBytes: number,
  contentType: string,
  filename: string
): ValidationResult {
  const errors: string[] = [];
  
  const sizeResult = validateImageSize(sizeBytes);
  if (!sizeResult.valid) errors.push(...sizeResult.errors);
  
  const typeResult = validateImageType(contentType);
  if (!typeResult.valid) errors.push(...typeResult.errors);
  
  const extResult = validateImageExtension(filename);
  if (!extResult.valid) errors.push(...extResult.errors);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// JSON Size Validator
// ============================================================================

/**
 * Validates JSON content size
 */
export function validateJsonSize(content: unknown): ValidationResult {
  const jsonString = JSON.stringify(content);
  const sizeBytes = new TextEncoder().encode(jsonString).length;
  
  if (sizeBytes > MAX_JSON_SIZE_BYTES) {
    return {
      valid: false,
      errors: [VALIDATION_MESSAGES.CONTENT_TOO_LARGE],
    };
  }
  return { valid: true, errors: [] };
}

// ============================================================================
// Hero Content Validator
// ============================================================================

/**
 * Validates Hero content structure
 */
export function validateHeroContent(content: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'object') {
    return { valid: false, errors: ['Content must be an object'] };
  }
  
  const hero = content as Partial<HeroContent>;
  
  if (!hero.title || typeof hero.title !== 'object') {
    errors.push('title is required and must be an object');
  } else {
    if (!isNonEmptyString(hero.title.line1)) errors.push('title.line1 is required');
    if (!isNonEmptyString(hero.title.line2)) errors.push('title.line2 is required');
    if (!isNonEmptyString(hero.title.line3)) errors.push('title.line3 is required');
    if (!isNonEmptyString(hero.title.line4)) errors.push('title.line4 is required');
  }
  
  if (!isNonEmptyString(hero.subtitle)) {
    errors.push('subtitle is required');
  }
  
  if (!isNonEmptyString(hero.ctaButton)) {
    errors.push('ctaButton is required');
  }
  
  if (!Array.isArray(hero.backgroundImages)) {
    errors.push('backgroundImages must be an array');
  } else {
    if (hero.backgroundImages.length > MAX_HERO_BACKGROUND_IMAGES) {
      errors.push(VALIDATION_MESSAGES.MAX_HERO_IMAGES_EXCEEDED);
    }
    hero.backgroundImages.forEach((img, i) => {
      if (!isValidUrl(img)) {
        errors.push(`backgroundImages[${i}] must be a valid URL`);
      }
    });
  }
  
  if (!Array.isArray(hero.services)) {
    errors.push('services must be an array');
  } else {
    hero.services.forEach((service, i) => {
      if (!isNonEmptyString(service.id)) errors.push(`services[${i}].id is required`);
      if (!isNonEmptyString(service.title)) errors.push(`services[${i}].title is required`);
      if (!isNonEmptyString(service.description)) errors.push(`services[${i}].description is required`);
      if (!isValidUrl(service.icon)) errors.push(`services[${i}].icon must be a valid URL`);
      if (!isValidHexColor(service.color)) errors.push(`services[${i}].color must be a valid hex color`);
    });
  }
  
  const sizeResult = validateJsonSize(content);
  if (!sizeResult.valid) errors.push(...sizeResult.errors);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// About Content Validator
// ============================================================================

/**
 * Validates About content structure
 */
export function validateAboutContent(content: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'object') {
    return { valid: false, errors: ['Content must be an object'] };
  }
  
  const about = content as Partial<AboutContent>;
  
  if (!isNonEmptyString(about.title)) {
    errors.push('title is required');
  }
  
  if (!isNonEmptyString(about.description)) {
    errors.push('description is required');
  }
  
  if (!Array.isArray(about.stats)) {
    errors.push('stats must be an array');
  } else {
    about.stats.forEach((stat, i) => {
      if (!isNonEmptyString(stat.id)) errors.push(`stats[${i}].id is required`);
      if (!isNonNegativeNumber(stat.value)) errors.push(`stats[${i}].value must be a non-negative number`);
      if (typeof stat.suffix !== 'string') errors.push(`stats[${i}].suffix is required`);
      if (!isNonEmptyString(stat.label)) errors.push(`stats[${i}].label is required`);
    });
  }
  
  const sizeResult = validateJsonSize(content);
  if (!sizeResult.valid) errors.push(...sizeResult.errors);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Gallery Content Validator
// ============================================================================

/**
 * Validates Gallery content structure
 */
export function validateGalleryContent(content: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'object') {
    return { valid: false, errors: ['Content must be an object'] };
  }
  
  const gallery = content as Partial<GalleryContent>;
  
  if (!isNonEmptyString(gallery.title)) {
    errors.push('title is required');
  }
  
  if (!isNonEmptyString(gallery.subtitle)) {
    errors.push('subtitle is required');
  }
  
  if (!isNonEmptyString(gallery.description)) {
    errors.push('description is required');
  }
  
  if (!Array.isArray(gallery.projects)) {
    errors.push('projects must be an array');
  } else {
    if (gallery.projects.length > MAX_GALLERY_PROJECTS) {
      errors.push(VALIDATION_MESSAGES.MAX_GALLERY_EXCEEDED);
    }
    gallery.projects.forEach((project, i) => {
      if (!isNonEmptyString(project.id)) errors.push(`projects[${i}].id is required`);
      if (!isNonEmptyString(project.title)) errors.push(`projects[${i}].title is required`);
      if (!isNonEmptyString(project.tag)) errors.push(`projects[${i}].tag is required`);
      if (!isValidUrl(project.image)) errors.push(`projects[${i}].image must be a valid URL`);
      if (!isOptionalUrl(project.link)) errors.push(`projects[${i}].link must be a valid URL if provided`);
    });
  }
  
  const sizeResult = validateJsonSize(content);
  if (!sizeResult.valid) errors.push(...sizeResult.errors);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Clients Content Validator
// ============================================================================

/**
 * Validates Clients content structure
 */
export function validateClientsContent(content: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'object') {
    return { valid: false, errors: ['Content must be an object'] };
  }
  
  const clients = content as Partial<ClientsContent>;
  
  if (!isNonEmptyString(clients.title)) {
    errors.push('title is required');
  }
  
  if (!Array.isArray(clients.clients)) {
    errors.push('clients must be an array');
  } else {
    if (clients.clients.length > MAX_CLIENT_LOGOS) {
      errors.push(VALIDATION_MESSAGES.MAX_CLIENTS_EXCEEDED);
    }
    clients.clients.forEach((client, i) => {
      if (!isNonEmptyString(client.id)) errors.push(`clients[${i}].id is required`);
      if (!isNonEmptyString(client.name)) errors.push(`clients[${i}].name is required`);
      if (!isValidUrl(client.logo)) errors.push(`clients[${i}].logo must be a valid URL`);
    });
  }
  
  const sizeResult = validateJsonSize(content);
  if (!sizeResult.valid) errors.push(...sizeResult.errors);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Footer Content Validator
// ============================================================================

/**
 * Validates Footer content structure
 */
export function validateFooterContent(content: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'object') {
    return { valid: false, errors: ['Content must be an object'] };
  }
  
  const footer = content as Partial<FooterContent>;
  
  if (!isNonEmptyString(footer.ctaTitle)) {
    errors.push('ctaTitle is required');
  }
  
  if (!isNonEmptyString(footer.phone)) {
    errors.push('phone is required');
  }
  
  if (!isValidEmail(footer.email)) {
    errors.push('email must be a valid email address');
  }
  
  if (!footer.address || typeof footer.address !== 'object') {
    errors.push('address is required and must be an object');
  } else {
    if (!isNonEmptyString(footer.address.line1)) errors.push('address.line1 is required');
    if (!isNonEmptyString(footer.address.line2)) errors.push('address.line2 is required');
  }
  
  if (!footer.socialLinks || typeof footer.socialLinks !== 'object') {
    errors.push('socialLinks is required and must be an object');
  } else {
    if (!isOptionalUrl(footer.socialLinks.facebook)) {
      errors.push('socialLinks.facebook must be a valid URL if provided');
    }
    if (!isOptionalUrl(footer.socialLinks.instagram)) {
      errors.push('socialLinks.instagram must be a valid URL if provided');
    }
    if (!isOptionalUrl(footer.socialLinks.linkedin)) {
      errors.push('socialLinks.linkedin must be a valid URL if provided');
    }
  }
  
  if (!isNonEmptyString(footer.tagline)) {
    errors.push('tagline is required');
  }
  
  if (!isNonEmptyString(footer.newsletterTitle)) {
    errors.push('newsletterTitle is required');
  }
  
  if (!isNonEmptyString(footer.newsletterButtonText)) {
    errors.push('newsletterButtonText is required');
  }
  
  const sizeResult = validateJsonSize(content);
  if (!sizeResult.valid) errors.push(...sizeResult.errors);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Metadata Content Validator
// ============================================================================

/**
 * Validates Metadata content structure
 */
export function validateMetadataContent(content: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'object') {
    return { valid: false, errors: ['Content must be an object'] };
  }
  
  const metadata = content as Partial<SiteMetadata>;
  
  if (!isNonEmptyString(metadata.siteName)) {
    errors.push('siteName is required');
  }
  
  if (!isNonEmptyString(metadata.seoTitle)) {
    errors.push('seoTitle is required');
  }
  
  if (!isNonEmptyString(metadata.seoDescription)) {
    errors.push('seoDescription is required');
  }
  
  if (!isValidUrl(metadata.ogImage)) {
    errors.push('ogImage must be a valid URL');
  }
  
  const sizeResult = validateJsonSize(content);
  if (!sizeResult.valid) errors.push(...sizeResult.errors);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Content Validator Router
// ============================================================================

/**
 * Validates content based on section type
 */
export function validateContent(
  section: ContentSection,
  content: unknown
): ValidationResult {
  switch (section) {
    case 'hero':
      return validateHeroContent(content);
    case 'about':
      return validateAboutContent(content);
    case 'gallery':
      return validateGalleryContent(content);
    case 'clients':
      return validateClientsContent(content);
    case 'footer':
      return validateFooterContent(content);
    case 'metadata':
      return validateMetadataContent(content);
    default:
      return {
        valid: false,
        errors: [VALIDATION_MESSAGES.INVALID_SECTION],
      };
  }
}
