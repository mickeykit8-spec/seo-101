import { useEffect } from "react";
import { StoryblokSeoMetadata, getStoryblokAssetUrl } from "../utils/storyblok";
import { buildCanonicalUrl } from "../utils/site";

interface SEOHeadProps {
  seo: StoryblokSeoMetadata;
  path?: string;
}

const DEFAULT_TITLE = "SEO Academy | Thai SEO Learning and Tools";
const DEFAULT_DESCRIPTION = "SEO Academy is a Thai SEO learning and tools platform for SEO, GMB, AI Overviews, GEO, Core Updates, and PageSpeed.";

function getMetaEnv(): Record<string, string | undefined> {
  return ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {});
}

function normalizeKeywords(value: StoryblokSeoMetadata["metaKeywords"] | StoryblokSeoMetadata["contentTags"]) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
}

function normalizeSchema(value: StoryblokSeoMetadata["schemaJsonLd"]) {
  if (!value) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
      JSON.parse(trimmed);
      return trimmed;
    } catch {
      console.warn("SEOHead: schemaJsonLd is not valid JSON and was skipped.");
      return "";
    }
  }

  return JSON.stringify(value);
}

function upsertMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function upsertNamedMeta(name: string, content: string) {
  upsertMeta(`meta[name="${name}"]`, "name", name, content);
}

function upsertPropertyMeta(property: string, content: string) {
  upsertMeta(`meta[property="${property}"]`, "property", property, content);
}

function upsertMultiPropertyMeta(property: string, values: string[]) {
  document.head.querySelectorAll<HTMLMetaElement>(`meta[property="${property}"][data-seo-managed="true"]`).forEach((tag) => tag.remove());

  values
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", property);
      tag.setAttribute("content", value);
      tag.setAttribute("data-seo-managed", "true");
      document.head.appendChild(tag);
    });
}

function upsertCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!href) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
}

function upsertAuthorLink(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="author"]');

  if (!href) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "author");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
}

function upsertJsonLd(json: string) {
  const scriptId = "seo-json-ld";
  let tag = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!json) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("script");
    tag.id = scriptId;
    tag.type = "application/ld+json";
    document.head.appendChild(tag);
  }

  tag.text = json;
}

export default function SEOHead({ seo, path = "/" }: SEOHeadProps) {
  useEffect(() => {
    const env = getMetaEnv();
    const title = seo.metaTitle || DEFAULT_TITLE;
    const description = seo.metaDescription || DEFAULT_DESCRIPTION;
    const keywords = normalizeKeywords(seo.metaKeywords || seo.contentTags);
    const canonicalUrl = seo.canonicalUrl || buildCanonicalUrl(path);
    const ogTitle = seo.ogTitle || title;
    const ogDescription = seo.ogDescription || description;
    const ogImage = getStoryblokAssetUrl(seo.ogImage);
    const twitterImage = getStoryblokAssetUrl(seo.twitterImage, ogImage);
    const authorAvatar = getStoryblokAssetUrl(seo.authorAvatar);
    const schemaJson = normalizeSchema(seo.schemaJsonLd);
    const tags = normalizeKeywords(seo.contentTags)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    document.documentElement.lang = "th";
    document.title = title;

    upsertNamedMeta("description", description);
    upsertNamedMeta("keywords", keywords);
    upsertNamedMeta("author", seo.authorName || "SEO Academy");
    upsertNamedMeta("author:role", seo.authorRole || "");
    upsertNamedMeta("author:image", authorAvatar);
    upsertNamedMeta("author:url", seo.authorProfileUrl || "");
    upsertNamedMeta("author:bio", seo.authorBio || "");
    upsertNamedMeta("google-site-verification", env.VITE_GSC_VERIFICATION || "");
    upsertNamedMeta("msvalidate.01", env.VITE_BING_VERIFICATION || "");

    upsertCanonical(canonicalUrl);
    upsertAuthorLink(seo.authorProfileUrl || "");

    upsertPropertyMeta("og:type", seo.ogType || "website");
    upsertPropertyMeta("og:title", ogTitle);
    upsertPropertyMeta("og:description", ogDescription);
    upsertPropertyMeta("og:url", canonicalUrl);
    upsertPropertyMeta("og:image", ogImage);
    upsertPropertyMeta("og:image:alt", seo.ogImageAlt || ogTitle);
    upsertPropertyMeta("og:site_name", "SEO Academy");
    upsertMultiPropertyMeta("article:tag", tags);
    upsertPropertyMeta("article:author", seo.authorProfileUrl || seo.authorName || "");

    upsertNamedMeta("twitter:card", twitterImage ? "summary_large_image" : "summary");
    upsertNamedMeta("twitter:title", seo.twitterTitle || ogTitle);
    upsertNamedMeta("twitter:description", seo.twitterDescription || ogDescription);
    upsertNamedMeta("twitter:image", twitterImage);
    upsertNamedMeta("twitter:image:alt", seo.ogImageAlt || ogTitle);

    upsertJsonLd(schemaJson);
  }, [path, seo]);

  return null;
}
