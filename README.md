# SEO Academy

React + Vite + TypeScript SPA for SEO Academy, with an Express dev/production server, Storyblok CMS fallback support, SEO metadata handling, and optional analytics through environment variables.

## Install

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

The build creates the Vite frontend and bundles `server.ts` into `dist/server.cjs`.

## Start Production Build

```bash
npm start
```

## Environment Variables

Copy `.env.example` to `.env` or configure these in the hosting platform.

```env
GEMINI_API_KEY=""
APP_URL=""
VITE_STORYBLOK_TOKEN=""
VITE_STORYBLOK_REGION="eu"
VITE_STORYBLOK_VERSION="published"
VITE_STORYBLOK_CACHE_VERSION=""
VITE_SITE_URL="https://seo-academy.example.com"
VITE_SITE_NAME="SEO Academy"
VITE_DEFAULT_OG_IMAGE="https://seo-academy.example.com/og-image.jpg"
VITE_GA4_ID=""
VITE_CLARITY_ID=""
VITE_HOTJAR_ID=""
VITE_GSC_VERIFICATION=""
VITE_BING_VERIFICATION=""
```

Do not hardcode real Storyblok or analytics tokens in source code.

## Routes

Main routes are declared in `src/App.tsx` and route metadata is centralized in `src/utils/site.ts`.

- `/`
- `/Blog`
- `/BlogPost`
- `/BlogPost/:id`
- `/Games`
- `/SEOTools`
- `/GmbTools`
- `/ClassicSEO`
- `/AIOverviews`
- `/GenerativeEngine`
- `/CoreUpdates`
- `/PageSpeed`

The Express server serves the Vite SPA in development and uses an `index.html` fallback in production so direct refreshes on SPA routes keep working.

## Storyblok CMS Setup

Create page stories using one of these slug patterns:

- `home` or `pages/home`
- `blog` or `pages/blog`
- `games` or `pages/games`
- `seo-tools` or `pages/seo-tools`
- `gmb-tools` or `pages/gmb-tools`
- `classic-seo` or `pages/classic-seo`
- `ai-overviews` or `pages/ai-overviews`
- `generative-engine` or `pages/generative-engine`
- `core-updates` or `pages/core-updates`
- `page-speed` or `pages/page-speed`

All visible page text can be edited from Storyblok by setting `renderMode`:

- `append`: keep the local Google AI Studio page and add CMS content below it.
- `replace`: replace the local page body with Storyblok content.
- `hidden`: use Storyblok SEO fields only.

Recommended Storyblok content type fields for pages:

- `title`
- `headline`
- `excerpt`
- `description`
- `content` or `body` as plain text or Storyblok rich text
- `bodyHtml`
- `sections`
- `renderMode`

## SEO Fields

Each Storyblok page can override these SEO fields:

- `metaTitle`, `meta_title`, or `meta-title`
- `metaDescription`, `meta_description`, or `meta-description`
- `metaKeywords`, `meta_keywords`, or `meta-keywords`
- `canonicalUrl`, `canonical_url`, or `canonical-url`
- `schemaJsonLd`, `schema_json_ld`, `schema-json-ld`, or `schema`
- `ogTitle`, `og_title`, or `og-title`
- `ogDescription`, `og_description`, or `og-description`
- `ogImage`, `og_image`, or `og-image`
- `ogImageAlt`, `og_image_alt`, or `og-image-alt`
- `ogType`, `og_type`, or `og-type`
- `authorName`, `author_name`, or `author-name`
- `authorRole`, `author_role`, or `author-role`
- `authorAvatar`, `author_avatar`, or `author-avatar`
- `authorProfileUrl`, `author_profile_url`, or `author-profile-url`
- `authorBio`, `author_bio`, or `author-bio`
- `contentTags`, `content_tags`, `content-tags`, or `tags`

`src/components/SEOHead.tsx` updates the browser document head on the client. In production, `server.ts` also injects route-level SEO from `public/seo-manifest.json` into the first HTML response for better crawler and social preview support.

## Blog CMS

Blog listing and detail pages use Storyblok stories under `blog/` when `VITE_STORYBLOK_TOKEN` is configured. If the token is missing, the API fails, or no stories exist, the app uses `src/data/blogPosts.ts` as local fallback content.

Recommended blog fields:

- `title`
- `excerpt`
- `content`
- `category`
- `categoryThai`
- `author`
- `authorRole`
- `authorAvatar`
- `readTime`
- `coverImage`

Blog stories can also use the same SEO fields listed above. Blog detail pages prefer Storyblok SEO fields first, then fall back to title/excerpt/cover image.

## Analytics And Verification

`src/components/Analytics.tsx` injects scripts only when env values exist:

- GA4: `VITE_GA4_ID`
- Microsoft Clarity: `VITE_CLARITY_ID`
- Hotjar: `VITE_HOTJAR_ID`

`SEOHead` also supports:

- Google Search Console: `VITE_GSC_VERIFICATION`
- Bing Webmaster: `VITE_BING_VERIFICATION`

If these env variables are blank, no tracking or verification script/meta is injected.

## Static SEO Files

Static crawler files live in `public/`:

- `public/sitemap.xml`
- `public/robots.txt`
- `public/llms.txt`
- `public/seo-manifest.json`

These files are generated from route metadata by:

```bash
npm run generate:seo
```

Before production deployment, set `VITE_SITE_URL` to the real production domain, then run `npm run build`. Verify:

```text
https://your-domain.com/sitemap.xml
https://your-domain.com/robots.txt
https://your-domain.com/llms.txt
```

## Quality Checks

```bash
npm run lint
npm run build
```

Manual smoke test the main routes after build or on the dev server, including direct refresh on nested routes such as `/BlogPost/seo-basics-guide-2026`.
