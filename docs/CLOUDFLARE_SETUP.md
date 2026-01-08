# Cloudflare Setup Checklist

Tasks to be completed in the Cloudflare Dashboard before development.

---

## 1. Account & Project Setup

- [ ] **Create Cloudflare account** (if not exists)
  - https://dash.cloudflare.com/sign-up

- [ ] **Add domain** (if using custom domain)
  - Dashboard → Websites → Add a site
  - Update nameservers at registrar

---

## 2. Cloudflare Pages

- [ ] **Create Pages project**
  - Dashboard → Workers & Pages → Create application → Pages
  - Connect to Git repository: `arqlopes/arqlopes-site`
  - Framework preset: `Next.js`
  - Build command: `npx @cloudflare/next-on-pages`
  - Build output: `.vercel/output/static`

- [ ] **Configure build settings**
  - Node.js version: `20.x`
  - Add environment variable: `NODE_VERSION=20`

- [ ] **Set custom domain** (optional)
  - Pages project → Custom domains → Add
  - Add `arqlopes.com.br` and `www.arqlopes.com.br`

---

## 3. R2 Bucket

- [ ] **Create R2 bucket**
  - Dashboard → R2 Object Storage → Create bucket
  - Bucket name: `arqlopes-assets`
  - Location: Auto (or closest to Brazil)

- [ ] **Enable public access**
  - Bucket → Settings → Public access
  - Enable "Allow public access"
  - Note the public URL: `https://pub-xxx.r2.dev`

- [ ] **Configure custom domain for R2** (recommended)
  - Bucket → Settings → Custom Domains
  - Add: `assets.arqlopes.com.br`
  - Better for caching and branding

- [ ] **Bind R2 to Pages project**
  - Pages project → Settings → Functions → R2 bucket bindings
  - Variable name: `R2_ASSETS`
  - Bucket: `arqlopes-assets`

- [ ] **Configure CORS**
  - Bucket → Settings → CORS policy
  ```json
  [
    {
      "AllowedOrigins": [
        "https://arqlopes.com.br",
        "https://*.arqlopes.pages.dev",
        "http://localhost:3000"
      ],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
  ```

- [ ] **Set cache headers rule** (for images)
  - Bucket → Settings → Bucket Lifecycle Rules (or use Workers)
  - Images: `Cache-Control: public, max-age=31536000, immutable`
  - JSON: `Cache-Control: public, max-age=60`

---

## 4. Cloudflare Access (Authentication)

- [ ] **Enable Zero Trust**
  - Dashboard → Zero Trust → Get started
  - Create team name: `arqlopes`

- [ ] **Create Access Application**
  - Zero Trust → Access → Applications → Add an application
  - Type: Self-hosted
  - Application name: `ArqLopes Admin`
  - Session duration: `24 hours`
  - Application domain: `arqlopes.com.br/admin*`
  - Add second path: `arqlopes.com.br/api/admin*`

- [ ] **Create Access Policy**
  - Policy name: `Admin Access`
  - Action: Allow
  - Configure rules:
    - Include: Emails ending in `@arqlopes.com.br`
    - OR Include: Specific email `client@email.com`

- [ ] **Configure authentication method**
  - Zero Trust → Settings → Authentication
  - Enable: One-time PIN
  - This sends 6-digit code via email

- [ ] **Test Access**
  - Navigate to `/admin`
  - Should show Cloudflare Access login
  - Enter authorized email
  - Receive and enter OTP
  - Access granted

---

## 5. Wrangler CLI Setup (Local Development)

- [ ] **Install dependencies**
  ```bash
  pnpm add -D wrangler @cloudflare/next-on-pages
  ```

- [ ] **Login to Cloudflare**
  ```bash
  npx wrangler login
  ```

- [ ] **Create wrangler.toml**
  ```toml
  name = "arqlopes-site"
  compatibility_date = "2024-01-01"
  compatibility_flags = ["nodejs_compat"]
  pages_build_output_dir = ".vercel/output/static"

  [[r2_buckets]]
  binding = "R2_ASSETS"
  bucket_name = "arqlopes-assets"
  preview_bucket_name = "arqlopes-assets"
  ```

