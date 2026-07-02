import { useState, useEffect } from "react";
import { useSearchParams, useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, MessageSquare, BookOpen, Loader2 } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { BLOG_POSTS, BlogPost as BlogPostType } from "../data/blogPosts";
import { fetchStoryblokPosts } from "../utils/storyblok";

export default function BlogPost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: routePostId } = useParams();
  const postId = routePostId || searchParams.get("id");

  const [posts, setPosts] = useState<BlogPostType[]>(BLOG_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadPosts() {
      setIsLoading(true);
      const data = await fetchStoryblokPosts();
      if (active) {
        setPosts(data);
        setIsLoading(false);
      }
    }
    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  // Retrieve matching article or fall back to the first post
  const activePost = posts.find((p) => p.id === postId) || posts[0];

  // Pick other posts as recommendations
  const recommendedPosts = posts.filter((p) => p.id !== activePost.id).slice(0, 3);


  // Turn string paragraphs with mock markdown headers into HTML paragraphs
  const renderFormattedContent = (contentString: string) => {
    const lines = contentString.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-4" />;
      
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={i} className="text-2xl sm:text-3.5xl font-black text-slate-900 mt-8 mb-4 tracking-tight border-b border-slate-100 pb-2">
            {trimmed.replace("# ", "")}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl sm:text-2xl font-black text-slate-900 mt-6 mb-3 tracking-tight">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-extrabold text-slate-800 mt-5 mb-2">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("*   ") || trimmed.startsWith("* ")) {
        const textStr = trimmed.replace(/^\s*\*\s+/, "");
        return (
          <li key={i} className="ml-5 list-disc text-sm sm:text-base text-slate-650 leading-relaxed font-sans mb-1.5 font-semibold">
            {textStr.includes("**") ? (
              <span>
                {textStr.split("**").map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-900 font-bold">{part}</strong> : part)}
              </span>
            ) : textStr}
          </li>
        );
      }
      if (trimmed.startsWith("1.  ") || trimmed.startsWith("1. ")) {
        const textStr = trimmed.replace(/^\s*\d+\.\s+/, "");
        return (
          <li key={i} className="ml-5 list-decimal text-sm sm:text-base text-slate-650 leading-relaxed font-sans mb-2 font-semibold">
            {textStr.includes("**") ? (
              <span>
                {textStr.split("**").map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-900 font-bold">{part}</strong> : part)}
              </span>
            ) : textStr}
          </li>
        );
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={i} className="border-l-4 border-emerald-500 bg-emerald-50/55 p-4 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed my-4 font-semibold">
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }
      
      // Standard Paragraph
      return (
        <p key={i} className="text-sm sm:text-base text-slate-650 leading-relaxed mb-4 font-sans font-semibold">
          {trimmed.includes("**") ? (
            <span>
              {trimmed.split("**").map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-905 font-black">{part}</strong> : part)}
            </span>
          ) : trimmed}
        </p>
      );
    });
  };

  return (
    <>
    <SEOHead
      path={`/BlogPost/${activePost.id}`}
      seo={{
        metaTitle: activePost.metaTitle || `${activePost.title} | SEO Academy`,
        metaDescription: activePost.metaDescription || activePost.excerpt,
        metaKeywords: activePost.metaKeywords || [activePost.category, activePost.categoryThai, "SEO Academy"],
        canonicalUrl: activePost.canonicalUrl,
        ogTitle: activePost.ogTitle || activePost.title,
        ogDescription: activePost.ogDescription || activePost.excerpt,
        ogImage: activePost.ogImage || activePost.coverImage,
        ogImageAlt: activePost.ogImageAlt || activePost.title,
        ogType: activePost.ogType || "article",
        authorName: activePost.author,
        authorRole: activePost.authorRole,
        authorAvatar: activePost.authorAvatar,
        authorProfileUrl: activePost.authorProfileUrl,
        authorBio: activePost.authorBio,
        contentTags: activePost.contentTags || [activePost.category, activePost.categoryThai],
        schemaJsonLd: activePost.schemaJsonLd || {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: activePost.title,
          description: activePost.excerpt,
          image: activePost.coverImage,
          author: {
            "@type": "Person",
            name: activePost.author,
          },
          publisher: {
            "@type": "Organization",
            name: "SEO Academy",
          },
        },
      }}
    />
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans pb-20">
      
      {/* Blog Detail Header */}
      <div className="max-w-4xl mx-auto px-4 pt-10 sm:pt-14 relative z-10">
        
        {/* Back Link Button */}
        <Link 
          to="/Blog" 
          className="inline-flex items-center space-x-1.5 text-slate-450 hover:text-emerald-600 text-sm font-extrabold transition-all mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับไปคลังบทความ</span>
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/60 mt-8 shadow-sm space-y-4">
            <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
            <p className="text-slate-700 text-sm font-black text-center px-4">
              กำลังเชื่อมต่อและโหลดข้อมูลบทความคลังหลักแบบเรียลไทม์...
            </p>
            <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase">Storyblok CDN API Sync</p>
          </div>
        ) : (
          <>

        {/* Tags / Meta */}
        <div className="space-y-4 font-sans">
          <div>
            <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-black rounded-lg uppercase">
              {activePost.categoryThai}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight pt-1">
            {activePost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-y border-slate-200 py-4 font-semibold">
            <div className="flex items-center space-x-2">
              <img src={activePost.authorAvatar} alt={activePost.author} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
              <div>
                <span className="font-extrabold text-slate-800 block">{activePost.author}</span>
                <span className="text-[10px] text-slate-400 block">{activePost.authorRole}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-auto sm:ml-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{activePost.date}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activePost.readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Cover Image */}
        <div className="mt-8 rounded-3xl overflow-hidden aspect-video border border-slate-200 shadow-sm">
          <img src={activePost.coverImage} alt={activePost.title} className="w-full h-full object-cover" />
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 blog-content bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            {renderFormattedContent(activePost.content)}

            {/* Social Sharing block */}
            <div className="border-t border-slate-100 mt-10 pt-6 flex items-center justify-between font-sans">
              <span className="text-xs font-extrabold text-slate-400 flex items-center">
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span>แชร์บทความความรู้นี้ต่อ:</span>
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => alert("ระบบกำลังประมวลผลการคัดลอกลิงก์เพื่อส่งต่อไปยังเครือข่ายสังคมของคุณ")}
                  className="p-2 border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => alert("ระบบแชร์ด่วนพร้อมเชื่อมต่อไปยัง Line/Messenger")}
                  className="p-2 border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Newsletter & Quick recommendations */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick newsletter callout */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center space-x-1.5 text-emerald-650 text-emerald-600">
                <BookOpen className="w-5 h-5" />
                <h4 className="font-extrabold text-sm text-slate-900">รับจดหมายข่าวคอร์สฟรี</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                สมัครรับเทคนิคปรับกลเม็ด SEO สคริปต์สแกนคำถาม AI เพื่อดันอันดับรายสัปดาห์ ส่งตรงถึงอีเมลของคุณฟรี!
              </p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-semibold focus:outline-none"
                />
                <button 
                  onClick={() => alert("ขอบคุณสำหรับการลงทะเบียนรับข้อมูลข่าวสารรายสัปดาห์!")}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 ml-0.5 text-white text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-2sm"
                >
                  สมัครรับข้อมูลด่วน
                </button>
              </div>
            </div>

            {/* Recommended Posts list */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-905 pl-1 border-l-2 border-emerald-500">บทความอื่นๆ สำหรับคุณ</h4>
              
              <div className="space-y-4">
                {recommendedPosts.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => navigate(`/BlogPost/${p.id}`)}
                    className="group cursor-pointer bg-white p-4 border border-slate-200 hover:shadow-2sm rounded-2xl transition-all flex items-start space-x-3"
                  >
                    <img src={p.coverImage} alt={p.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-extrabold text-emerald-600 block">{p.categoryThai}</span>
                      <h5 className="font-extrabold text-slate-850 text-xs leading-snug group-hover:text-emerald-600 line-clamp-2 transition-colors">
                        {p.title}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

          </>
        )}

      </div>

    </div>
    </>
  );
}
