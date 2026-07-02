import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Rocket, CheckCircle, Award, Target, HelpCircle, 
  MapPin, Star, User, Calendar, ArrowRight, ShieldCheck, Gamepad2, BrainCircuit,
  AlertTriangle, Check, Sparkles, MessageSquare, TrendingUp, BarChart3, GraduationCap, Users, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { awardPoints } from "../utils/gamification";

export default function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Typewriter text state
  const words = ["ผู้ชำนาญการ SEO 101", "ผู้บริหารสูงสุด GMB", "ผู้นำยุค Generative Search (GEO)", "ผู้รับมือ Core Updates"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullWord = words[currentWordIndex];
    
    const tick = () => {
      if (!isDeleting) {
        setDisplayText(currentFullWord.substring(0, displayText.length + 1));
        if (displayText.length === currentFullWord.length) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setDisplayText(currentFullWord.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const speed = isDeleting ? 40 : 100;
    timer = setTimeout(tick, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "เรียนรู้คอร์สพื้นฐาน",
    message: ""
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({
        name: "",
        email: "",
        phone: "",
        topic: "เรียนรู้คอร์สพื้นฐาน",
        message: ""
      });
    }, 2500);
  };

  // SEO / AIO / GEO interactive knowledge base states
  const [activeKBTab, setActiveKBTab] = useState<"standard" | "aio" | "geo" | "core">("standard");
  const [kbExplored, setKbExplored] = useState<string[]>([]);
  const [pointNotification, setPointNotification] = useState<string | null>(null);

  const handleExploreKBTopic = (topicKey: string, topicName: string) => {
    if (kbExplored.includes(topicKey)) return;
    setKbExplored([...kbExplored, topicKey]);
    // Award 40 points in gamification local storage
    awardPoints(40);
    setPointNotification(`🎉 +40 แต้มภารกิจ! สำรวจวิชาความรู้ของแผง: "${topicName}" สำเร็จ`);
    setTimeout(() => setPointNotification(null), 3500);
  };

  const courses = [
    {
      id: "beginner-seo",
      title: "SEO เริ่มต้น",
      badge: "BEGINNER",
      description: "เหมาะสำหรับผู้เริ่มต้นที่อยากเข้าใจพื้นฐาน SEO และทำเว็บไซต์ให้ติด Google",
      price: "฿2,900",
      period: "คอร์สเดียวจบ",
      features: [
        "พื้นฐาน SEO และการทำงานของ Google",
        "การหาคีย์เวิร์ดเบื้องต้น",
        "On-Page SEO ฉบับเริ่มต้น",
        "เข้าถึงเกมฝึกทักษะทั้งหมด",
        "ใบประกาศนียบัตร"
      ],
      btnText: "ลงทะเบียนเรียน",
      isPrimary: false
    },
    {
      id: "advanced-seo",
      title: "SEO ขั้นสูง",
      badge: "ADVANCED",
      tag: "ยอดนิยม",
      description: "สำหรับคนที่มีพื้นฐานแล้ว ต้องการกลยุทธ์ขั้นสูงและการใช้เครื่องมือ AI เต็มรูปแบบ",
      price: "฿6,900",
      period: "คอร์สเดียวจบ",
      features: [
        "ทุกอย่างในคอร์สเริ่มต้น",
        "Technical SEO เชิงลึก",
        "กลยุทธ์ Backlink และ Content",
        "การใช้เครื่องมือวิเคราะห์ AI เต็มรูปแบบ",
        "Workshop วิเคราะห์เว็บจริง",
        "ที่ปรึกษา 1:1 จำนวน 2 ครั้ง"
      ],
      btnText: "ลงทะเบียนเรียน",
      isPrimary: true
    },
    {
      id: "corporate-seo",
      title: "องค์กร",
      badge: "CORPORATE",
      description: "อบรมทีมในองค์กร พร้อมที่ปรึกษาประจำโปรเจกต์และแผนกลยุทธ์เฉพาะธุรกิจของคุณ",
      price: "ติดต่อเรา",
      period: "แพ็คเกจปรับแต่งได้",
      features: [
        "อบรมทีมในองค์กร (ไม่จำกัดที่นั่ง)",
        "เนื้อหาปรับตามอุตสาหกรรม",
        "ที่ปรึกษาประจำโปรเจกต์",
        "รายงานผลและ Dashboard องค์กร",
        "สิทธิ์เข้าถึงเครื่องมือ AI ระดับทีม"
      ],
      btnText: "ขอใบเสนอราคา",
      isPrimary: false
    }
  ];

  const faqs = [
    {
      q: "ไม่มีพื้นฐานเลยเรียนได้ไหม?",
      a: "เรียนได้แน่นอนครับ คอร์สเริ่มต้น (Beginner) ของเราปูพื้นฐานตั้งแต่ศูนย์ อธิบายศัพท์ยากๆ ให้เข้าใจง่าย มีคลิปและมินิเกมจำลองให้ลองทำจริงจนเข้าใจพฤติกรรมของ Googlebot"
    },
    {
      q: "เรียนจบแล้วจะติดอันดับ Google ได้จริงไหม?",
      a: "คอร์สของเราเน้นโครงสร้างเชิงปฏิบัติและการแก้ไขปัญหาที่มีผลจริงต่อระบบตรวจจับอันดับ หากประยุกต์ทำตามหลักการส่งเสริมสุขภาพ On-Page, GMB ปักหมุด และโครงสร้าง Technical จะช่วยให้อันดับของคุณเริ่มพุ่งทะยานและคว้า Organic Traffic ได้ชัดเจนแน่นอน"
    },
    {
      q: "คอร์สเรียนได้นานแค่ไหน?",
      a: "ทุกหลักสูตรของ SEO Academy มีระบบเข้าใช้บริการทบทวนข้อมูลได้ตลอดอายุการใช้งาน (Lifetime Access) ไม่มีหมดอายุ และเรียนได้ฟรีเมื่อมีการปรับเนื้อหารอบใหม่ตรรกะกูเกิลบอย"
    },
    {
      q: "เครื่องมือวิเคราะห์ AI ใช้งานยากไหม?",
      a: "ใช้งานง่ายมากครับ ระบบ AI Auditor ของเราจะจำลองการสแกนองค์ประกอบเพจของคุณ จากนั้นสรุปประเด็นผิดพลาดพร้อมบอกแนวทางแก้ไขทีละสเต็ปเป็นภาษาไทยอย่างละเอียด"
    },
    {
      q: "มีใบประกาศนียบัตรหรือไม่?",
      a: "มีใบรับรองวิชาชีพรูปแบบดิจิทัล (Digital Certificate) มอบให้ทันทีเมื่อคุณสำเร็จการอบรมเนื้อหา หรือทำแต้มความสำเร็จในเซคเตอร์เกมจำลองอันดับสูงสุด"
    },
    {
      q: "ชำระเงินได้ช่องทางไหนบ้าง?",
      a: "เรามีระบบความปลอดภัยรองรับความต้องการ ทั้งบัตรเครดิต, พร้อมเพย์สแกน QR Code และบริการโอนจ่ายผ่านบัญชีธนาคารเพื่อรับใบเสร็จภาษีหัก ณ ที่จ่ายครบถ้วน"
    }
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden text-gray-900 font-sans selection:bg-emerald-150 selection:text-emerald-900">
      
      {/* Search/Points notification alerts decoration */}
      <AnimatePresence>
        {pointNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white border border-emerald-150 text-gray-900 px-6 py-3.5 rounded-full shadow-lg flex items-center space-x-3"
          >
            <div className="p-1 bg-emerald-50 rounded-full text-emerald-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">{pointNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-gray-50/50 via-white to-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left intro text */}
            <div className="lg:col-span-7 space-y-6 min-w-0">
              <div className="inline-flex max-w-full items-center space-x-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold shadow-sm border border-emerald-100">
                <span>🌟</span>
                <span className="break-words">แพลตฟอร์มเรียน SEO อันดับ 1 ของไทย</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight">
                เรียนรู้ที่จะ
                <br />
                <span className="text-emerald-500 inline-flex items-center">
                  ติดอันดับ 1
                  <span className="w-1.5 h-10 bg-emerald-500 ml-1.5 animate-pulse rounded-full"></span>
                </span>
              </h1>
              
              <p className="text-gray-500 text-lg sm:text-lg max-w-xl leading-relaxed break-words">
                คอร์สเรียน SEO ครบวงจรภาษาไทย พร้อมเครื่องมือวิเคราะห์ด้วย AI เกมฝึกทักษะ และระบบเก็บคะแนนความสำเร็จแบบจัดเต็ม ออกแบบมาเพื่อให้คุณเห็นผลลัพธ์จริงตั้งแต่สัปดาห์แรก
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => navigate("/SEOTools")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>เริ่มเรียนเลย</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate("/Games")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-750 border border-gray-200 font-semibold rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <BrainCircuit className="w-4 h-4 text-emerald-500" />
                  <span>ทดลองเครื่องมือ AI ฟรี</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-extrabold text-gray-950 tracking-tight">12,000+</div>
                  <div className="text-xs text-gray-500 font-normal mt-1 leading-normal">ผู้เรียนสำเร็จ</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-gray-950 tracking-tight">4.9/5</div>
                  <div className="text-xs text-gray-500 font-normal mt-1 leading-normal">คะแนนรีวิวเฉลี่ย</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-gray-950 tracking-tight">320%</div>
                  <div className="text-xs text-gray-500 font-normal mt-1 leading-normal">ทราฟฟิกเฉลี่ยที่เพิ่มขึ้น</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-gray-950 tracking-tight">8 ปี</div>
                  <div className="text-xs text-gray-500 font-normal mt-1 leading-normal">ประสบการณ์สอน</div>
                </div>
              </div>
            </div>

            {/* Right Graphic Mockup of Dashboard (Super polished, soft shadow) */}
            <div className="lg:col-span-5 relative min-w-0">
              <div className="relative w-full max-w-md min-w-0 bg-white rounded-[24px] border border-gray-100 p-4 sm:p-6 shadow-2xl space-y-6 mx-auto">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-100 rounded-full border border-red-200"></span>
                    <span className="w-3 h-3 bg-yellow-100 rounded-full border border-yellow-200"></span>
                    <span className="w-3 h-3 bg-emerald-100 rounded-full border border-emerald-200"></span>
                  </div>
                  <span className="min-w-0 truncate text-xs font-medium text-gray-400">seo_dashboard_analytics.io</span>
                </div>
                
                {/* Ranking growth graph & local search card layout */}
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="min-w-0 text-xs text-emerald-800 font-bold tracking-wide uppercase break-words">Organic Traffic Growth</span>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    {/* SVG Curve graph for beautiful visual */}
                    <div className="h-16 w-full mt-3">
                      <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M10,60 C40,55 70,30 100,45 C130,60 160,20 190,25 C220,30 250,5 290,2" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                        />
                        <path 
                          d="M10,60 C40,55 70,30 100,45 C130,60 160,20 190,25 C220,30 250,5 290,2 L290,70 L10,70 Z" 
                          fill="url(#gradient)" 
                        />
                        <circle cx="290" cy="2" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Average Rank</div>
                        <div className="text-xl font-bold text-gray-900 mt-1">#1.2</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-100/50 text-emerald-600 flex items-center justify-center font-bold text-xs">▲</div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">No. of AI Citations</div>
                        <div className="text-xl font-bold text-gray-900 mt-1">124+</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs">🤖</div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-2xl flex items-center space-x-3 bg-white">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center select-none shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Google My Business หมุดสุขภาพดี 100%</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">การมองเห็นในพื้นที่ได้รับความมั่นคงและสมบูรณ์สูงสุด</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full inline-block leading-relaxed max-w-full text-center break-words">
                    ✨ Get your keywords ranked in Google 1st page & your brand cited in AI Platforms (Google AI Overviews, ChatGPT, Gemini)
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why SEO / Features Section */}
      <section className="py-20 bg-white border-t border-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              ทำไมต้องเรียน SEO กับเรา
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              เราออกแบบทุกอย่างเพื่อให้คุณนำไปใช้ได้จริง ไม่ใช่แค่ทฤษฎี
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "หลักสูตรจากผู้เชี่ยวชาญ",
                desc: "เนื้อหาที่กลั่นกรองจากประสบการณ์ตรงของที่ปรึกษาด้านการขยายทราฟฟิกให้ธุรกิจชั้นนำ",
                icon: GraduationCap
              },
              {
                title: "เครื่องมือ AI ในตัว",
                desc: "ระบบตรวจคุณภาพสุขภาพ On-Page และโปรแกรมสร้างรีวิวที่ช่วยเหลือด้วย AI ภาษาไทยล้ำหน้า",
                icon: Sparkles
              },
              {
                title: "เรียนจากเคสจริง",
                desc: "ลงมือปฏิบัติแก้ปัญหาผ่านตัวอย่างธุรกิจออฟไลน์ คลับ คาเฟ่ และร้านค้าบริการยอดนิยม",
                icon: BarChart3
              },
              {
                title: "คอมมูนิตี้ที่แอ็กทีฟ",
                desc: "เครือข่ายศิษย์เก่าใน Line / Discord เพื่อถามตอบร่วมคิดและแชร์ประเด็นเทคนิควิชาชีพ",
                icon: Users
              },
              {
                title: "ติดตามความก้าวหน้า",
                desc: "สนุกกับการเก็บคะแนนเรียนจำลองวิเคราะห์และไต่อันดับดวงเพื่อลุ้นรับใบประกาศฉับไว",
                icon: TrendingUp
              },
              {
                title: "อัปเดตตลอดชีพ",
                desc: "อัปเดตประเด็นโมเดลบทสนทนา Google Search Algorithm และนวัตกรรมใหม่ๆ ทันถ่วงที",
                icon: RefreshCw
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-normal">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Knowledge Base Section (Library of Rankings) */}
      <section className="py-20 bg-gray-50 relative border-t border-b border-gray-100/50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-emerald-100">
              <span>📚</span>
              <span>SEO 101 KNOWLEDGE PLATFORM</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              ห้องสมุดรวมสัจธรรมการไต่อันดับสากล
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              สลับแท็บความรู้ด้านล่างเพื่อศึกษาเจาะลึก SEO แบบดั้งเดิม, ระบบสรุปคำตอบด้วยปัญญาประดิษฐ์ AIO/GEO และคู่มือการผ่านเกณฑ์ Google Core Updates
            </p>
          </div>

          {/* Clean Rounded Tab Selection */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto bg-gray-100/60 p-1.5 rounded-full border border-gray-200">
            {[
              { id: "standard", label: "Classic Google SEO 🔍" },
              { id: "aio", label: "AI Overviews 🤖" },
              { id: "geo", label: "Generative Engine (GEO) 📡" },
              { id: "core", label: "Google Core Updates ☢️" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveKBTab(tab.id as any)}
                className={`py-2.5 px-5 text-sm font-semibold transition-all cursor-pointer rounded-full ${
                  activeKBTab === tab.id
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Tab Content Display */}
          <div className="bg-white border border-gray-100 p-6 sm:p-10 rounded-3xl max-w-4xl mx-auto shadow-md">
            <AnimatePresence mode="wait">
              {activeKBTab === "standard" && (
                <motion.div
                  key="standard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <span className="text-2xl">🔍</span>
                    <h3 className="text-xl font-bold text-gray-950">Classic Google SEO: เกณฑ์หลัก On-Page & Technical</h3>
                  </div>

                  <p className="text-gray-550 text-sm leading-relaxed">
                    การทำ SEO แบบพื้นฐานที่ยังใช้ได้ดีตลอดยุคสมัย คือการจัดการระบบนิเวศความสะอาดของบทความและสุขภาพหน้าเว็บ เพื่อให้ Googlebot สามารถสำรวจและดึงข้อมูลไปแสดงผลได้อย่างรวดเร็วและถูกต้อง
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <span className="text-xs text-emerald-600 font-bold tracking-wider block uppercase">🔑 สูตรลับ On-Page:</span>
                      <ul className="space-y-2 text-xs text-gray-600 font-medium list-disc list-inside">
                        <li>จำกัดให้มี 1 แท็ก H1 หลักแทนชื่อเรื่องบทความ</li>
                        <li>ใส่แอตทริบิวต์ Alt ให้แก่ภาพทุกภาพเพื่อบอกบอท</li>
                        <li>จัดระเบียบแผนที่หน้าเว็บ XML Sitemap และ robots.txt</li>
                      </ul>
                    </div>

                    <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <span className="text-xs text-emerald-600 font-bold tracking-wider block uppercase">⚙️ สูตรลับ Technical:</span>
                      <ul className="space-y-2 text-xs text-gray-600 font-medium list-disc list-inside">
                        <li>ทำหน้าเว็บให้แสดงผลระดับ Mobile-Friendly 100%</li>
                        <li>ทำคะแนนประสิทธิภาพใน Core Web Vitals (ลดขนาดภาพ)</li>
                        <li>ติดตั้งใบรับรองระบบความปลอดภัย HTTPS SSL ทั้งโดเมน</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-450 font-medium font-sans">
                      <span>ศึกษาและอ่านรายละเอียดเชิงเจาะลึกผ่านหน้าแลนดิ้งเพจเฉพาะทาง</span>
                    </div>
                    <Link
                      to="/ClassicSEO"
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1"
                    >
                      <span>learn more</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeKBTab === "aio" && (
                <motion.div
                  key="aio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-xl font-bold text-gray-950">Google AI Overviews (AIO): ยุคกล่องสรุปข้อมูลด้วยคำพูด</h3>
                  </div>

                  <p className="text-gray-550 text-sm leading-relaxed">
                    พฤติกรรมการค้นหาบางส่วนกำลังเปลี่ยนไป ผู้ใช้มักพอใจกับกล่องสรุป AI Overviews ที่วิเคราะห์และหยิบบทความมาอธิบายประเด็นสั้นๆ ดังนั้น หน้าที่ของเราคือปรับโครงสร้างเนื้อหาให้อ่านเข้าใจง่ายเพื่อให้ AI สามารถนำคำคมพาดหัวของเราไปใช้อ้างอิง
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <span className="text-xs text-emerald-600 font-bold tracking-wider block uppercase">🗣️ ประโยคสัญชาตญาณถาม-ตอบ:</span>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        ผู้บริโภคเปลี่ยนจากคำสั้น (Short-tail) มาเป็นประโยคสนทนารายละเอียดสูง เช่น "ร้านอาหารสุขภาพพญาไท เมนูแคลอรี่ต่ำ มีที่จอดรถ" เพื่อขอคำตอบจากบอท
                      </p>
                    </div>

                    <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <span className="text-xs text-emerald-600 font-bold tracking-wider block uppercase">📈 กลยุทธ์การเขียนบล็อก:</span>
                      <p className="text-xs text-gray-650 leading-relaxed font-medium">
                        จัดรูปแบบคำถามพาดหัว (FAQ Style) ฝังโครงสร้างตารางเปรียบเทียบข้อมูลสรุปที่เปิดใจและอิง Schema JSON-LD อย่างเป็นระเบียบสมบูรณ์
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-455 font-medium font-sans">
                      <span>สำรวจเทคนิคการครอบครองกล่องคำตอบ AI ดิจิทัลล่าสุด</span>
                    </div>
                    <Link
                      to="/AIOverviews"
                      className="px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeKBTab === "geo" && (
                <motion.div
                  key="geo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <span className="text-2xl">📡</span>
                    <h3 className="text-xl font-bold text-gray-950">Generative Engine Optimization (GEO): ราชาตัวจริงของคู่เทียบ AI</h3>
                  </div>

                  <p className="text-gray-550 text-sm leading-relaxed">
                    GEO คือกลยุทธ์การทำอันดับบน search engines ยุคใหม่เพื่อเชื่อมสปอตไลต์ของ Gemini, ChatGPT Search และ Perplexity โดยเน้นให้อุปกรณ์ดึงเนื้อหาของคุณไปใช้อ้างอิงเป็นเครดิตหลัก
                  </p>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                    <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block">
                      3 หลักการเอาชนะ GEO (Citations & Topical Structure):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-gray-650">
                      <div className="p-4 bg-white rounded-xl border border-gray-100">
                        <h5 className="font-bold text-gray-900 mb-1">1. Citation Density</h5>
                        <p className="text-[11px] text-gray-450 leading-relaxed">มีข้อมูลตัวเลขอิงสถิติมูลค่าความมั่นคง แหล่งงานวิจัย หรือเอกสารข้อมูลสากลชัดเจน</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-100">
                        <h5 className="font-bold text-gray-900 mb-1">2. Topical Authority</h5>
                        <p className="text-[11px] text-gray-450 leading-relaxed">เขียนรายละเอียดหัวข้อนั้นๆ ครอบคลุมรอบด้าน แสดงทักษะความรู้เชิงลีกพิเศษ</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-100">
                        <h5 className="font-bold text-gray-900 mb-1">3. Direct Quotes</h5>
                        <p className="text-[11px] text-gray-450 leading-relaxed">ฝังประเด็นคำให้สัมภาษณ์ บทสนทนา หรือแนวทางประเมินผลจากแพทย์/ผู้มีชื่อเสียงจริงในเรื่องนั้นๆ</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-455 font-medium font-sans">
                      <span>เจาะลึกวิธีการจัดอันดับและ citations ในฝั่ง Generative Search บอท</span>
                    </div>
                    <Link
                      to="/GenerativeEngine"
                      className="px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeKBTab === "core" && (
                <motion.div
                  key="core"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-2 text-rose-600">
                    <span className="text-2xl">☢️</span>
                    <h3 className="text-xl font-bold text-rose-950">Google Core Updates: เกราะป้องกัน Helpful Content Update</h3>
                  </div>

                  <p className="text-gray-550 text-sm leading-relaxed">
                    อัลกอริทึมของกูเกิลปรับแผนสยบลดน้ำหนักบล็อกปั้นด้วย AI ป้อนพิกัดบทความซ้ำซ้อนไร้คุณภาพอย่างหนักหน่วง ดังนั้น วิธีรับมือเดียวให้รอดพ้นอย่างถาวรคือวิถี E-E-A-T ของ Google
                  </p>

                  <div className="bg-rose-50 border border-rose-100/60 p-5 rounded-2xl text-rose-950 space-y-3">
                    <span className="text-xs text-rose-800 font-bold uppercase tracking-wide flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>หลักเกณฑ์ E-E-A-T สากล:</span>
                    </span>
                    <p className="text-xs text-rose-900 leading-relaxed font-medium">
                      สร้างสรรค์เนื้อหาให้สอดคล้องกับ <span className="font-bold">Experience (ประสบการณ์ตรง)</span>, <span className="font-bold">Expertise (ความน่าเชื่อถือวิทยาชีพ)</span>, <span className="font-bold">Authoritativeness (ความทระนงและอิงลิงก์ส่งเสริม)</span>, และ <span className="font-bold">Trustworthiness (ความปลอดภัยไร้สแปม)</span> เพื่อแสดงเจตนาจริงและมอบคลิกวิถีบริสุทธิ์
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-gray-455 font-medium font-sans">
                      <span>ป้องกันเว็บไซต์ร่วงและเสริมเกราะความน่าเชื่อถือวิทยาชีพสูงสุด</span>
                    </div>
                    <Link
                      to="/CoreUpdates"
                      className="px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Pricing / Course Packages Section */}
      <section className="py-20 bg-white relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">เลือกคอร์สที่ใช่สำหรับคุณ</h2>
            <p className="text-gray-500 text-sm font-medium">ทุกคอร์สเรียนได้ตลอดชีพ พร้อมอัปเดตเนื้อหาฟรี</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {courses.map((course) => (
              <div 
                key={course.id}
                className={`flex flex-col justify-between p-8 rounded-3xl transition-all duration-200 bg-white relative ${
                  course.isPrimary 
                    ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/10" 
                    : "border border-gray-150 shadow-sm"
                }`}
              >
                <div>
                  {course.tag && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-semibold text-[11px] px-4 py-1 rounded-full uppercase tracking-wider block shadow-sm">
                      {course.tag}
                    </span>
                  )}
                  
                  <span className="text-[10px] font-extrabold text-emerald-600 tracking-widest block uppercase mt-2">
                    {course.badge}
                  </span>
                  
                  <h3 className="text-2xl font-extrabold text-gray-950 mt-2 leading-snug">{course.title}</h3>
                  <p className="text-xs text-gray-500 mt-2.5 leading-relaxed font-normal min-h-[48px]">{course.description}</p>
                  
                  <div className="my-6 border-t border-b border-gray-100 py-4 block">
                    <span className="text-4xl font-extrabold text-gray-950 tracking-tight">{course.price}</span>
                    <span className="text-xs font-medium text-gray-400 block mt-1.5">{course.period}</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 font-normal">
                    {course.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-tight text-gray-650">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => {
                      const regBtn = document.getElementById("btn-register-navbar");
                      if (regBtn) {
                        regBtn.click();
                      } else {
                        const contactSec = document.getElementById("contact-section-lead");
                        contactSec?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`w-full py-3 px-4 font-semibold rounded-full text-sm text-center cursor-pointer transition-all ${
                      course.isPrimary 
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg" 
                        : "bg-white hover:bg-gray-55 border border-gray-200 text-gray-700"
                    }`}
                  >
                    {course.btnText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Core includes strip */}
          <div className="mt-12 p-6 bg-gray-50 border border-gray-100/60 rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 text-center md:text-left">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center justify-center md:justify-start space-x-1.5">
                <span>🏆 ทุกแพลตฟอร์ม/คอร์ส รวมข้อมูลเหล่านี้ครบถ้วน:</span>
              </h4>
              <p className="text-xs text-gray-450 leading-relaxed font-normal">
                เราจัดสรรคู่มือออปติไมซ์ แผนคำตอบสำหรับบอทสากล และวีดีโอทบทวนย้อนหลังแบบไม่มีกัก
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-semibold text-gray-700 shrink-0">
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>วีดีโอบรรยายย้อนหลังตลอดอายุ</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>คู่มือ On-Page Checklists</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>เทมเพลตโครงสร้าง Schema JSON</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>อัปเดตและเข้ารุ่นปี 2026 ฟรี</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials (เสียงจากผู้เรียนจริง) */}
      <section className="py-20 bg-gray-50 border-t border-gray-100/60">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">เสียงจากผู้เรียนจริง</h2>
            <p className="text-gray-500 text-sm font-medium">ผู้เรียนกว่า 12,000 คนเปลี่ยนธุรกิจของพวกเขาด้วย SEO</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "\"หลังเรียนคอร์สขั้นสูง เว็บร้านเราขึ้นหน้าแรก Google ในคีย์เวิร์ดหลักภายใน 3 เดือน ยอดคลิกธรรมชาติโตขึ้นกว่าเท่าตัว ประหยัดงบค่าคลิกโฆษณาทรายวายมูลค่ามากค่ะ\"",
                name: "ณิชิชา ศรีสุข",
                title: "เจ้าของร้านค้าออนไลน์ชั้นนำและคาเฟ่พญาไท",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120"
              },
              {
                text: "\"เครื่องมือวิเคราะห์ AI ช่วยประหยัดเวลาที่เราไปทำรายงานประเมินผลบอทและชี้จุดผิดพลาดได้ละเอียดตรงจุด คุ้มราคาค่าสมัครคอร์สมากครับ\"",
                name: "ธนกฤต วงศ์เจริญ",
                title: "Digital Marketing Manager Enterprise",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120"
              },
              {
                text: "\"ชอบที่เกมจำลองฝึกทักษะสอนวิธีทำและให้คำอธิบายที่ช่วยให้คนไม่มีความรู้โค้ดเข้าถึงคีย์เวิร์ดทำเงินได้ง่ายและสนุก ไม่น่าเบื่อเหมือนตำราย่อยทั่วไปเลยค่ะ\"",
                name: "พิมพชนก อินทร์แก้ว",
                title: "ฟรีแลนซ์ Content Creator",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
              }
            ].map((testi, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow transition-shadow relative">
                <div className="flex space-x-1.5 text-emerald-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4.5 h-4.5 fill-emerald-500 text-emerald-500 animate-none" />)}
                </div>
                <p className="text-sm text-gray-650 italic leading-relaxed font-normal min-h-[96px]">
                  {testi.text}
                </p>
                <div className="flex items-center space-x-3.5 pt-4 border-t border-gray-50">
                  <img src={testi.image} alt={testi.name} className="w-11 h-11 rounded-full object-cover shadow-sm bg-gray-50 border border-gray-100" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{testi.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">{testi.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordions Section */}
      <section className="py-20 bg-white border-t border-gray-55">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">คำถามที่พบบ่อย</h2>
            <p className="text-gray-500 text-sm font-medium">ยังมีข้อสงสัย? ดูคำตอบด้านล่าง หรือทักหาเราได้เลย</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const rActive = activeFaq === index;
              return (
                <div key={index} className="border border-gray-150 rounded-2xl overflow-hidden bg-white hover:border-gray-300 transition-all">
                  <button
                    onClick={() => setActiveFaq(rActive ? null : index)}
                    className="w-full px-6 py-4.5 text-left font-bold text-gray-900 hover:text-emerald-600 hover:bg-gray-50/50 flex justify-between items-center transition-all cursor-pointer"
                  >
                    <span className="text-sm sm:text-base pr-4 leading-snug">{faq.q}</span>
                    <span className="text-xl text-emerald-500 font-semibold">{rActive ? "−" : "+"}</span>
                  </button>

                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      rActive ? "max-h-60 border-t border-gray-100/60" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 text-gray-500 text-sm leading-relaxed bg-gray-50/40 font-normal">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lead Generation & Registration Form */}
      <section id="contact-section-lead" className="py-20 bg-gray-50 border-t border-gray-100 relative">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left section details */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
                ลงทะเบียนเรียน SEO วันนี้
              </h2>
              <p className="text-gray-500 text-base leading-relaxed">
                กรอกข้อมูลด้านล่าง ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมง เพื่อแนะนำคอร์สที่เหมาะกับเป้าหมายของคุณที่สุด
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3 text-sm text-gray-750 font-medium">
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>ปรึกษาฟรีกับที่ปรึกษา ไม่บังคับลงเรียน</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-750 font-medium">
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>รับสิทธิ์ทดลองเครื่องมือ AI 7 วัน</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-750 font-medium">
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>รับประกันความพึงพอใจ คืนเงินภายใน 14 วัน</span>
                </div>
              </div>
            </div>

            {/* Right section form card */}
            <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[24px] p-6 sm:p-8 shadow-lg text-gray-900">
              {formSubmitted ? (
                <div className="text-center py-10 bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6 space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-650 mx-auto" />
                  <h3 className="text-xl font-bold">ทีมงานได้รับข้อมูลคอร์สเรียนแล้ว!</h3>
                  <p className="text-sm text-gray-500">กรุณารอการติดต่อกลับจากผู้เชี่ยวชาญด้านอันดับทางเบอร์สอบถามหรือไลน์คุณครู</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">ชื่อ-นามสกุล / แบรนด์ของคุณ</label>
                    <input
                      type="text"
                      required
                      placeholder="กรอกชื่อของคุณ"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-semibold block mb-1">ที่อยู่อีเมล</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 font-semibold block mb-1">เบอร์โทรศัพท์</label>
                      <input
                        type="tel"
                        required
                        placeholder="08X-XXX-XXXX"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">คอร์สที่สนใจ</label>
                    <select
                      value={contactForm.topic}
                      onChange={(e) => setContactForm({...contactForm, topic: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium"
                    >
                      <option value="เรียนรู้คอร์สพื้นฐาน">เลือกคอร์ส...</option>
                      <option value="เรียนรู้คอร์สเริ่มต้น">SEO เริ่มต้น (Beginner) - ฿2,900</option>
                      <option value="สมัครเรียนคอร์สเอสเอ็มอี">SEO ขั้นสูง (Advanced) - ฿6,900</option>
                      <option value="โปรเจกตบริษัทพาร์ทเนอร์">องค์กร (Corporate Custom) - ติดต่อเรา</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1">ข้อความเพิ่มเติม</label>
                    <textarea
                      rows={3}
                      placeholder="บอกเล่าเป้าหมายหรือความท้าทายเกี่ยวกับเว็บหรือเป้าหมายธุรกิจของคุณ..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 font-medium"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full flex items-center justify-center space-x-2 shadow-sm pointer-events-auto cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>ลงทะเบียน</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer Area */}
      <footer className="bg-white border-t border-gray-100 py-16 relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Column 1 Logo */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="border border-emerald-500 text-emerald-600 bg-emerald-50/50 px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold tracking-wider">
                  SEO
                </div>
                <span className="font-sans font-bold text-gray-950 text-lg tracking-tight">
                  Academy
                </span>
              </div>
              <p className="text-xs text-gray-450 leading-relaxed font-normal">
                แพลตฟอร์มเรียนรู้ SEO ภาษาไทยแบบครบวงจร ตั้งแต่ระดับเริ่มต้นจนถึงวิเคราะห์ด้วย AI ที่จะทำให้คุณเห็นผลลัพธ์ที่ยั่งยืนจริง
              </p>
              {/* Simple subtle social buttons */}
              <div className="flex space-x-3 pt-1">
                <span className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-500 cursor-pointer text-xs">🌐</span>
                <span className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-500 cursor-pointer text-xs">💬</span>
                <span className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-500 cursor-pointer text-xs">✉️</span>
              </div>
            </div>
            
            {/* Column 2 Learning lists */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 tracking-widest uppercase mb-4">เรียนรู้</h4>
              <ul className="space-y-2 text-xs text-gray-500 font-medium">
                <li><Link to="/SEOTools" className="hover:text-emerald-600 transition-colors">คอร์สเรียน SEO</Link></li>
                <li><Link to="/Blog" className="hover:text-emerald-600 transition-colors">บทความ</Link></li>
                <li><Link to="/Games" className="hover:text-emerald-600 transition-colors">เกมฝึกทักษะ</Link></li>
                <li><a href="#contact-section-lead" className="hover:text-emerald-600 transition-colors">คำถามที่พบบ่อย</a></li>
              </ul>
            </div>

            {/* Column 3 Tools lists */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 tracking-widest uppercase mb-4">เครื่องมือ</h4>
              <ul className="space-y-2 text-xs text-gray-500 font-medium">
                <li><Link to="/SEOTools" className="hover:text-emerald-600 transition-colors">วิเคราะห์เว็บไซต์ AI</Link></li>
                <li><Link to="/GmbTools" className="hover:text-emerald-600 transition-colors">เครื่องมือ GMB</Link></li>
                <li><Link to="/SEOTools" className="hover:text-emerald-600 transition-colors">เช็คลิสต์ On-Page</Link></li>
                <li><Link to="/SEOTools" className="hover:text-emerald-600 transition-colors">Meta Tag Checker</Link></li>
              </ul>
            </div>

            {/* Column 4 Company lists */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 tracking-widest uppercase mb-4">บริษัท</h4>
              <ul className="space-y-2 text-xs text-gray-500 font-medium">
                <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">เกี่ยวกับเรา</span></li>
                <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">รีวิวจากผู้เรียน</span></li>
                <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">ติดต่อเรา</span></li>
                <li><span className="hover:text-emerald-600 cursor-pointer transition-colors">ร่วมงานกับเรา</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4 font-normal">
            <span>© 2026 SEO Academy. สงวนลิขสิทธิ์</span>
            <div className="flex space-x-6">
              <span className="hover:text-gray-900 transition-colors cursor-pointer">นโยบายความเป็นส่วนตัว</span>
              <span className="hover:text-gray-900 transition-colors cursor-pointer">เงื่อนไขการใช้งาน</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
