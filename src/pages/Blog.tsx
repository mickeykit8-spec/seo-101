import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Calendar, Clock, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "../data/blogPosts";
import { fetchStoryblokPosts } from "../utils/storyblok";

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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

  const categories = [
    { id: "All", name: "ทั้งหมด" },
    { id: "Beginner", name: "สำหรับเริ่มต้น" },
    { id: "Technical", name: "เทคนิคอลเชิงลึก" },
    { id: "Local SEO", name: "SEO แผนที่/ท้องถิ่น" },
    { id: "AI SEO", name: "SEO ยุค AI (GEO)" }
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts[0];
  const gridPosts = searchQuery || selectedCategory !== "All" ? filteredPosts : filteredPosts.slice(1);


  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans pb-16">
      
      {/* Blog Hub Hero Title Banner */}
      <div className="bg-white border-b border-slate-200 py-16 relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
            คลังความรู้และ <span className="text-emerald-650 bg-emerald-50 px-2 rounded-lg text-emerald-600 font-black">บทความ SEO</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base font-medium">
            อัปเดตสถิติ เทคนิคเชิงลึก กลยุทธ์กวาดทราฟฟิกหน้าแรก Google และปักหมุดหน้าร้าน GMB ที่ดีที่สุดเพื่อคนไทย
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative mt-6">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อเรื่อง คีย์เวิร์ด หรือปัญหาเทคนิคอล..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-sm rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 font-semibold focus:bg-white transition-all shadow-2sm"
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Category Tabs Panel */}
        <div className="flex overflow-x-auto py-2 scrollbar-none border-b border-slate-200 space-x-2 pb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-black rounded-full border cursor-pointer whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-slate-800 border-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/60 mt-8 shadow-sm space-y-4">
            <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
            <p className="text-slate-700 text-sm font-black">
              กำลังเชื่อมต่อและดึงข้อมูลบทความล่าสุดจาก Storyblok...
            </p>
            <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase">Storyblok REST Content Delivery API</p>
          </div>
        ) : (
          <>
            {/* Sync Badge Panel */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400">
                พบบทความเกี่ยวข้องทั้งหมด {filteredPosts.length} รายการ
              </p>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-150 text-emerald-700 rounded-full text-[10px] font-black shadow-3sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span>เชื่อมต่อ Storyblok CMS คลังนอกเรียบร้อย</span>
              </span>
            </div>

            {/* Empty Search Result feedback */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 mt-8 shadow-sm">
                <p className="text-slate-800 font-extrabold mb-1 text-lg">ไม่พบบทความที่คุณค้นหา</p>
                <p className="text-xs text-slate-400 font-bold">กรุณาลองเปลี่ยนคำค้นหา หรือกดเลือกชมบทความหมวด 'ทั้งหมด'</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  className="mt-4 px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-lg cursor-pointer hover:bg-emerald-600"
                >
                  รีเซ็ตการค้นหา
                </button>
              </div>
            )}

            {/* Highlighted Featured Post Section (only shown when no query/category filter is selected) */}
            {!searchQuery && selectedCategory === "All" && featuredPost && (
              <div className="mt-10 space-y-4">
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 uppercase inline-block px-3 py-1 rounded-full border border-emerald-150">
                  บทความน่าสนใจพิเศษ ⭐
                </span>
                <div 
                  onClick={() => navigate(`/BlogPost/${featuredPost.id}`)}
                  className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="lg:col-span-6 relative aspect-video lg:aspect-auto border-r-0 lg:border-r border-b lg:border-b-0 border-slate-200">
                    <img 
                      src={featuredPost.coverImage} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                    />
                    <span className="absolute top-4 left-4 bg-emerald-500 text-white border border-emerald-600 font-bold text-xs px-3 py-1 rounded-lg">
                      {featuredPost.categoryThai}
                    </span>
                  </div>
                  
                  <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-xs text-slate-400 font-bold">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-900" />
                          <span>{featuredPost.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-900" />
                          <span>{featuredPost.readTime}</span>
                        </span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {featuredPost.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                      <div className="flex items-center space-x-3">
                        <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-none mb-1">{featuredPost.author}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{featuredPost.authorRole}</p>
                        </div>
                      </div>
                      
                      <div className="text-emerald-600 flex items-center text-xs font-black group-hover:translate-x-1 transition-transform">
                        <span>อ่านบทความเต็ม</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic List Grid Cards */}
            {filteredPosts.length > 0 && (
              <div className="mt-12 space-y-6">
                <h3 className="text-lg font-black text-slate-900 border-l-4 border-emerald-500 pl-3">
                  รายการข่าวสารบทความทั้งหมด
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridPosts.map((post) => (
                    <div 
                      key={post.id}
                      onClick={() => navigate(`/BlogPost/${post.id}`)}
                      className="group cursor-pointer bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2sm hover:shadow-md transition-all duration-250 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-video border-b border-light-200 overflow-hidden">
                          <img 
                            src={post.coverImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-350" 
                          />
                          <span className="absolute top-3 left-3 bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg">
                            {post.categoryThai}
                          </span>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-semibold mb-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{post.date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </span>
                          </div>

                          <h4 className="font-extrabold text-base text-slate-850 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>

                          <p className="text-slate-450 text-xs sm:text-sm line-clamp-3 leading-relaxed font-semibold">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img src={post.authorAvatar} alt={post.author} className="w-7 h-7 rounded-full border border-slate-200 object-cover" />
                          <div>
                            <span className="text-slate-800 text-[11px] font-bold block">{post.author}</span>
                          </div>
                        </div>

                        <div className="text-emerald-650 font-black text-xs group-hover:translate-x-1 transition-transform flex items-center">
                          <span>อ่านเพิ่ม</span>
                          <ArrowRight className="w-3 h-3 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}
