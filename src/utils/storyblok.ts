import { BlogPost, BLOG_POSTS } from "../data/blogPosts";

// The default preview token provided by the user
const DEFAULT_TOKEN = "GVksTNk28bSaLvHKPWQbXgtt";

export interface StoryblokStory {
  name: string;
  slug: string;
  uuid: string;
  id: number;
  created_at: string;
  published_at: string | null;
  first_published_at: string | null;
  content: {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: "Beginner" | "Technical" | "Advanced" | "Local SEO" | "AI SEO";
    categoryThai?: string;
    author?: string;
    authorRole?: string;
    authorAvatar?: string | { filename: string };
    readTime?: string;
    coverImage?: string | { filename: string };
    // storyblok custom fields sometimes come as assets or text
    cover_image?: string | { filename: string };
    author_avatar?: string | { filename: string };
    read_time?: string;
    category_thai?: string;
  };
}

export async function fetchStoryblokPosts(): Promise<BlogPost[]> {
  const metaEnv = (import.meta as any).env || {};
  const token = metaEnv.VITE_STORYBLOK_TOKEN || DEFAULT_TOKEN;
  // Let user config region dynamically via environment variables
  const region = metaEnv.VITE_STORYBLOK_REGION || "eu"; // 'eu' or 'us' or 'ap'
  
  if (!token) {
    console.log("Storyblok Utility: No VITE_STORYBLOK_TOKEN provided. Using default local articles.");
    return BLOG_POSTS;
  }

  // Choose the target REST domain for Storyblok Content Delivery API
  let baseUrl = "https://api.storyblok.com/v2";
  if (region === "us") {
    baseUrl = "https://api-us.storyblok.com/v2";
  } else if (region === "ap") {
    baseUrl = "https://api-ap.storyblok.com/v2";
  }

  // Request all stories. We query by dynamic timestamp 'cv' to prevent aggressive CDN caching during design/previews
  const url = `${baseUrl}/cdn/stories?token=${token}&version=draft&starts_with=blog/&cv=${Date.now()}`;

  try {
    console.log(`[Storyblok Integration] Fetching stories from: ${baseUrl}/cdn/stories ...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const stories: StoryblokStory[] = data.stories || [];

    if (stories.length === 0) {
      console.warn("[Storyblok Integration] Connection succeeded, but returned 0 stories. Make sure you set your Storyblok space directory to 'blog/' or created stories in the 'blog' folder. Returning local fallback articles.");
      return BLOG_POSTS;
    }

    console.log(`[Storyblok Integration] Successfully fetched ${stories.length} stories from Storyblok CMS!`);

    // Map Storyblok stories schema to local BlogPost representation
    return stories.map((story) => {
      const c = story.content;

      const title = c.title || story.name;
      const excerpt = c.excerpt || "";
      const content = c.content || "";
      const category = c.category || "Beginner";
      const categoryThai = c.categoryThai || c.category_thai || "อื่นๆ";
      const author = c.author || "คลังผู้เขียน";
      const authorRole = c.authorRole || "ทีมวิชาการ";
      
      // Resolve asset or text URLs
      let authorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
      if (c.authorAvatar) {
        authorAvatar = typeof c.authorAvatar === "string" ? c.authorAvatar : c.authorAvatar.filename || authorAvatar;
      } else if (c.author_avatar) {
        authorAvatar = typeof c.author_avatar === "string" ? (c.author_avatar as string) : (c.author_avatar as { filename?: string }).filename || authorAvatar;
      }

      let coverImage = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800";
      if (c.coverImage) {
        coverImage = typeof c.coverImage === "string" ? c.coverImage : c.coverImage.filename || coverImage;
      } else if (c.cover_image) {
        coverImage = typeof c.cover_image === "string" ? (c.cover_image as string) : (c.cover_image as { filename?: string }).filename || coverImage;
      }

      const readTime = c.readTime || c.read_time || "อ่าน 5 นาที";
      
      // Compute formatted reading date
      const rawDate = story.published_at || story.created_at;
      let dateString = "19 มิ.ย. 2100";
      try {
        const d = new Date(rawDate);
        const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        dateString = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`; // Buddhist Era Year for locale
      } catch (e) {
        dateString = "19 มิ.ย. 2026";
      }

      return {
        id: story.slug, // Map to router page parameters (slug is perfect for SEO!)
        title,
        excerpt,
        content,
        category,
        categoryThai,
        author,
        authorRole,
        authorAvatar,
        readTime,
        date: dateString,
        coverImage
      };
    });

  } catch (error) {
    console.error("[Storyblok Integration] Failed to poll CDN:", error);
    console.warn("Fallback Mode: Utilizing high-quality pre-rendered local blog posts.");
    return BLOG_POSTS;
  }
}
