import { BlogPost, BLOG_POSTS } from "../data/blogPosts";

type StoryblokRegion = "eu" | "us" | "ap";
type StoryblokVersion = "draft" | "published";
export type StoryblokAsset = string | { filename?: string; alt?: string; title?: string; name?: string };
type StoryblokRecord = Record<string, unknown>;

export interface StoryblokRichTextNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: StoryblokRichTextNode[];
}

const BLOG_CATEGORIES = new Set<BlogPost["category"]>([
  "Beginner",
  "Technical",
  "Advanced",
  "Local SEO",
  "AI SEO",
]);

export interface StoryblokSeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string | string[];
  canonicalUrl?: string;
  schemaJsonLd?: string | Record<string, unknown> | Record<string, unknown>[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: StoryblokAsset;
  ogImageAlt?: string;
  ogType?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: StoryblokAsset;
  authorProfileUrl?: string;
  authorBio?: string;
  contentTags?: string | string[];
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: StoryblokAsset;
  [key: string]: unknown;
}

export interface StoryblokPageContent extends StoryblokSeoMetadata {
  component?: string;
  title?: string;
  headline?: string;
  excerpt?: string;
  description?: string;
  content?: string | StoryblokRichTextNode;
  body?: string | StoryblokRichTextNode;
  richText?: StoryblokRichTextNode;
  bodyHtml?: string;
  body_html?: string;
  html?: string;
  renderMode?: "append" | "replace" | "hidden";
  render_mode?: "append" | "replace" | "hidden";
  sections?: Array<{
    title?: string;
    heading?: string;
    text?: string;
    body?: string;
  }>;
}

interface StoryblokBlogContent extends StoryblokSeoMetadata {
  title?: string;
  excerpt?: string;
  content?: string | StoryblokRichTextNode;
  body?: string | StoryblokRichTextNode;
  category?: BlogPost["category"] | string;
  categoryThai?: string;
  category_thai?: string;
  author?: string;
  readTime?: string;
  read_time?: string;
  coverImage?: StoryblokAsset;
  cover_image?: StoryblokAsset;
  author_avatar?: StoryblokAsset;
}

export interface StoryblokStory<TContent = StoryblokBlogContent> {
  name: string;
  slug: string;
  full_slug?: string;
  uuid: string;
  id: number;
  created_at: string;
  published_at: string | null;
  first_published_at: string | null;
  content: TContent;
}

export interface StoryblokPageFetchResult {
  story: StoryblokStory<StoryblokPageContent> | null;
  content: StoryblokPageContent | null;
  source: "storyblok" | "fallback";
  reason?: "missing-token" | "not-found" | "api-error";
  error?: string;
}

function getMetaEnv(): Record<string, string | undefined> {
  return ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {});
}

function getStoryblokConfig() {
  const env = getMetaEnv();
  const token = env.VITE_STORYBLOK_TOKEN?.trim();
  const region = (env.VITE_STORYBLOK_REGION?.trim().toLowerCase() || "eu") as StoryblokRegion;
  const version = (env.VITE_STORYBLOK_VERSION?.trim().toLowerCase() === "published" ? "published" : "draft") as StoryblokVersion;
  const cacheVersion = env.VITE_STORYBLOK_CACHE_VERSION?.trim();

  let baseUrl = "https://api.storyblok.com/v2";
  if (region === "us") {
    baseUrl = "https://api-us.storyblok.com/v2";
  } else if (region === "ap") {
    baseUrl = "https://api-ap.storyblok.com/v2";
  }

  return { token, region, version, cacheVersion, baseUrl };
}

function buildStoryblokUrl(config: ReturnType<typeof getStoryblokConfig>, pathName: string) {
  const url = new URL(`${config.baseUrl}${pathName}`);
  url.searchParams.set("token", config.token || "");
  url.searchParams.set("version", config.version);

  if (config.cacheVersion) {
    url.searchParams.set("cv", config.cacheVersion);
  } else if (config.version === "draft") {
    url.searchParams.set("cv", Date.now().toString());
  }

  return url;
}

function normalizeStoryblokSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, "");
}

function pageSlugCandidates(slug: string) {
  const normalized = normalizeStoryblokSlug(slug);
  return Array.from(new Set([normalized, `pages/${normalized}`]));
}

