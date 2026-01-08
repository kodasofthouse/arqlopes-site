# ArqLopes CMS Backend - Technical Specification

## Overview

Serverless backend for the ArqLopes architecture website, enabling the client to manage content (texts, images, gallery projects, client logos) without developer intervention.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Cloudflare Infrastructure                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Cloudflare  │    │  Cloudflare  │    │  Cloudflare  │       │
│  │    Pages     │───▶│  Functions   │───▶│     R2       │       │
│  │  (Next.js)   │    │    (API)     │    │(JSON+Images) │       │
│  └──────────────┘    └──────┬───────┘    └──────────────┘       │
│                             │                                    │
│                             ▼                                    │
│                      ┌──────────────┐                           │
│                      │  Cloudflare  │                           │
│                      │    Access    │                           │
│                      │    (Auth)    │                           │
│                      └──────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js 15 (App Router) | Website + Admin UI |
| Hosting | Cloudflare Pages | Edge deployment |
| API | Cloudflare Functions | Serverless endpoints |
| Storage | Cloudflare R2 | JSON content + images |
| Authentication | Cloudflare Access | Passwordless email OTP |

## R2 Bucket Structure

```
arqlopes-assets/
├── content/
│   ├── hero.json
│   ├── about.json
│   ├── gallery.json
│   ├── clients.json
│   ├── footer.json
│   └── metadata.json
│
├── _versions/
│   ├── hero/
│   │   ├── _index.json           # version manifest
│   │   ├── 2026-01-07T10-30-00.json
│   │   ├── 2026-01-07T15-45-22.json
│   │   └── ...
│   ├── about/
│   │   └── ...
│   └── ...
│
├── images/
│   ├── hero/
│   │   ├── background-1.jpg
│   │   └── ...
│   ├── gallery/
│   │   ├── project-{id}.jpg
│   │   └── ...
│   ├── clients/
│   │   ├── logo-{id}.png
│   │   └── ...
│   └── general/
│       └── ...
│
└── _trash/                       # soft-deleted files
    └── ...
```

## Versioning System

Simple file-based versioning for content rollback.

### How it works

1. **On Save**: Before overwriting `content/{section}.json`, copy current version to `_versions/{section}/{timestamp}.json`
2. **Index**: Update `_versions/{section}/_index.json` with version metadata
3. **Limit**: Keep only last 10 versions per section
4. **Rollback**: Copy selected version back to `content/{section}.json`

### Version Index Structure

**Path:** `_versions/{section}/_index.json`

```typescript
interface VersionIndex {
  section: string;
  versions: {
    id: string;              // timestamp ISO format
    createdAt: string;       // ISO datetime
    createdBy: string;       // email from Cloudflare Access
    size: number;            // bytes
    note?: string;           // optional change note
  }[];
}
```

**Example:**

```json
{
  "section": "hero",
  "versions": [
    {
      "id": "2026-01-07T15-45-22",
      "createdAt": "2026-01-07T15:45:22Z",
      "createdBy": "cliente@arqlopes.com.br",
      "size": 2048
    },
    {
      "id": "2026-01-07T10-30-00",
      "createdAt": "2026-01-07T10:30:00Z",
      "createdBy": "cliente@arqlopes.com.br",
      "size": 1920
    }
  ]
}
```

### Rollback Flow

```
Admin selects version → API copies version to content/{section}.json
                      → Creates new version entry (current becomes a version)
                      → Returns success
```

## Content Structure

### 1. Hero Section

**Path:** `content/hero.json`

```typescript
interface HeroContent {
  title: {
    line1: string;      // "Obras que"
    line2: string;      // "impressionam no"
    line3: string;      // "resultado e"
    line4: string;      // "surpreendem."
  };
  subtitle: string;
  ctaButton: string;
  backgroundImages: string[];  // R2 URLs (max 4)
  services: {
    id: string;
    title: string;
    description: string;
    icon: string;       // R2 URL
    ctaText?: string;
    color: string;      // hex color
  }[];
}
```

### 2. About Section

**Path:** `content/about.json`

```typescript
interface AboutContent {
  title: string;
  description: string;  // supports \n for line breaks
  stats: {
    id: string;
    value: number;
    suffix: string;     // e.g., "+"
    label: string;
  }[];
}
```

