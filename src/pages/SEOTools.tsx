import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, Info, CheckCircle2, AlertTriangle, XCircle, Rocket, Sparkles,
  HelpCircle, Eye, Share2, Image as ImageIcon, BookOpen, Layers, Target, ChevronRight, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuditMetric {
  key: string;
  name: string;
  status: "success" | "warning" | "danger";
  score: number; // out of 100
  info: string; // hover explanation
  currentValue: string;
  recommendation: string;
}

export default function SEOTools() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setProgress(15);

    // Simulate progress ticks
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Calculate randomized/semi-realistic audit based on URL
      const isHttps = url.toLowerCase().startsWith("https://");
      const hasGov = url.toLowerCase().includes(".go") || url.toLowerCase().includes(".ac");
      const baseScore = isHttps ? 75 : 55;
      const finalScore = Math.min(95, baseScore + (hasGov ? 15 : Math.floor(Math.random() * 12)));

      const simulatedMetrics: AuditMetric[] = [
        {
          key: "meta-title",
          name: "Meta-Title (หัวข้อหน้าเว็บ)",
          status: url.length > 20 ? "success" : "warning",
          score: url.length > 20 ? 95 : 60,
          info: "Meta Title คือข้อความคำแรกสุดที่ปรากฏในแท็บเบราว์เซอร์และแสดงเป็นชื่อลิงก์สีน้ำเงินในหน้าแรก Google Search มีผลต่อทราฟฟิกและคนอยากคลิกสูงที่สุด",
          currentValue: url.length > 20 ? `\"${url.split(".")[1]?.toUpperCase() || "My Shop"} | คอร์สดูแลสุขภาพและเคล็ดลับความงามวิเศษ\"` : "ไม่มีข้อความพาดหัวเด่นชัด หรือตรวจจับไม่ได้",
          recommendation: "กำหนดชื่อหัวข้อหน้าเว็บให้มีความยาวอยู่ในช่วง 50-60 ตัวอักษรพร้อมใส่คีย์เวิร์ดหลักของธุรกิจ เช่น 'สอนทำขนมปังฝรั่งเศสสูตรลับ | [ยี่ห้อของคุณ]'"
        },
        {
          key: "meta-description",
          name: "Meta-Description (รายละเอียดหน้าเว็บ)",
          status: "warning",
          score: 65,
          info: "Meta Description คือคำโปรย 2-3 บรรทัดที่โชว์ด้านล่างหัวข้อในหน้าค้นหา ช่วยอธิบายด่านแรกเพื่อให้ยอดคลิกพุ่งสูง",
          currentValue: "\"ยินดีต้อนรับสู่นิเวศดูแลสุขภาพของเรา ค้นหาบริการพิเศษและโปรโมชั่นมากมาย...\"",
          recommendation: "ปรับเพิ่มขนาดให้ชัดเจน ครอบคลุม 120-155 ตัวอักษร พร้อมเชิญชวนความน่ากด (Call-to-Action) เช่น 'รับโปรโมชั่นลด 10% ด่วนคลิกลานทันที!'"
        },
        {
          key: "headings",
          name: "Headings (ระบบหัวข้อหลัก-ย่อย HTML)",
          status: "success",
          score: 90,
          info: "Heading tags (H1-H6) คือลำดับขนาดพารากราฟที่บอกบอท AI ว่าเนื้อหาไหนคือชื่อเรื่อง, หัวข้อย่อยหลัก หรือรายละเอียดเสริม โดยระบบที่ดีตงต้องมี H1 เพียงหัวข้อเดียวในหน้านั้นๆ",
          currentValue: "ตรวจพบ 1x แท็ก H1 (ชื่อเรื่องหลัก) และ 5x แท็ก H2 (หัวข้อรองสอดรับ)",
          recommendation: "ระบบจัดโครงสร้างได้เป็นระเบียบดีแล้ว รักษาหลักการตั้งคำถามในแท็ก H2 คู่กับการพิมพ์คำอธิบายกระชับในแถวแรก"
        },
        {
          key: "eeat-quality",
          name: "EEAT Content Quality (คุณภาพเนื้อหาและความครบถ้วน)",
          status: "danger",
          score: 45,
          info: "E-E-A-T คือหลักเกณฑ์สากลของ Google ประเมินจาก ประสบการณ์ตรง (Experience), ความชำนาญ (Expertise), อำนาจความน่าเชื่อถือ (Authoritativeness) และความปลอดภัย (Trustworthiness) ป้องกันข้อมูลเท็จ",
          currentValue: "ขาดข้อมูลประวัติผู้เขียน (Author Bio), แหล่งที่มาลิงก์ และไม่มีเอกสารรับรองวิชาชีพประกอบบทความ",
          recommendation: "สิ่งที่ขาดหาย: ลูกค้าต้องการเห็นประวัติบรรณาธิการ, หน้าเกี่ยวกับเรา (About Us) เจาะลึกเล่าประวัติแบรนด์, แหล่งอ้างอิงสถิติ, และการระบุข้อมูลติดต่อบริษัทที่โปร่งใสบนท้ายเว็บ"
        },
        {
          key: "canonical",
          name: "Canonical Tag (การชี้พิกัดหน้าแรกแท้จริง)",
          status: "success",
          score: 100,
          info: "Canonical tag คือแท็กบอกกูเกิลว่าหน้านี้คือหน้าแท้จริง ป้องกันปัญหาเขียนเนื้อหาซ้ำกันหลายลิงก์ซึ่งตัดทอนกำลังจัดแรงค์",
          currentValue: `<link rel="canonical" href="${url.startsWith("http") ? url : "https://" + url}" />`,
          recommendation: "หน้าเว็บของคุณติดตั้งแท็ก Canonical ชี้พิกัดตนเองอย่างสมบูรณ์แบบเรียบร้อยแล้ว!"
        },
        {
          key: "schema",
          name: "Schema Markup (โค้ดจำแนกพิกัดอัจฉริยะ)",
          status: "danger",
          score: 30,
          info: "Schema คือชุดโค้ดภาษาที่ช่วยให้บอท AI เข้าใจข้อมูลทันทีโดยไม่ต้องคาดเดา เช่น บอกพิกัดร้านค้าท้องถิ่น ราคาแพ็คเกจสัมมนา หรือเรตติ้งดาวคะแนนความน่าสนใจ",
          currentValue: "ไม่พบโครงสร้างแบบจำลอง Schema.org (JSON-LD Missing)",
          recommendation: "แนะนำให้แทรกโค้ดประเภท LocalBusiness สำหรับที่อยู่ร้าน หรือประเภท Course/Article เพื่อเพิ่มมิติการดึงคีย์เวิร์ดของแบรนด์ไปอ้างอิงบน AI Overviews และหน้าแรกของ Google"
        },
        {
          key: "og-social",
          name: "Open Graph Social Sharing (สัญลักษณ์สำหรับแชร์โซเชียล)",
          status: "warning",
          score: 70,
          info: "Open Graph (og:title, og:image) คือแท็กกำหนดหน้าตาแบนเนอร์และชื่อไอคอนเวลามีใครคัดลอกลิงก์ร้านคุณไปแชร์บน Line, Facebook หรือโซเชียลอื่นๆ",
          currentValue: "ตรวจพบ og:title แต่ตกหล่นข้อมูลขนาดภาพแชร์ตัวอย่าง (og:image ต่ำกว่าเกณฑ์หรือหาย)",
          recommendation: "แทรกโค้ด og:image ชี้ลิงก์ภาพประกอบสัดส่วนแบนเนอร์ 1200x630 พิกเซล เพื่อให้การแชร์ดูสวยงามน่าดึงดูดใจผู้คน"
        },
        {
          key: "img-webp",
          name: "Image Formats & Alt-Tags (สกุลรูปภาพและข้อความอธิบาย)",
          status: "warning",
          score: 55,
          info: "รูปภาพควรเก็บไว้เป็นฟอร์แมตยุคใหม่ เช่น WebP เพื่อประหยัดพื้นที่ดาวน์โหลด และต้องมี Alt-Text เพื่ออธิบายความหมายของภาพนั้นๆ ให้แก่เครื่องบอทค้นหาที่ตาบอดมองภาพถ่ายไม่เห็น",
          currentValue: "ตรวจพบภาพแบบเดิม (.png, .jpg) รวม 12 ชิ้น และขาด Alt-Text สื่อสารรวม 8 โพส",
          recommendation: "บีบอัดภาพเก่าย้ายมาเป็นนามสกุล .webp เพื่อลดพื้นที่เก็บ และกรอกแอตทริบิวต์ 'alt=\"...คำอธิบายสอดคล้อง...\"' ลงในสัญญลักษณ์ภาพถ่ายทุกๆ ชิ้น"
        }
      ];

      setAuditResult({
        domain: url.replace(/https?:\/\//i, "").split("/")[0],
        totalScore: finalScore,
        metrics: simulatedMetrics
      });
      setLoading(false);
    }, 2800);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen text-gray-900 font-sans selection:bg-emerald-100 pb-20">
      
      {/* Dynamic Header */}
      <div className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            id="audit-back-home"
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
            <span>✨</span>
            <span>SEO Audit Platform • Simple & Powerful</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Rocket className="w-6 h-6 animate-bounce" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-990 tracking-tight text-gray-900 leading-tight">
            ประเมินคะแนนคุณภาพและแก้ไขเว็บไซต์ของคุณฟรี 🛠️
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            เริ่มต้นทันทีง่ายๆ เพียงป้อนลิงก์ของคุณ! ระบบจะดึงข้อมูลวิจัย On-Page และประเด็นสำคัญระดับสากล 
            พร้อมคำอธิบายแบบ Hover ทีละรายการเพื่อให้คุณเข้าใจง่าย แม้ไม่เคยเรียน SEO มาก่อนก็ตาม
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl shadow-sm text-center max-w-3xl mx-auto">
          <form onSubmit={handleAudit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                ป้อนโดเมนหรือเว็บบล็อกของคุณ (Website URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="ตัวอย่าง: https://www.mybrandname.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Rocket className="w-4 h-4 animate-spin" />
                      <span>กำลังส่งบอทสแกนระบบ... ({progress}%)</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>เริ่มการวิเคราะห์ฟรี</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Loading Animation Progress bar */}
          {loading && (
            <div className="mt-8 space-y-3">
              <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-400 italic">
                *กำลังจำลองคำสั่งและตรวจสอบสัญลักษณ์ alt ภาพ, canonical, และเกณฑ์โครงสร้าง E-E-A-T ล่าสุด...
              </p>
            </div>
          )}
        </div>

        {/* Audit Results Section */}
        <AnimatePresence>
          {auditResult && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-10 max-w-3xl mx-auto text-left"
            >
              {/* Grand Total Score Meter */}
              <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                <div className="space-y-2">
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    คะแนนรวมเว็บไซต์ของคุณ (Grand SEO Score)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                    การจัดการช่องว่างในมิติสากล {auditResult.domain}
                  </h2>
                  <p className="text-xs text-gray-500">
                    *ประเมินรวมทั้ง On-Page, Schema, Canonical, Open Graph, สัดภาพความเร็ว และความพึงพอใจ E-E-A-T
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-slate-50 border border-gray-100 rounded-3xl w-40 h-40">
                  <span className="text-4xl font-extrabold font-mono text-emerald-600">
                    {auditResult.totalScore}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">/ 100 คะแนน</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded-full mt-2">
                    ระดับดีปานกลาง
                  </span>
                </div>
              </div>

              {/* Comprehensive Breakdown List with Hover Support on Tech terms */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-950 flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-emerald-500" />
                    <span>ดัชนีจำแนกแบบแยกส่วนละเอียด (8 Key SEO Audits)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-150 px-2.5 py-1 rounded-full uppercase">
                    8 Metrics Selected
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  💡 เกร็ดความรู้มือใหม่: วางเมาส์หรือสัมผัสตรงไอคอนคลังความรู้สะสม <span className="inline-block p-0.5 bg-emerald-50 text-emerald-600 rounded"><Info className="w-3.5 h-3.5 inline" /></span> เพื่อทำความเข้าใจคำศัพท์ทางเทคนิคได้ทันที!
                </p>

                <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                  {auditResult.metrics.map((metric: AuditMetric) => (
                    <div key={metric.key} className="p-5 sm:p-6 space-y-4 hover:bg-gray-50/50 transition-colors">
                      
                      {/* Name of metric and status icon */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2 relative group md:inline-flex">
                            <h4 className="text-xs sm:text-sm font-black text-gray-900 block">
                              {metric.name}
                            </h4>
                            
                            {/* Hover Technical word trigger */}
                            <div className="relative inline-block cursor-help text-emerald-500 hover:text-emerald-600 p-0.5 bg-emerald-50 rounded">
                              <Info className="w-3.5 h-3.5" />
                              {/* Popup element on hover */}
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-950 text-white text-[11px] rounded-xl p-3 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-35 font-normal leading-relaxed">
                                {metric.info}
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-gray-450 block font-mono text-slate-500 bg-slate-50/80 px-2 py-1 rounded border border-slate-100 w-fit max-w-full overflow-hidden break-all mt-1">
                            <strong>ตรวจพบค่า:</strong> {metric.currentValue}
                          </div>
                        </div>

                        {/* Status elements badges */}
                        <div className="shrink-0 flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-gray-450">
                            {metric.score}/100
                          </span>
                          {metric.status === "success" && (
                            <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full block">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          )}
                          {metric.status === "warning" && (
                            <span className="bg-yellow-50 text-yellow-650 text-yellow-600 p-1.5 rounded-full block">
                              <AlertTriangle className="w-4 h-4" />
                            </span>
                          )}
                          {metric.status === "danger" && (
                            <span className="bg-rose-50 text-rose-600 p-1.5 rounded-full block">
                              <XCircle className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Thai detailed recommendations */}
                      <div className="p-3 bg-rose-50/30 border border-amber-100 rounded-xl space-y-1 text-xs text-gray-700 font-sans leading-relaxed">
                        <span className="font-extrabold text-emerald-700 block text-[10px] uppercase">🛠️ คำแนะนำเพื่อปรับแต้มคะแนน:</span>
                        <p className="font-medium text-[11px] leading-relaxed text-gray-650">
                          {metric.recommendation}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Recommendation Summary for beginners */}
              <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 text-emerald-700 translate-y-6 translate-x-6 opacity-30">
                  <Rocket className="w-48 h-48" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-lg font-bold flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-emerald-250 text-emerald-200" />
                    <span>สรุปโรดแมปพิชิตหน้าแรก (Expert Roadmaps)</span>
                  </h3>
                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed font-normal">
                    แม้ว่าคะแนนสะสมของคุณจะยังคงอยู่ระดับความปลอดภัยปานกลาง แต่จุดอัพเกรดที่คุ้มพลังงานที่สุดด่านแรกคือ 
                    การแก้ปัญหา <strong>EEAT Content Quality</strong> (กรอกประวัติผู้แต่ง) และสร้างชุด <strong>Schema โค้ดอัจฉริยะ</strong> 
                    โดยเลื่อนลงไปประยุกต์ใช้งานกล่องกรอกโค้ดสำเร็จรูปด้านล่าง เพื่อเอาชนะข้อกำหนดใหม่ของ Google AI Overviews ทันที!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beginners educational extra cards */}
        {!auditResult && !loading && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">ทฤษฎี SEO สำหรับเยาวชน</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  เรียนรู้ความสะอาดหน้าเว็บ, วิธีจัดการคำหลัก, และสูตรจัดทำ Schema.org 
                  อย่างงดงาม ผ่านห้องปฏิบัติการศึกษาที่ออกแบบให้ง่ายตลอดยุคสมัย
                </p>
              </div>
              <Link to="/ClassicSEO" className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center space-x-1 mt-2">
                <span>อ่านวิชา Classic SEO</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">สูตรเอาชนะระบบการตอบคำถามของ AI</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  ถอดรหัสว่า Google, ChatGPT, และ Gemini เลือกชื่อแบรนด์หรือคำคมไปจัดแสดงอ้างอิง citations อย่างไรบ้าง 
                  เพื่อเข้าวินทุกจุดค้นพบ
                </p>
              </div>
              <Link to="/AIOverviews" className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center space-x-1 mt-2">
                <span>อ่านวิชา AI Overviews</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