function readRecord(content: unknown): StoryblokRecord {
  return content && typeof content === "object" ? (content as StoryblokRecord) : {};
}

function readField<T = unknown>(content: unknown, keys: string[]): T | undefined {
  const record = readRecord(content);
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") return value as T;
  }
  return undefined;
}

function readText(content: unknown, keys: string[], fallback = "") {
  const value = readField<unknown>(content, keys);
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function readStringList(content: unknown, keys: string[]) {
  const value = readField<unknown>(content, keys);
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return undefined;
}

function readAssetUrl(asset: StoryblokAsset | undefined, fallback = "") {
  if (!asset) return fallback;
  if (typeof asset === "string") return asset || fallback;
  return asset.filename || fallback;
}

function readCategory(value: StoryblokBlogContent["category"]): BlogPost["category"] {
  return typeof value === "string" && BLOG_CATEGORIES.has(value as BlogPost["category"])
    ? (value as BlogPost["category"])
    : "Beginner";
}

function richTextToPlainText(node: StoryblokRichTextNode | undefined): string {
  if (!node) return "";
  if (node.text) return node.text;
  return (node.content || []).map(richTextToPlainText).filter(Boolean).join("\n\n");
}

function formatThaiDate(rawDate: string | null | undefined) {
  if (!rawDate) return "19 Jun 2026";

  try {
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "19 Jun 2026";
    return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(date);
  } catch {
    return "19 Jun 2026";
  }
}

export function normalizeSeoMetadata(content: unknown): StoryblokSeoMetadata {
  return {
    metaTitle: readText(content, ["metaTitle", "meta_title", "meta-title", "seoTitle", "seo_title"]),
    metaDescription: readText(content, ["metaDescription", "meta_description", "meta-description", "seoDescription", "seo_description"]),
    metaKeywords: readStringList(content, ["metaKeywords", "meta_keywords", "meta-keywords", "keywords"]),
    canonicalUrl: readText(content, ["canonicalUrl", "canonical_url", "canonical-url", "canonical"]),
    schemaJsonLd: readField(content, ["schemaJsonLd", "schema_json_ld", "schema-json-ld", "schema", "jsonLd", "json_ld"]) as StoryblokSeoMetadata["schemaJsonLd"],
    ogTitle: readText(content, ["ogTitle", "og_title", "og-title", "socialTitle", "social_title"]),
    ogDescription: readText(content, ["ogDescription", "og_description", "og-description", "socialDescription", "social_description"]),
    ogImage: readField(content, ["ogImage", "og_image", "og-image", "socialImage", "social_image"]) as StoryblokAsset | undefined,
    ogImageAlt: readText(content, ["ogImageAlt", "og_image_alt", "og-image-alt", "socialImageAlt", "social_image_alt"]),
    ogType: readText(content, ["ogType", "og_type", "og-type"]),
    authorName: readText(content, ["authorName", "author_name", "author-name", "author"]),
    authorRole: readText(content, ["authorRole", "author_role", "author-role"]),
    authorAvatar: readField(content, ["authorAvatar", "author_avatar", "author-avatar"]) as StoryblokAsset | undefined,
    authorProfileUrl: readText(content, ["authorProfileUrl", "author_profile_url", "author-profile-url"]),
    authorBio: readText(content, ["authorBio", "author_bio", "author-bio"]),
    contentTags: readStringList(content, ["contentTags", "content_tags", "content-tags", "tags"]),
    twitterTitle: readText(content, ["twitterTitle", "twitter_title", "twitter-title"]),
    twitterDescription: readText(content, ["twitterDescription", "twitter_description", "twitter-description"]),
    twitterImage: readField(content, ["twitterImage", "twitter_image", "twitter-image"]) as StoryblokAsset | undefined,
  };
}

function normalizePageContent(content: StoryblokPageContent): StoryblokPageContent {
  const body = readField<string | StoryblokRichTextNode>(content, ["body", "content", "richText", "rich_text"]);

  return {
    ...content,
    ...normalizeSeoMetadata(content),
    title: readText(content, ["title", "headline"], content.title || content.headline || ""),
    headline: readText(content, ["headline", "title"], content.headline || content.title || ""),
    excerpt: readText(content, ["excerpt", "description", "summary"], content.excerpt || ""),
    description: readText(content, ["description", "excerpt", "summary"], content.description || ""),
    body,
    bodyHtml: readText(content, ["bodyHtml", "body_html", "body-html", "html"], content.bodyHtml || content.body_html || content.html || ""),
    renderMode: readText(content, ["renderMode", "render_mode", "render-mode"], content.renderMode || content.render_mode || "append") as StoryblokPageContent["renderMode"],
  };
}

function mapStoryToBlogPost(story: StoryblokStory<StoryblokBlogContent>): BlogPost {
  const content = story.content || {};
  const seo = normalizeSeoMetadata(content);
  const coverImage = readAssetUrl(
    readField(content, ["coverImage", "cover_image", "cover-image"]) as StoryblokAsset | undefined,
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800",
  );
  const body = readField<string | StoryblokRichTextNode>(content, ["content", "body", "articleBody", "article_body"]);
  const articleContent = typeof body === "string" ? body : richTextToPlainText(body);

  return {
    id: story.slug,
    title: readText(content, ["title"], story.name),
    excerpt: readText(content, ["excerpt", "description", "summary"]),
    content: articleContent,
    category: readCategory(readField(content, ["category"]) as StoryblokBlogContent["category"]),
    categoryThai: readText(content, ["categoryThai", "category_thai", "category-thai"], "Article"),
    author: seo.authorName || readText(content, ["author"], "SEO Academy"),
    authorRole: seo.authorRole || "Editorial Team",
    authorAvatar: readAssetUrl(seo.authorAvatar, readAssetUrl(readField(content, ["author_avatar"]) as StoryblokAsset | undefined, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")),
    authorProfileUrl: seo.authorProfileUrl,
    authorBio: seo.authorBio,
    readTime: readText(content, ["readTime", "read_time", "read-time"], "5 min read"),
    date: formatThaiDate(story.published_at || story.created_at),
    coverImage,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    metaKeywords: seo.metaKeywords,
    canonicalUrl: seo.canonicalUrl,
    schemaJsonLd: seo.schemaJsonLd,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImage: readAssetUrl(seo.ogImage, coverImage),
    ogImageAlt: seo.ogImageAlt,
    ogType: seo.ogType,
    contentTags: seo.contentTags,
  };
}

export async function fetchStoryblokPosts(): Promise<BlogPost[]> {
  const config = getStoryblokConfig();

  if (!config.token) {
    console.info("Storyblok Utility: No VITE_STORYBLOK_TOKEN provided. Using local blog fallback.");
    return BLOG_POSTS;
  }

  const url = buildStoryblokUrl(config, "/cdn/stories");
  url.searchParams.set("starts_with", "blog/");
  url.searchParams.set("sort_by", "published_at:desc");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const stories: StoryblokStory<StoryblokBlogContent>[] = data.stories || [];

    if (stories.length === 0) {
      console.warn("Storyblok Integration: Blog query returned 0 stories. Using local fallback posts.");
      return BLOG_POSTS;
    }

    return stories.map(mapStoryToBlogPost);
  } catch (error) {
    console.error("Storyblok Integration: Failed to fetch blog posts. Using local fallback.", error);
    return BLOG_POSTS;
  }
}

export async function fetchStoryblokPage(slug: string): Promise<StoryblokPageFetchResult> {
  const config = getStoryblokConfig();

  if (!config.token) {
    return {
      story: null,
      content: null,
      source: "fallback",
      reason: "missing-token",
    };
  }

  for (const candidate of pageSlugCandidates(slug)) {
    const encodedSlug = candidate.split("/").map(encodeURIComponent).join("/");
    const url = buildStoryblokUrl(config, `/cdn/stories/${encodedSlug}`);

    try {
      const response = await fetch(url);

      if (response.status === 404) {
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const story = data.story as StoryblokStory<StoryblokPageContent> | undefined;

      if (story?.content) {
        return {
          story,
          content: normalizePageContent(story.content),
          source: "storyblok",
        };
      }
    } catch (error) {
      return {
        story: null,
        content: null,
        source: "fallback",
        reason: "api-error",
        error: error instanceof Error ? error.message : "Unknown Storyblok API error",
      };
    }
  }

  return {
    story: null,
    content: null,
    source: "fallback",
    reason: "not-found",
  };
}

export function getStoryblokAssetUrl(asset: StoryblokAsset | undefined, fallback = "") {
  return readAssetUrl(asset, fallback);
}
