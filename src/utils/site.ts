import type { StoryblokPageContent, StoryblokSeoMetadata } from "./storyblok";
import { getStoryblokAssetUrl, normalizeSeoMetadata } from "./storyblok";

export type SitePageKey =
  | "home"
  | "blog"
  | "blogPost"
  | "games"
  | "seoTools"
  | "gmbTools"
  | "classicSeo"
  | "aiOverviews"
  | "generativeEngine"
  | "coreUpdates"
  | "pageSpeed";

export interface SitePageDefinition {
  key: SitePageKey;
  path: string;
  storyblokSlug: string;
  label: string;
  seo: Required<Pick<StoryblokSeoMetadata, "metaTitle" | "metaDescription">> &
    Pick<StoryblokSeoMetadata, "metaKeywords" | "canonicalUrl" | "schemaJsonLd" | "ogTitle" | "ogDescription" | "ogImage" | "ogImageAlt" | "ogType" | "authorName" | "authorRole" | "authorAvatar" | "authorProfileUrl" | "authorBio" | "contentTags">;
}

const DEFAULT_SITE_URL = "https://seo-academy.example.com";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1200";

function getMetaEnv(): Record<string, string | undefined> {
  return ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {});
}

export function getSiteUrl() {
  const siteUrl = getMetaEnv().VITE_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return siteUrl.replace(/\/+$/g, "");
}

export function buildCanonicalUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;
}

function readCmsText(content: StoryblokPageContent | null | undefined, keys: string[]) {
  const record = (content || {}) as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function buildWebPageSchema(definition: SitePageDefinition, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: buildCanonicalUrl(definition.path),
    isPartOf: {
      "@type": "WebSite",
      name: "SEO Academy",
      url: getSiteUrl(),
    },
  };
}

