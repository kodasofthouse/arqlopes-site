/**
 * Content Types for ArqLopes CMS
 * All types map directly to R2 bucket content/*.json files
 */

// ============================================================================
// Hero Section (content/hero.json)
// ============================================================================

export interface HeroTitle {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
}

export interface HeroService {
  id: string;
  title: string;
  description: string;
  icon: string;
  ctaText?: string;
  color: string;
}

export interface HeroContent {
  title: HeroTitle;
  subtitle: string;
  ctaButton: string;
  backgroundImages: string[];
  services: HeroService[];
}

// ============================================================================
// About Section (content/about.json)
// ============================================================================

export interface AboutStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface AboutContent {
  title: string;
  description: string;
  stats: AboutStat[];
}

// ============================================================================
// Gallery Section (content/gallery.json)
// ============================================================================

export interface GalleryProject {
  id: string;
  title: string;
  tag: string;
  image: string;
  link?: string;
}

export interface GalleryContent {
  title: string;
  subtitle: string;
  description: string;
  projects: GalleryProject[];
}

// ============================================================================
// Clients Section (content/clients.json)
// ============================================================================

export interface Client {
  id: string;
  name: string;
  logo: string;
}

export interface ClientsContent {
  title: string;
  clients: Client[];
}

// ============================================================================
// Footer / Contact Section (content/footer.json)
// ============================================================================

export interface FooterAddress {
  line1: string;
  line2: string;
}

export interface FooterSocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface FooterContent {
  ctaTitle: string;
  phone: string;
  email: string;
  address: FooterAddress;
  socialLinks: FooterSocialLinks;
  tagline: string;
  newsletterTitle: string;
  newsletterButtonText: string;
}

// ============================================================================
// Site Metadata (content/metadata.json)
// ============================================================================

export interface SiteMetadata {
  siteName: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

// ============================================================================
// Versioning System (_versions/{section}/_index.json)
// ============================================================================

export interface VersionEntry {
  id: string;
  createdAt: string;
  createdBy: string;
  size: number;
  note?: string;
}

export interface VersionIndex {
  section: ContentSection;
  versions: VersionEntry[];
}

// ============================================================================
// Content Section Types
// ============================================================================

export const CONTENT_SECTIONS = [
  'hero',
  'about',
  'gallery',
  'clients',
  'footer',
  'metadata',
] as const;

export type ContentSection = (typeof CONTENT_SECTIONS)[number];

export type ContentTypeMap = {
  hero: HeroContent;
  about: AboutContent;
  gallery: GalleryContent;
  clients: ClientsContent;
  footer: FooterContent;
  metadata: SiteMetadata;
};

export type AllContent = {
  [K in ContentSection]: ContentTypeMap[K];
};

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

export interface ImageListItem {
  key: string;
  url: string;
  size: number;
  lastModified: string;
  contentType: string;
}

export interface ImageListResponse {
  images: ImageListItem[];
  total: number;
  folders: string[];
}

// ============================================================================
// R2 Image Folders
// ============================================================================

export const IMAGE_FOLDERS = [
  'images/hero',
  'images/gallery',
  'images/clients',
  'images/general',
] as const;

export type ImageFolder = (typeof IMAGE_FOLDERS)[number];

// ============================================================================
// Rollback Request
// ============================================================================

export interface RollbackRequest {
  versionId: string;
  note?: string;
}