- [ ] **Update package.json scripts**
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "preview": "npx @cloudflare/next-on-pages && npx wrangler pages dev",
      "deploy": "npx @cloudflare/next-on-pages && npx wrangler pages deploy"
    }
  }
  ```

- [ ] **Create .dev.vars for local secrets** (gitignored)
  ```env
  NEXT_PUBLIC_R2_URL=https://assets.arqlopes.com.br
  ```

---

## 6. Create Initial R2 Structure

- [ ] **Create folder structure in R2**
  ```bash
  # Create empty placeholder files to establish structure
  echo '{}' > /tmp/empty.json
  
  # Content folder
  npx wrangler r2 object put arqlopes-assets/content/.keep --file=/tmp/empty.json
  
  # Versions folder
  npx wrangler r2 object put arqlopes-assets/_versions/.keep --file=/tmp/empty.json
  
  # Images folders
  npx wrangler r2 object put arqlopes-assets/images/hero/.keep --file=/tmp/empty.json
  npx wrangler r2 object put arqlopes-assets/images/gallery/.keep --file=/tmp/empty.json
  npx wrangler r2 object put arqlopes-assets/images/clients/.keep --file=/tmp/empty.json
  npx wrangler r2 object put arqlopes-assets/images/general/.keep --file=/tmp/empty.json
  
  # Trash folder
  npx wrangler r2 object put arqlopes-assets/_trash/.keep --file=/tmp/empty.json
  ```

---

## 7. Seed Initial Content

- [ ] **Create seed JSON files locally**
  - Create `data/seed/` folder in project
  - Export current hardcoded content to JSON files

- [ ] **Upload seed content to R2**
  ```bash
  npx wrangler r2 object put arqlopes-assets/content/hero.json --file=./data/seed/hero.json
  npx wrangler r2 object put arqlopes-assets/content/about.json --file=./data/seed/about.json
  npx wrangler r2 object put arqlopes-assets/content/gallery.json --file=./data/seed/gallery.json
  npx wrangler r2 object put arqlopes-assets/content/clients.json --file=./data/seed/clients.json
  npx wrangler r2 object put arqlopes-assets/content/footer.json --file=./data/seed/footer.json
  npx wrangler r2 object put arqlopes-assets/content/metadata.json --file=./data/seed/metadata.json
  ```

- [ ] **Upload current images to R2**
  ```bash
  # Hero backgrounds
  npx wrangler r2 object put arqlopes-assets/images/hero/background-1.jpg --file=./public/banner-hero-arq.jpg
  npx wrangler r2 object put arqlopes-assets/images/hero/background-2.jpg --file=./public/banner-hero-arq-2.jpg
  npx wrangler r2 object put arqlopes-assets/images/hero/background-3.jpg --file=./public/banner-hero-arq-3.jpg
  npx wrangler r2 object put arqlopes-assets/images/hero/background-4.jpg --file=./public/banner-hero-arq-4.jpg
  
  # Gallery images
  npx wrangler r2 object put arqlopes-assets/images/gallery/galery-01.jpg --file=./public/images/galery/galery-01.jpg
  npx wrangler r2 object put arqlopes-assets/images/gallery/galery-02.jpg --file=./public/images/galery/galery-02.jpg
  npx wrangler r2 object put arqlopes-assets/images/gallery/galery-03.jpg --file=./public/images/galery/galery-03.jpg
  
  # Client logos
  npx wrangler r2 object put arqlopes-assets/images/clients/client-1.png --file=./public/logos/clients/client-1.png
  # ... repeat for all client logos
  ```

- [ ] **Initialize version indexes**
  ```bash
  # Create empty version indexes for each section
  echo '{"section":"hero","versions":[]}' | npx wrangler r2 object put arqlopes-assets/_versions/hero/_index.json --pipe
  echo '{"section":"about","versions":[]}' | npx wrangler r2 object put arqlopes-assets/_versions/about/_index.json --pipe
  echo '{"section":"gallery","versions":[]}' | npx wrangler r2 object put arqlopes-assets/_versions/gallery/_index.json --pipe
  echo '{"section":"clients","versions":[]}' | npx wrangler r2 object put arqlopes-assets/_versions/clients/_index.json --pipe
  echo '{"section":"footer","versions":[]}' | npx wrangler r2 object put arqlopes-assets/_versions/footer/_index.json --pipe
  ```

---

## 8. DNS Configuration (If using custom domain)

- [ ] **Configure DNS records for site**
  - Type: CNAME
  - Name: `@` or `arqlopes.com.br`
  - Target: `arqlopes.pages.dev`
  - Proxy: Enabled (orange cloud)

- [ ] **Configure www redirect**
  - Type: CNAME
  - Name: `www`
  - Target: `arqlopes.com.br`
  - Add redirect rule in Rules → Redirect Rules

- [ ] **Configure assets subdomain**
  - Type: CNAME
  - Name: `assets`
  - Target: R2 bucket custom domain
  - Proxy: Enabled

---

## 9. Security Settings

- [ ] **Enable HTTPS**
  - SSL/TLS → Overview → Full (strict)

- [ ] **Enable Bot Protection**
  - Security → Bots → Enable Bot Fight Mode

- [ ] **Configure security headers** (optional)
  - Rules → Transform Rules → Modify Response Header
  - Add headers: X-Frame-Options, X-Content-Type-Options, etc.

---

## 10. Environment Variables in Pages

- [ ] **Add production environment variables**
  - Pages project → Settings → Environment variables
  - Add for Production:
    - `NEXT_PUBLIC_R2_URL` = `https://assets.arqlopes.com.br`
    - `NODE_VERSION` = `20`

- [ ] **Add preview environment variables**
  - Same variables for Preview environment

---

## Summary of Resources Created

| Resource | Name | Purpose |
|----------|------|---------|
| Pages Project | `arqlopes-site` | Host Next.js app |
| R2 Bucket | `arqlopes-assets` | Store JSON content + images |
| Access App | `ArqLopes Admin` | Protect admin routes |
| Custom Domain | `arqlopes.com.br` | Main site |
| Custom Domain | `assets.arqlopes.com.br` | R2 CDN |

---

## Estimated Time

| Task | Time |
|------|------|
| Account setup | 5 min |
| Pages project | 10 min |
| R2 bucket + config | 15 min |
| Access configuration | 15 min |
| Wrangler setup | 10 min |
| Seed content | 20 min |
| DNS (if applicable) | 10 min |
| **Total** | **~1.5 hours** |

---

## Verification Checklist

After setup, verify:

- [ ] Site deploys successfully to Pages
- [ ] R2 public URL returns content
- [ ] `/admin` shows Cloudflare Access login
- [ ] Authorized email can access admin
- [ ] API can read/write to R2
- [ ] Images load from R2 CDN