export const SITE_ROUTES: SitePageDefinition[] = [
  {
    key: "home",
    path: "/",
    storyblokSlug: "home",
    label: "หน้าแรก",
    seo: {
      metaTitle: "SEO Academy | เรียน SEO ภาษาไทย พร้อมเครื่องมือ AI",
      metaDescription: "แพลตฟอร์มเรียน SEO ภาษาไทย พร้อมบทความ เกมฝึกทักษะ เครื่องมือวิเคราะห์ SEO, GMB, PageSpeed, AI Overviews และ Generative Engine Optimization",
      metaKeywords: ["SEO", "เรียน SEO", "SEO ภาษาไทย", "SEO tools", "GEO", "Google Business Profile"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["SEO Academy", "SEO learning", "SEO tools"],
    },
  },
  {
    key: "blog",
    path: "/Blog",
    storyblokSlug: "blog",
    label: "บทความ",
    seo: {
      metaTitle: "บทความ SEO | SEO Academy",
      metaDescription: "อ่านบทความ SEO, Technical SEO, Local SEO, AI SEO และกลยุทธ์เพิ่มทราฟฟิกสำหรับเว็บไซต์ภาษาไทย",
      metaKeywords: ["บทความ SEO", "Technical SEO", "Local SEO", "AI SEO"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["SEO blog", "content strategy"],
    },
  },
  {
    key: "blogPost",
    path: "/BlogPost",
    storyblokSlug: "blog-post",
    label: "บทความเดี่ยว",
    seo: {
      metaTitle: "อ่านบทความ SEO | SEO Academy",
      metaDescription: "บทความ SEO เชิงลึกจาก SEO Academy พร้อมคำแนะนำที่นำไปใช้ได้จริงสำหรับธุรกิจและเว็บไซต์ภาษาไทย",
      metaKeywords: ["อ่านบทความ SEO", "SEO guide", "SEO Academy"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["SEO article"],
    },
  },
  {
    key: "games",
    path: "/Games",
    storyblokSlug: "games",
    label: "เกม SEO",
    seo: {
      metaTitle: "เกมฝึกทักษะ SEO | SEO Academy",
      metaDescription: "ฝึก SEO ผ่านเกมและแบบทดสอบเชิงโต้ตอบ เพื่อเข้าใจ Googlebot, Meta Tags, Keywords และ Technical SEO ได้ง่ายขึ้น",
      metaKeywords: ["เกม SEO", "SEO quiz", "ฝึก SEO"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["SEO games", "learning"],
    },
  },
  {
    key: "seoTools",
    path: "/SEOTools",
    storyblokSlug: "seo-tools",
    label: "เครื่องมือ SEO",
    seo: {
      metaTitle: "เครื่องมือวิเคราะห์ SEO ด้วย AI | SEO Academy",
      metaDescription: "ใช้เครื่องมือวิเคราะห์ SEO, meta tags, keywords, technical issues และแผนปรับปรุงเว็บไซต์ด้วย AI",
      metaKeywords: ["SEO tools", "AI SEO analysis", "meta tag checker", "technical SEO"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["SEO tools", "AI"],
    },
  },
  {
    key: "gmbTools",
    path: "/GmbTools",
    storyblokSlug: "gmb-tools",
    label: "GMB Tools",
    seo: {
      metaTitle: "Google Business Profile และ Local SEO Tools | SEO Academy",
      metaDescription: "เครื่องมือและคำแนะนำสำหรับปรับ Google Business Profile, Google Maps และ Local SEO ให้ธุรกิจท้องถิ่นค้นเจอง่ายขึ้น",
      metaKeywords: ["GMB", "Google Business Profile", "Local SEO", "Google Maps SEO"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["Local SEO", "GMB"],
    },
  },
  {
    key: "classicSeo",
    path: "/ClassicSEO",
    storyblokSlug: "classic-seo",
    label: "Classic SEO",
    seo: {
      metaTitle: "Classic SEO Fundamentals | SEO Academy",
      metaDescription: "เรียนพื้นฐาน SEO แบบดั้งเดิม ตั้งแต่ keyword research, on-page SEO, backlinks, technical SEO และการวัดผล",
      metaKeywords: ["Classic SEO", "SEO fundamentals", "On-page SEO", "Backlinks"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["Classic SEO", "fundamentals"],
    },
  },
  {
    key: "aiOverviews",
    path: "/AIOverviews",
    storyblokSlug: "ai-overviews",
    label: "AI Overviews",
    seo: {
      metaTitle: "AI Overviews SEO | SEO Academy",
      metaDescription: "ทำความเข้าใจ AI Overviews และวิธีปรับเนื้อหาให้พร้อมสำหรับผลการค้นหาที่สรุปด้วย AI",
      metaKeywords: ["AI Overviews", "AI SEO", "Google AI search"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["AI Overviews", "AI SEO"],
    },
  },
  {
    key: "generativeEngine",
    path: "/GenerativeEngine",
    storyblokSlug: "generative-engine",
    label: "Generative Engine",
    seo: {
      metaTitle: "Generative Engine Optimization (GEO) | SEO Academy",
      metaDescription: "เรียนรู้ GEO และการออกแบบเนื้อหาให้พร้อมถูกอ้างอิงโดย Generative AI, ChatGPT Search และ AI search engines",
      metaKeywords: ["GEO", "Generative Engine Optimization", "ChatGPT Search", "AI search"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["GEO", "Generative AI"],
    },
  },
  {
    key: "coreUpdates",
    path: "/CoreUpdates",
    storyblokSlug: "core-updates",
    label: "Core Updates",
    seo: {
      metaTitle: "Google Core Updates Guide | SEO Academy",
      metaDescription: "ติดตามและรับมือ Google Core Updates ด้วยแนวทางวิเคราะห์ผลกระทบ ปรับปรุงคุณภาพเนื้อหา และลดความเสี่ยงอันดับตก",
      metaKeywords: ["Google Core Updates", "algorithm updates", "SEO recovery"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["Core Updates", "Google algorithm"],
    },
  },
  {
    key: "pageSpeed",
    path: "/PageSpeed",
    storyblokSlug: "page-speed",
    label: "PageSpeed",
    seo: {
      metaTitle: "PageSpeed และ Core Web Vitals | SEO Academy",
      metaDescription: "ตรวจและเรียนรู้การปรับความเร็วเว็บ Core Web Vitals, LCP, INP, CLS และแนวทางเพิ่มประสบการณ์ผู้ใช้เพื่อ SEO",
      metaKeywords: ["PageSpeed", "Core Web Vitals", "LCP", "INP", "CLS"],
      ogImage: DEFAULT_OG_IMAGE,
      contentTags: ["PageSpeed", "Core Web Vitals"],
    },
  },
];

export const SITE_ROUTES_BY_KEY = SITE_ROUTES.reduce(
  (acc, route) => {
    acc[route.key] = route;
    return acc;
  },
  {} as Record<SitePageKey, SitePageDefinition>,
);

export function mergePageSeo(definition: SitePageDefinition, cmsContent: StoryblokPageContent | null | undefined): StoryblokSeoMetadata {
  const fallback = definition.seo;
  const cmsSeo = normalizeSeoMetadata(cmsContent);
  const cmsTitle = cmsSeo.metaTitle || readCmsText(cmsContent, ["title", "headline"]);
  const cmsDescription = cmsSeo.metaDescription || readCmsText(cmsContent, ["description", "excerpt", "summary"]);
  const metaTitle = cmsTitle || fallback.metaTitle;
  const metaDescription = cmsDescription || fallback.metaDescription;

  return {
    metaTitle,
    metaDescription,
    metaKeywords: cmsSeo.metaKeywords || fallback.metaKeywords,
    canonicalUrl: cmsSeo.canonicalUrl || fallback.canonicalUrl || buildCanonicalUrl(definition.path),
    schemaJsonLd: cmsSeo.schemaJsonLd || fallback.schemaJsonLd || buildWebPageSchema(definition, metaTitle, metaDescription),
    ogTitle: cmsSeo.ogTitle || cmsTitle || fallback.ogTitle || fallback.metaTitle,
    ogDescription: cmsSeo.ogDescription || cmsDescription || fallback.ogDescription || fallback.metaDescription,
    ogImage: getStoryblokAssetUrl(cmsSeo.ogImage, getStoryblokAssetUrl(fallback.ogImage, DEFAULT_OG_IMAGE)),
    ogImageAlt: cmsSeo.ogImageAlt || fallback.ogImageAlt || metaTitle,
    ogType: cmsSeo.ogType || fallback.ogType || "website",
    authorName: cmsSeo.authorName || fallback.authorName,
    authorRole: cmsSeo.authorRole || fallback.authorRole,
    authorAvatar: cmsSeo.authorAvatar || fallback.authorAvatar,
    authorProfileUrl: cmsSeo.authorProfileUrl || fallback.authorProfileUrl,
    authorBio: cmsSeo.authorBio || fallback.authorBio,
    contentTags: cmsSeo.contentTags || fallback.contentTags,
    twitterTitle: cmsSeo.twitterTitle || metaTitle,
    twitterDescription: cmsSeo.twitterDescription || metaDescription,
    twitterImage: cmsSeo.twitterImage || cmsSeo.ogImage || fallback.ogImage,
  };
}
