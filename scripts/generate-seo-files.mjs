import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const publicDir = path.resolve(process.cwd(), "public");
const siteUrl = (process.env.VITE_SITE_URL || process.env.APP_URL || "https://seo-academy.example.com").replace(/\/+$/g, "");
const siteName = process.env.VITE_SITE_NAME || "SEO Academy";
const defaultOgImage = process.env.VITE_DEFAULT_OG_IMAGE || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1200";

const routes = [
  {
    path: "/",
    storyblokSlug: "home",
    title: "SEO Academy | Thai SEO Learning and Tools",
    description: "Thai SEO learning platform with SEO articles, games, AI tools, GMB tools, PageSpeed guidance, and AI search optimization resources.",
    changefreq: "weekly",
    priority: "1.0",
    tags: ["SEO", "SEO tools", "AI SEO"],
  },
  {
    path: "/Blog",
    storyblokSlug: "blog",
    title: "SEO Articles | SEO Academy",
    description: "Read SEO, Technical SEO, Local SEO, AI SEO, and traffic growth articles for Thai websites.",
    changefreq: "weekly",
    priority: "0.9",
    tags: ["SEO blog", "content strategy"],
  },
  {
    path: "/BlogPost",
    storyblokSlug: "blog-post",
    title: "SEO Article Detail | SEO Academy",
    description: "Detailed SEO articles from SEO Academy with practical guidance for Thai businesses and websites.",
    changefreq: "weekly",
    priority: "0.7",
    tags: ["SEO article"],
  },
  {
    path: "/Games",
    storyblokSlug: "games",
    title: "SEO Games | SEO Academy",
    description: "Practice SEO skills through interactive games and quizzes covering Googlebot, meta tags, keywords, and Technical SEO.",
    changefreq: "monthly",
    priority: "0.8",
    tags: ["SEO games", "learning"],
  },
  {
    path: "/SEOTools",
    storyblokSlug: "seo-tools",
    title: "AI SEO Tools | SEO Academy",
    description: "Use AI-assisted tools to review SEO, meta tags, keywords, technical issues, and improvement plans.",
    changefreq: "weekly",
    priority: "0.9",
    tags: ["SEO tools", "AI"],
  },
  {
    path: "/GmbTools",
    storyblokSlug: "gmb-tools",
    title: "Google Business Profile and Local SEO Tools | SEO Academy",
    description: "Tools and guidance for improving Google Business Profile, Google Maps visibility, and Local SEO.",
    changefreq: "weekly",
    priority: "0.8",
    tags: ["Local SEO", "GMB"],
  },
  {
    path: "/ClassicSEO",
    storyblokSlug: "classic-seo",
    title: "Classic SEO Fundamentals | SEO Academy",
    description: "Learn SEO fundamentals including keyword research, on-page SEO, backlinks, technical SEO, and measurement.",
    changefreq: "monthly",
    priority: "0.8",
    tags: ["Classic SEO", "fundamentals"],
  },
  {
    path: "/AIOverviews",
    storyblokSlug: "ai-overviews",
    title: "AI Overviews SEO | SEO Academy",
    description: "Understand AI Overviews and how to prepare content for AI-generated search summaries.",
    changefreq: "monthly",
    priority: "0.8",
    tags: ["AI Overviews", "AI SEO"],
  },
  {
    path: "/GenerativeEngine",
    storyblokSlug: "generative-engine",
    title: "Generative Engine Optimization | SEO Academy",
    description: "Learn GEO and content design for citations in generative AI, ChatGPT Search, and AI search engines.",
    changefreq: "monthly",
    priority: "0.8",
    tags: ["GEO", "Generative AI"],
  },
  {
    path: "/CoreUpdates",
    storyblokSlug: "core-updates",
    title: "Google Core Updates Guide | SEO Academy",
    description: "Track and respond to Google Core Updates with impact analysis, content quality improvement, and ranking risk reduction.",
    changefreq: "monthly",
    priority: "0.8",
    tags: ["Core Updates", "Google algorithm"],
  },
  {
    path: "/PageSpeed",
    storyblokSlug: "page-speed",
    title: "PageSpeed and Core Web Vitals | SEO Academy",
    description: "Check and learn website speed improvements for Core Web Vitals, LCP, INP, CLS, user experience, and SEO.",
    changefreq: "monthly",
    priority: "0.8",
    tags: ["PageSpeed", "Core Web Vitals"],
  },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(routePath) {
  return `${siteUrl}${routePath === "/" ? "" : routePath}`;
}

fs.mkdirSync(publicDir, { recursive: true });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(absoluteUrl(route.path))}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

const llms = `# ${siteName}

${siteName} is a Thai SEO learning and tools site for business owners, marketers, developers, and teams that need practical search growth skills.

Core URLs:
${routes.map((route) => `- ${route.title}: ${absoluteUrl(route.path)}`).join("\n")}

Content focus:
- SEO fundamentals and practical implementation
- Blog articles and educational resources
- AI-assisted SEO analysis tools
- Google Business Profile and Local SEO
- AI Overviews, GEO, and future search behavior
- Core Web Vitals and PageSpeed improvement
`;

const manifest = {
  siteName,
  siteUrl,
  defaultOgImage,
  routes: routes.map((route) => ({
    ...route,
    canonicalUrl: absoluteUrl(route.path),
    ogTitle: route.title,
    ogDescription: route.description,
    ogImage: defaultOgImage,
    ogType: route.path === "/BlogPost" ? "article" : "website",
  })),
};

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf8");
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms, "utf8");
fs.writeFileSync(path.join(publicDir, "seo-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Generated SEO files for ${routes.length} routes at ${siteUrl}`);
