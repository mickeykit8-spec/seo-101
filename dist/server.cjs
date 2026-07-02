var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT || 3e3);
app.use(import_express.default.json());
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function loadSeoManifest(distPath) {
  const candidates = [
    import_path.default.join(distPath, "seo-manifest.json"),
    import_path.default.join(process.cwd(), "public", "seo-manifest.json")
  ];
  for (const candidate of candidates) {
    try {
      if (import_fs.default.existsSync(candidate)) {
        return JSON.parse(import_fs.default.readFileSync(candidate, "utf8"));
      }
    } catch (error) {
      console.warn("Failed to read SEO manifest:", error);
    }
  }
  return null;
}
function matchSeoRoute(manifest, requestPath) {
  if (!manifest) return null;
  const normalizedPath = requestPath === "" ? "/" : requestPath;
  const direct = manifest.routes.find((route) => route.path === normalizedPath);
  if (direct) return direct;
  if (normalizedPath.startsWith("/BlogPost/")) {
    return manifest.routes.find((route) => route.path === "/BlogPost") || null;
  }
  return null;
}
function injectSeoHead(html, route, manifest) {
  if (!route || !manifest) return html;
  const gscVerification = process.env.VITE_GSC_VERIFICATION || "";
  const bingVerification = process.env.VITE_BING_VERIFICATION || "";
  const keywords = (route.tags || []).join(", ");
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonicalUrl = escapeHtml(route.canonicalUrl);
  const ogTitle = escapeHtml(route.ogTitle || route.title);
  const ogDescription = escapeHtml(route.ogDescription || route.description);
  const ogImage = escapeHtml(route.ogImage || manifest.defaultOgImage || "");
  const ogType = escapeHtml(route.ogType || "website");
  const siteName = escapeHtml(manifest.siteName || "SEO Academy");
  const verificationTags = [
    gscVerification ? `<meta name="google-site-verification" content="${escapeHtml(gscVerification)}" />` : "",
    bingVerification ? `<meta name="msvalidate.01" content="${escapeHtml(bingVerification)}" />` : ""
  ].filter(Boolean).join("\n    ");
  const managedHead = `
    <meta name="description" content="${description}" />
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ""}
    ${verificationTags}
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:url" content="${canonicalUrl}" />
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ""}
    <meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ""}
  `;
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`).replace(/<meta\s+name=["']description["'][^>]*>\s*/i, "").replace(/<meta\s+property=["']og:[^>]*>\s*/gi, "").replace(/<meta\s+name=["']twitter:[^>]*>\s*/gi, "").replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "").replace("</head>", `${managedHead}
  </head>`);
}
var ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY environment variable found. Falling back to simulated AI analysis.");
}
function getSimulatedSeoData(domain) {
  const sanitizedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || "example.com";
  const dLength = sanitizedDomain.length;
  const score = 55 + dLength % 35;
  const da = 10 + dLength % 60;
  const pa = Math.min(da + 8, 95);
  const backlinkCount = dLength * 342 % 45e3 + 150;
  const refDomains = Math.round(backlinkCount / 8) + 12;
  return {
    domain: sanitizedDomain,
    siteHealth: {
      score,
      speedIndex: (1.5 + dLength % 30 / 10).toFixed(1),
      // e.g. 1.8s
      timeToFirstByte: 120 + dLength % 300,
      // ms
      secureHttps: sanitizedDomain.includes(".") && !sanitizedDomain.endsWith(".local"),
      mobileFriendly: score > 68
    },
    performanceTraffic: {
      trafficChart: [
        { month: "\u0E21.\u0E04.", organicTraffic: 3200 + dLength * 150, paidTraffic: 1200 + dLength * 40 },
        { month: "\u0E01.\u0E1E.", organicTraffic: 3900 + dLength * 150, paidTraffic: 1500 + dLength * 40 },
        { month: "\u0E21\u0E35.\u0E04.", organicTraffic: 4400 + dLength * 150, paidTraffic: 1100 + dLength * 40 },
        { month: "\u0E40\u0E21.\u0E22.", organicTraffic: 4200 + dLength * 150, paidTraffic: 900 + dLength * 40 },
        { month: "\u0E1E.\u0E04.", organicTraffic: 5100 + dLength * 150, paidTraffic: 1300 + dLength * 40 },
        { month: "\u0E21\u0E34.\u0E22.", organicTraffic: 6200 + dLength * 150, paidTraffic: 1600 + dLength * 40 }
      ],
      radarMetrics: [
        { subject: "\u0E04\u0E27\u0E32\u0E21\u0E40\u0E23\u0E47\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A", value: Math.max(40, score - 5) },
        { subject: "\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07 Content", value: Math.max(50, score + 2) },
        { subject: "Backlink Auth", value: da },
        { subject: "\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E04\u0E2D\u0E25 SEO", value: Math.max(45, score - 2) },
        { subject: "\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D", value: score > 68 ? 95 : 60 },
        { subject: "SEO \u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19", value: 70 }
      ],
      visibilityScore: Math.round(score * 0.85)
    },
    technicalSeo: [
      {
        issue: "\u0E15\u0E23\u0E27\u0E08\u0E1E\u0E1A\u0E1A\u0E25\u0E47\u0E2D\u0E01\u0E2A\u0E04\u0E23\u0E34\u0E1B\u0E15\u0E4C\u0E17\u0E35\u0E48\u0E1B\u0E34\u0E14\u0E01\u0E31\u0E49\u0E19\u0E01\u0E32\u0E23\u0E40\u0E23\u0E19\u0E40\u0E14\u0E2D\u0E23\u0E4C (Render-blocking JavaScript)",
        category: "Performance",
        severity: "high",
        resolved: false,
        description: "\u0E2A\u0E04\u0E23\u0E34\u0E1B\u0E15\u0E4C\u0E20\u0E32\u0E22\u0E19\u0E2D\u0E01\u0E01\u0E33\u0E25\u0E31\u0E07\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E01\u0E32\u0E23\u0E42\u0E2B\u0E25\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E0A\u0E49\u0E32\u0E25\u0E07 \u0E04\u0E27\u0E23\u0E22\u0E49\u0E32\u0E22\u0E2A\u0E04\u0E23\u0E34\u0E1B\u0E15\u0E4C\u0E44\u0E1B\u0E17\u0E49\u0E32\u0E22\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E41\u0E2D\u0E47\u0E15\u0E17\u0E23\u0E34\u0E1A\u0E34\u0E27\u0E15\u0E4C async/defer \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E30\u0E41\u0E19\u0E19 Core Web Vitals"
      },
      {
        issue: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E (Missing Alt Text) \u0E43\u0E19 12 \u0E23\u0E39\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01",
        category: "Content",
        severity: "medium",
        resolved: false,
        description: "\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E02\u0E32\u0E14\u0E41\u0E2D\u0E15\u0E17\u0E23\u0E34\u0E1A\u0E34\u0E27\u0E15\u0E4C alt \u0E17\u0E33\u0E43\u0E2B\u0E49 Google \u0E1A\u0E2D\u0E17\u0E44\u0E21\u0E48\u0E40\u0E02\u0E49\u0E32\u0E43\u0E08\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E19\u0E33\u0E40\u0E2A\u0E19\u0E2D\u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E08\u0E31\u0E14\u0E2D\u0E31\u0E19\u0E14\u0E31\u0E1A\u0E43\u0E19 Google Images \u0E44\u0E14\u0E49"
      },
      {
        issue: "\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E02\u0E49\u0E32\u0E21\u0E23\u0E30\u0E14\u0E31\u0E1A (Heading levels missing, e.g., H2 to H4)",
        category: "Structure",
        severity: "low",
        resolved: false,
        description: "\u0E01\u0E32\u0E23\u0E01\u0E23\u0E30\u0E42\u0E14\u0E14\u0E02\u0E49\u0E32\u0E21\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E21\u0E48\u0E0A\u0E31\u0E14\u0E40\u0E08\u0E19\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E42\u0E1B\u0E23\u0E41\u0E01\u0E23\u0E21\u0E2D\u0E48\u0E32\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E2D\u0E41\u0E25\u0E30\u0E1A\u0E2D\u0E17\u0E04\u0E49\u0E19\u0E2B\u0E32"
      },
      {
        issue: "\u0E44\u0E1F\u0E25\u0E4C XML Sitemap \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E43\u0E19 robots.txt",
        category: "Crawling",
        severity: "medium",
        resolved: false,
        description: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E41\u0E1C\u0E19\u0E1C\u0E31\u0E07\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C XML \u0E43\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E17\u0E49\u0E32\u0E22\u0E02\u0E2D\u0E07 robots.txt \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E0A\u0E48\u0E27\u0E22\u0E43\u0E2B\u0E49 Google \u0E1A\u0E2D\u0E17\u0E04\u0E49\u0E19\u0E1E\u0E1A\u0E02\u0E48\u0E32\u0E27\u0E2A\u0E32\u0E23\u0E2B\u0E23\u0E37\u0E2D\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E43\u0E2B\u0E21\u0E48\u0E46 \u0E44\u0E14\u0E49\u0E40\u0E23\u0E47\u0E27\u0E02\u0E36\u0E49\u0E19"
      }
    ],
    backlinkAnalysis: {
      domainAuthority: da,
      pageAuthority: pa,
      totalBacklinks: backlinkCount,
      referringDomains: refDomains,
      topBacklinks: [
        { sourceUrl: "https://medium.com/@seo-experts/tips", anchorText: `\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E17\u0E33 SEO \u0E02\u0E2D\u0E07 ${sanitizedDomain}`, authority: 88 },
        { sourceUrl: "https://pantip.com/topic/45885211", anchorText: `\u0E23\u0E35\u0E27\u0E34\u0E27\u0E40\u0E27\u0E47\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E41\u0E25\u0E30\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E08\u0E32\u0E01 ${sanitizedDomain}`, authority: 75 },
        { sourceUrl: "https://wikipedia.org/wiki/Search_engine_optimization", anchorText: sanitizedDomain, authority: 94 },
        { sourceUrl: "https://techsauce.co/news/seo-tech-trends", anchorText: `\u0E40\u0E17\u0E04\u0E42\u0E19\u0E42\u0E25\u0E22\u0E35\u0E43\u0E2B\u0E21\u0E48\u0E08\u0E32\u0E01 ${sanitizedDomain}`, authority: 69 }
      ]
    },
    keywordsContent: {
      keywords: [
        { keyword: "\u0E2A\u0E2D\u0E19 SEO \u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22", volume: 1500, difficulty: 45, position: 12 },
        { keyword: "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E40\u0E02\u0E35\u0E22\u0E19\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21 SEO \u0E22\u0E2D\u0E14\u0E19\u0E34\u0E22\u0E21", volume: 800, difficulty: 32, position: 4 },
        { keyword: sanitizedDomain, volume: 12e3, difficulty: 5, position: 1 },
        { keyword: "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C\u0E43\u0E2B\u0E49\u0E1B\u0E31\u0E07", volume: 2400, difficulty: 58, position: 28 },
        { keyword: "\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07 Google Business Profile", volume: 950, difficulty: 38, position: 8 }
      ],
      ideas: [
        { title: `\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E1B\u0E35 2026 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C ${sanitizedDomain}`, category: "Beginner Guide", difficulty: "\u0E07\u0E48\u0E32\u0E22" },
        { title: `\u0E2A\u0E23\u0E38\u0E1B 10 \u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E31\u0E1A On-Page SEO \u0E43\u0E2B\u0E49\u0E40\u0E27\u0E34\u0E25\u0E14\u0E4C\u0E04\u0E25\u0E32\u0E2A`, category: "On-Page", difficulty: "\u0E1B\u0E32\u0E19\u0E01\u0E25\u0E32\u0E07" },
        { title: `GEO \u0E04\u0E37\u0E2D\u0E2D\u0E30\u0E44\u0E23? \u0E27\u0E34\u0E18\u0E35\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E15\u0E31\u0E27\u0E40\u0E21\u0E37\u0E48\u0E2D AI \u0E40\u0E02\u0E49\u0E32\u0E21\u0E32\u0E01\u0E34\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E41\u0E1A\u0E48\u0E07\u0E02\u0E2D\u0E07 Search Engine`, category: "Future SEO", difficulty: "\u0E22\u0E32\u0E01" }
      ],
      prompts: [
        {
          title: "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19: \u0E40\u0E02\u0E35\u0E22\u0E19\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22 Meta Description \u0E17\u0E35\u0E48\u0E14\u0E36\u0E07\u0E2D\u0E31\u0E15\u0E23\u0E04\u0E25\u0E34\u0E01 (CTR)",
          prompt: `\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E02\u0E35\u0E22\u0E19 Meta Description \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E40\u0E27\u0E47\u0E1A ${sanitizedDomain} \u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 155 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23\u0E14\u0E36\u0E07\u0E14\u0E39\u0E14\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22\u0E43\u0E2B\u0E49\u0E2D\u0E22\u0E32\u0E01\u0E04\u0E25\u0E34\u0E01 \u0E41\u0E25\u0E30\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E25\u0E38\u0E21\u0E04\u0E35\u0E22\u0E4C\u0E40\u0E27\u0E34\u0E23\u0E4C\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D`
        },
        {
          title: "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19: \u0E40\u0E02\u0E35\u0E22\u0E19\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E1A\u0E25\u0E47\u0E2D\u0E01 (Heading Outline) \u0E40\u0E0A\u0E34\u0E07\u0E25\u0E36\u0E01",
          prompt: `\u0E42\u0E1B\u0E23\u0E14\u0E40\u0E2A\u0E19\u0E2D\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21 (H1, H2, H3) \u0E43\u0E19\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E02\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E19\u0E02\u0E2D\u0E07 ${sanitizedDomain} \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E01\u0E32\u0E23\u0E17\u0E33 Content Hub \u0E17\u0E35\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E30\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E25\u0E38\u0E21 Topical Authority`
        }
      ]
    },
    aiVisibilityGeo: {
      geoScore: score - 15,
      aiRecommendations: [
        "\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E22\u0E31\u0E07\u0E2A\u0E31\u0E49\u0E19\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B: \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D AI \u0E02\u0E2D\u0E07 Google (Gemini) \u0E41\u0E25\u0E30 Search Generative Experience \u0E21\u0E31\u0E01\u0E0A\u0E2D\u0E1A\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07\u0E08\u0E32\u0E01\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E17\u0E35\u0E48\u0E15\u0E2D\u0E1A\u0E04\u0E33\u0E16\u0E32\u0E21\u0E41\u0E1A\u0E1A\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E25\u0E38\u0E21\u0E41\u0E25\u0E30\u0E21\u0E35\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E15\u0E32\u0E23\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
        "\u0E0A\u0E37\u0E48\u0E2D\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E41\u0E25\u0E30\u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C\u0E22\u0E31\u0E07\u0E02\u0E32\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07 (Schema Markup) \u0E17\u0E33\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E20\u0E32\u0E29\u0E32\u0E02\u0E19\u0E32\u0E14\u0E43\u0E2B\u0E0D\u0E48\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E02\u0E2D\u0E07\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19 (Entity) \u0E44\u0E14\u0E49\u0E04\u0E48\u0E2D\u0E19\u0E02\u0E49\u0E32\u0E07\u0E22\u0E32\u0E01",
        "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E0A\u0E35\u0E48\u0E22\u0E27\u0E0A\u0E32\u0E0D (E-E-A-T): \u0E41\u0E2A\u0E14\u0E07\u0E01\u0E32\u0E23\u0E41\u0E19\u0E30\u0E19\u0E33\u0E15\u0E31\u0E27\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E35\u0E22\u0E19\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E1B\u0E31\u0E0D\u0E0D\u0E32\u0E1B\u0E23\u0E30\u0E14\u0E34\u0E29\u0E10\u0E4C\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E16\u0E37\u0E2D\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E17\u0E35\u0E48\u0E21\u0E32\u0E02\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"
      ]
    },
    competitorAnalysis: [
      { domain: "seo-competitor-master.th", overlapScore: 82, keywordGaps: ["\u0E04\u0E2D\u0E23\u0E4C\u0E2A\u0E2A\u0E2D\u0E19 seo \u0E1F\u0E23\u0E35", "\u0E08\u0E49\u0E32\u0E07\u0E17\u0E33 seo \u0E23\u0E32\u0E04\u0E32\u0E16\u0E39\u0E01", "\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E40\u0E27\u0E47\u0E1A\u0E04\u0E39\u0E48\u0E41\u0E02\u0E48\u0E07"] },
      { domain: "easy-rank-agency.com", overlapScore: 64, keywordGaps: ["\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E40\u0E02\u0E35\u0E22\u0E19 meta tag", "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E40\u0E2A\u0E35\u0E22", "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E23\u0E47\u0E27\u0E40\u0E27\u0E47\u0E1A"] },
      { domain: "thai-digital-wizard.co.th", overlapScore: 45, keywordGaps: ["\u0E42\u0E1B\u0E23\u0E42\u0E21\u0E17\u0E23\u0E49\u0E32\u0E19\u0E04\u0E49\u0E32 GMB", "\u0E17\u0E33 SEO \u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48 Google Maps", "\u0E2A\u0E2D\u0E19\u0E17\u0E33 Google My Business"] }
    ],
    growthStrategy: {
      untapped: [
        "\u0E40\u0E19\u0E49\u0E19\u0E17\u0E33\u0E04\u0E35\u0E22\u0E4C\u0E40\u0E27\u0E34\u0E23\u0E4C\u0E14\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E30\u0E40\u0E2A\u0E35\u0E22\u0E07 (Voice & Image Search): \u0E40\u0E19\u0E37\u0E48\u0E2D\u0E07\u0E08\u0E32\u0E01\u0E1E\u0E24\u0E15\u0E34\u0E01\u0E23\u0E23\u0E21\u0E04\u0E19\u0E44\u0E17\u0E22\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E14\u0E48\u0E27\u0E19\u0E1C\u0E48\u0E32\u0E19\u0E20\u0E32\u0E1E\u0E16\u0E48\u0E32\u0E22\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E2A\u0E31\u0E48\u0E07\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E2A\u0E39\u0E07\u0E02\u0E36\u0E49\u0E19",
        "\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07 SEO \u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19 (Local SEO Nodes) \u0E21\u0E38\u0E48\u0E07\u0E40\u0E19\u0E49\u0E19\u0E44\u0E1B\u0E17\u0E35\u0E48\u0E01\u0E32\u0E23\u0E1B\u0E31\u0E01\u0E2B\u0E21\u0E38\u0E14\u0E23\u0E2D\u0E1A\u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22 Google Business Profile"
      ],
      quickWins: [
        "\u0E41\u0E01\u0E49 Alt Text \u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E02\u0E32\u0E14\u0E2B\u0E32\u0E22\u0E44\u0E1B\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E15\u0E34\u0E14\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E2B\u0E19\u0E49\u0E32 Google Image Search \u0E17\u0E31\u0E19\u0E17\u0E35",
        "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E2A\u0E04\u0E23\u0E34\u0E1B\u0E15\u0E4C\u0E2B\u0E19\u0E48\u0E27\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E04\u0E30\u0E41\u0E19\u0E19 Google Core Web Vitals (LCP) \u0E17\u0E31\u0E19\u0E17\u0E35"
      ],
      roadmap90Days: [
        { phase: "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48 1: \u0E15\u0E2D\u0E01\u0E40\u0E2A\u0E32\u0E40\u0E02\u0E47\u0E21\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E04\u0E2D\u0E25 (Technical Pillar)", tasks: ["\u0E41\u0E01\u0E49\u0E44\u0E02 Render-blocking scripts \u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", "\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07 Schema Markup \u0E40\u0E0A\u0E34\u0E07\u0E25\u0E36\u0E01\u0E02\u0E2D\u0E07\u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E41\u0E25\u0E30\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23", "\u0E1C\u0E39\u0E01\u0E40\u0E27\u0E47\u0E1A\u0E40\u0E02\u0E49\u0E32\u0E01\u0E31\u0E1A Google Search Console"] },
        { phase: "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48 2: \u0E1B\u0E0F\u0E34\u0E27\u0E31\u0E15\u0E34\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32 (Content & Semantic Hub)", tasks: ["\u0E40\u0E02\u0E35\u0E22\u0E19\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32\u0E41\u0E19\u0E27 Semantic SEO \u0E15\u0E32\u0E21\u0E41\u0E1C\u0E19 10 \u0E1A\u0E17\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E25\u0E31\u0E01", "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D Link Wheel \u0E20\u0E32\u0E22\u0E43\u0E19\u0E40\u0E27\u0E47\u0E1A (Internal Contextual Linking)", "\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D Meta Title \u0E43\u0E2B\u0E49\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 60 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23"] },
        { phase: "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48 3: \u0E01\u0E23\u0E30\u0E15\u0E38\u0E49\u0E19\u0E41\u0E23\u0E07\u0E2A\u0E48\u0E07\u0E41\u0E25\u0E30\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15 (Authority Building)", tasks: ["\u0E40\u0E0A\u0E34\u0E0D\u0E0A\u0E27\u0E19\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E21\u0E32\u0E23\u0E35\u0E27\u0E34\u0E27\u0E41\u0E25\u0E30\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E04\u0E23\u0E37\u0E2D\u0E02\u0E48\u0E32\u0E22 Backlinks \u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E\u0E2A\u0E39\u0E48\u0E2D\u0E34\u0E19\u0E42\u0E1F\u0E01\u0E23\u0E32\u0E1F\u0E34\u0E01", "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E41\u0E25\u0E30\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E19 Google Business Profile \u0E23\u0E32\u0E22\u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C"] }
      ]
    }
  };
}
app.post("/api/analyze-seo", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38 URL \u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C" });
  }
  const simulated = getSimulatedSeoData(url);
  if (ai) {
    try {
      const prompt = `\u0E04\u0E38\u0E13\u0E04\u0E37\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E0A\u0E35\u0E48\u0E22\u0E27\u0E0A\u0E32\u0E0D\u0E14\u0E49\u0E32\u0E19 SEO \u0E23\u0E30\u0E14\u0E31\u0E1A\u0E2A\u0E32\u0E01\u0E25 (SEO Master Coach) \u0E17\u0E35\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E2A\u0E1A\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E14\u0E31\u0E19\u0E2D\u0E31\u0E19\u0E14\u0E31\u0E1A\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22\u0E21\u0E32\u0E41\u0E25\u0E49\u0E27\u0E01\u0E27\u0E48\u0E32 15 \u0E1B\u0E35
\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E49\u0E04\u0E38\u0E13\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E04\u0E37\u0E2D: ${url}

\u0E42\u0E1B\u0E23\u0E14\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C SEO \u0E41\u0E1A\u0E1A\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 \u0E42\u0E14\u0E22\u0E43\u0E2B\u0E49\u0E2A\u0E2D\u0E14\u0E04\u0E25\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E1A\u0E1E\u0E24\u0E15\u0E34\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E17\u0E33\u0E15\u0E25\u0E32\u0E14\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C\u0E43\u0E19\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22 \u0E04\u0E37\u0E19\u0E04\u0E48\u0E32\u0E21\u0E32\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A JSON \u0E15\u0E32\u0E21\u0E42\u0E21\u0E40\u0E14\u0E25\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E15\u0E48\u0E2D\u0E44\u0E1B\u0E19\u0E35\u0E49\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E22\u0E2D\u0E37\u0E48\u0E19\u0E1B\u0E30\u0E1B\u0E19 (\u0E2A\u0E48\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E40\u0E08\u0E2A\u0E31\u0E19\u0E41\u0E17\u0E49):

${JSON.stringify(simulated, null, 2)}

\u0E02\u0E49\u0E2D\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21:
1. \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E23\u0E27\u0E21\u0E16\u0E36\u0E07\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33 \u0E23\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D\u0E04\u0E35\u0E22\u0E4C\u0E40\u0E27\u0E34\u0E23\u0E4C\u0E14 \u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E04\u0E2D\u0E25 \u0E41\u0E25\u0E30\u0E41\u0E1C\u0E19\u0E01\u0E25\u0E22\u0E38\u0E17\u0E18\u0E4C\u0E40\u0E15\u0E34\u0E1A\u0E42\u0E15 \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E02\u0E35\u0E22\u0E19\u0E14\u0E49\u0E27\u0E22\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22\u0E01\u0E23\u0E30\u0E0A\u0E31\u0E1A \u0E40\u0E02\u0E49\u0E32\u0E43\u0E08\u0E07\u0E48\u0E32\u0E22 \u0E41\u0E25\u0E30\u0E43\u0E2B\u0E49\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E42\u0E22\u0E07\u0E40\u0E02\u0E49\u0E32\u0E01\u0E31\u0E1A\u0E42\u0E14\u0E40\u0E21\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E02\u0E2D\u0E07 ${url}
2. \u0E04\u0E37\u0E19\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23 JSON \u0E17\u0E35\u0E48\u0E21\u0E35\u0E1F\u0E34\u0E25\u0E14\u0E4C\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19\u0E40\u0E1B\u0E4A\u0E30\u0E15\u0E32\u0E21\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07 \u0E2B\u0E49\u0E32\u0E21\u0E21\u0E35\u0E1A\u0E25\u0E47\u0E2D\u0E01\u0E04\u0E33\u0E1E\u0E39\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E23\u0E34\u0E21\u0E23\u0E2D\u0E1A\u0E19\u0E2D\u0E01`;
      console.log(`Querying Gemini (gemini-3.5-flash) for URL: ${url}`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const responseText = response.text;
      if (responseText) {
        try {
          const parsedSeoData = JSON.parse(responseText.trim());
          console.log("Successfully parsed Gemini SEO analysis payload.");
          return res.json(parsedSeoData);
        } catch (parseError) {
          console.warn("Failed to parse Gemini JSON output. Falling back to structured simulated data.", parseError);
        }
      }
    } catch (apiError) {
      console.error("Gemini API call failed. Falling back to client-friendly simulated data.", apiError);
    }
  }
  return res.json(simulated);
});
var startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    const indexPath = import_path.default.join(distPath, "index.html");
    const seoManifest = loadSeoManifest(distPath);
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      try {
        const html = import_fs.default.readFileSync(indexPath, "utf8");
        const route = matchSeoRoute(seoManifest, req.path);
        res.type("html").send(injectSeoHead(html, route, seoManifest));
      } catch (error) {
        console.error("Failed to serve SEO-injected SPA fallback:", error);
        res.sendFile(indexPath);
      }
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SEO Server] Server running securely on http://0.0.0.0:${PORT}`);
  });
};
startServer().catch((error) => {
  console.error("Failed to start full-stack server:", error);
});
//# sourceMappingURL=server.cjs.map
