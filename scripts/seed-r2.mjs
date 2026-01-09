#!/usr/bin/env node
/**
 * R2 Seed Script
 * Uploads initial content and images to Cloudflare R2
 * 
 * Usage: npm run r2:seed
 * 
 * Prerequisites:
 * 1. Run: npx wrangler login
 * 2. Create R2 bucket: arqlopes-assets
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, basename, extname } from 'path';

const BUCKET_NAME = 'arqlopes-assets';

// Helper to run wrangler commands
function r2Put(key, localPath) {
  const cmd = `npx wrangler r2 object put ${BUCKET_NAME}/${key} --file="${localPath}"`;
  console.log(`  ↑ ${key}`);
  try {
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`    ✗ Failed: ${error.message}`);
    return false;
  }
}

function r2PutJson(key, jsonContent) {
  const tempFile = join(process.cwd(), '.temp-seed.json');
  
  try {
    writeFileSync(tempFile, JSON.stringify(jsonContent));
    const cmd = `npx wrangler r2 object put ${BUCKET_NAME}/${key} --file="${tempFile}" --content-type="application/json"`;
    console.log(`  ↑ ${key}`);
    execSync(cmd, { stdio: 'pipe' });
    unlinkSync(tempFile);
    return true;
  } catch (error) {
    console.error(`    ✗ Failed: ${error.message}`);
    try { unlinkSync(tempFile); } catch {}
    return false;
  }
}

// Paths
const ROOT = process.cwd();
const SEED_DIR = join(ROOT, 'data', 'seed');
const PUBLIC_DIR = join(ROOT, 'public');

console.log('\n🚀 ArqLopes R2 Seed Script\n');
console.log('═'.repeat(50));

// 1. Create folder structure placeholders
console.log('\n📁 Creating folder structure...\n');
const folders = [
  'content/.keep',
  '_versions/.keep',
  '_versions/hero/_index.json',
  '_versions/about/_index.json',
  '_versions/gallery/_index.json',
  '_versions/clients/_index.json',
  '_versions/footer/_index.json',
  '_versions/metadata/_index.json',
  'images/hero/.keep',
  'images/gallery/.keep',
  'images/clients/.keep',
  'images/general/.keep',
  '_trash/.keep',
];

// Create version indexes
const sections = ['hero', 'about', 'gallery', 'clients', 'footer', 'metadata'];
for (const section of sections) {
  r2PutJson(`_versions/${section}/_index.json`, { section, versions: [] });
}

// 2. Upload seed JSON content
console.log('\n📄 Uploading content JSON files...\n');
const contentFiles = ['hero', 'about', 'gallery', 'clients', 'footer', 'metadata'];
for (const name of contentFiles) {
  const localPath = join(SEED_DIR, `${name}.json`);
  if (existsSync(localPath)) {
    r2Put(`content/${name}.json`, localPath);
  } else {
    console.log(`  ⚠ Missing: ${localPath}`);
  }
}

// 3. Upload hero background images
console.log('\n🖼️  Uploading hero images...\n');
const heroImages = [
  { local: 'banner-hero-arq.jpg', remote: 'background-1.jpg' },
  { local: 'banner-hero-arq-2.jpg', remote: 'background-2.jpg' },
  { local: 'banner-hero-arq-3.jpg', remote: 'background-3.jpg' },
  { local: 'banner-hero-arq-4.jpg', remote: 'background-4.jpg' },
];
for (const img of heroImages) {
  const localPath = join(PUBLIC_DIR, img.local);
  if (existsSync(localPath)) {
    r2Put(`images/hero/${img.remote}`, localPath);
  }
}

// 4. Upload gallery images
console.log('\n🖼️  Uploading gallery images...\n');
const galleryDir = join(PUBLIC_DIR, 'images', 'galery');
if (existsSync(galleryDir)) {
  const galleryFiles = readdirSync(galleryDir).filter(f => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase())
  );
  for (const file of galleryFiles) {
    r2Put(`images/gallery/${file}`, join(galleryDir, file));
  }
}

// 5. Upload client logos
console.log('\n🖼️  Uploading client logos...\n');
const clientsDir = join(PUBLIC_DIR, 'logos', 'clients');
if (existsSync(clientsDir)) {
  const clientFiles = readdirSync(clientsDir).filter(f => 
    ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase())
  );
  for (const file of clientFiles) {
    r2Put(`images/clients/${file}`, join(clientsDir, file));
  }
}

// 6. Upload icons to general folder
console.log('\n🖼️  Uploading icons...\n');
const iconsDir = join(PUBLIC_DIR, 'icons');
if (existsSync(iconsDir)) {
  const iconFiles = readdirSync(iconsDir).filter(f => 
    ['.svg', '.png'].includes(extname(f).toLowerCase())
  );
  for (const file of iconFiles) {
    r2Put(`images/general/${file}`, join(iconsDir, file));
  }
}

// 7. Upload other general images
console.log('\n🖼️  Uploading general images...\n');
const generalImages = [
  { local: 'images/footer-background.jpg', remote: 'footer-background.jpg' },
  { local: 'images/selo-footer.png', remote: 'selo-footer.png' },
  { local: 'logos/logo-color.svg', remote: 'logo-color.svg' },
  { local: 'logos/logo-with-slogan.svg', remote: 'logo-with-slogan.svg' },
  { local: 'logos/arqlopes-logo.svg', remote: 'arqlopes-logo.svg' },
  { local: 'common/handwrite-construir.svg', remote: 'handwrite-construir.svg' },
  { local: 'gifs/hero-decorative.gif', remote: 'hero-decorative.gif' },
];
for (const img of generalImages) {
  const localPath = join(PUBLIC_DIR, img.local);
  if (existsSync(localPath)) {
    r2Put(`images/general/${img.remote}`, localPath);
  }
}

console.log('\n═'.repeat(50));
console.log('\n✅ Seed complete!\n');
console.log('Next steps:');
console.log('  1. Verify content at: https://assets.arqlopes.com.br/content/hero.json');
console.log('  2. Configure Cloudflare Access for /admin');
console.log('  3. Deploy: npm run cf:deploy\n');