### 3. Gallery Section

**Path:** `content/gallery.json`

```typescript
interface GalleryContent {
  title: string;
  subtitle: string;
  description: string;
  projects: {
    id: string;
    title: string;
    tag: string;
    image: string;      // R2 URL
    link?: string;
  }[];
}
```

### 4. Clients Section

**Path:** `content/clients.json`

```typescript
interface ClientsContent {
  title: string;
  clients: {
    id: string;
    name: string;
    logo: string;       // R2 URL
  }[];
}
```

### 5. Footer / Contact Section

**Path:** `content/footer.json`

```typescript
interface FooterContent {
  ctaTitle: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    line2: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  tagline: string;
  newsletterTitle: string;
  newsletterButtonText: string;
}
```

### 6. Site Metadata

**Path:** `content/metadata.json`

```typescript
interface SiteMetadata {
  siteName: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;      // R2 URL
}
```

## API Endpoints

### Public Endpoints (No Auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/content/:section` | Get content for a section |
| GET | `/api/content` | Get all content |

### Protected Endpoints (Cloudflare Access)

| Method | Path | Description |
|--------|------|-------------|
| PUT | `/api/admin/content/:section` | Update section content |
| GET | `/api/admin/versions/:section` | List versions for section |
| POST | `/api/admin/versions/:section/rollback` | Rollback to version |
| POST | `/api/admin/upload` | Upload image to R2 |
| DELETE | `/api/admin/upload/:key` | Delete image from R2 |
| GET | `/api/admin/images` | List all images in R2 |

## Authentication Flow

1. User navigates to `/admin`
2. Cloudflare Access intercepts request
3. User enters email → receives 6-digit OTP
4. Valid OTP → Access grants JWT cookie
5. All `/admin/*` and `/api/admin/*` routes are protected
6. User email extracted from `CF-Access-Authenticated-User-Email` header

## Admin Panel Pages

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard with quick links |
| `/admin/hero` | Edit hero section |
| `/admin/about` | Edit about section |
| `/admin/gallery` | Manage gallery projects |
| `/admin/clients` | Manage client logos |
| `/admin/footer` | Edit footer/contact info |
| `/admin/media` | Media library (all images) |
| `/admin/versions` | Version history & rollback |

## Data Flow

### Reading Content (Public)

```
Browser → Next.js SSR → fetch R2 (CDN cached) → Render
```

```typescript
// lib/content.ts
const R2_BASE = process.env.NEXT_PUBLIC_R2_URL;

export async function getContent<T>(section: string): Promise<T> {
  const res = await fetch(`${R2_BASE}/content/${section}.json`, {
    next: { revalidate: 60 }  // cache 60 seconds
  });
  
  if (!res.ok) throw new Error(`Failed to fetch ${section}`);
  return res.json();
}
```

### Updating Content (Admin)

```
Admin UI → API Function → Create version backup → Write to R2 → Purge cache
```

## Caching Strategy

| Content Type | Cache | TTL |
|--------------|-------|-----|
| JSON content | R2 CDN + Next.js | 60 seconds |
| Images | R2 CDN | 1 year (cache-control: immutable) |
| Admin API | No cache | - |
| Versions | No cache | - |

## Image Handling

1. **Upload**: Admin uploads image → API validates/optimizes → R2
2. **Serve**: Next.js Image component → R2 public URL (CDN cached)
3. **Delete**: Move to `_trash/` prefix → Hard delete after 30 days

## Environment Variables

```env
# Public (exposed to client)
NEXT_PUBLIC_R2_URL=https://assets.arqlopes.com.br

# Server only (Cloudflare bindings - auto-injected)
# R2_ASSETS - R2 bucket binding
```

## Constraints

- Max image size: 10MB
- Supported formats: JPEG, PNG, WebP
- Max gallery projects: 50
- Max client logos: 30
- Max versions per section: 10
- JSON content max size: 1MB per file

## Security

- All admin routes protected by Cloudflare Access
- R2 bucket: public read, authenticated write
- User actions logged with email from Access headers
- No sensitive data stored (all content is public)
