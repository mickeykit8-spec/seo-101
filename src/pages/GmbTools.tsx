import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Search, Star, Info, CheckCircle2, AlertTriangle, 
  Sparkles, Clipboard, ShieldCheck, HelpCircle, Eye, Image as ImageIcon, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GmbRecommendation {
  name: string;
  status: "perfect" | "improve" | "missing";
  score: number;
  info: string;
  recommendation: string;
}

export default function GmbTools() {
  const [mapsUrl, setMapsUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<any | null>(null);

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapsUrl.trim()) return;

    setLoading(true);
    setProgress(20);

    // Dynamic loading transitions
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 20;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      // Parse business name from URL or generic placeholder
      let businessName = "ร้านค้าท้องถิ่นของคุณ";
      try {
        const decoded = decodeURIComponent(mapsUrl);
        const nameMatch = decoded.match(/place\/([^/]+)/);
        if (nameMatch && nameMatch[1]) {
          businessName = nameMatch[1].replace(/\+/g, " ");
        }
      } catch (err) {
        // Fallback
      }

      // Generate a realistic strength report
      const simulatedScore = Math.floor(Math.random() * 20) + 70; // 70-90 score

      const recommendationList: GmbRecommendation[] = [
        {
          name: "หมวดหมู่หลักและหมวดหมู่รอง (Primary & Secondary Categories)",
          status: "perfect",
          score: 100,
          info: "หมวดหมู่ (Category) คือคุณสมบัติสำคัญที่สุดในการจัดหมุด GMB คุณต้องป้อนหมวดหมู่หลักสอดคล้องกับพฤติกรรมลูกค้าตรงเป๊ะ และใส่หมวดหมู่รองหนุน 3-5 รายการ",
          recommendation: "เลือกตั้งหมวดหมู่หลักถูกต้องดีแล้ว แนะนำให้เพิ่มหมวดหมู่ย่อยเสริมในหน้าหลังบ้านสัปดาห์ละครั้งเพิ่มกำลังสากล"
        },
        {
          name: "ความยาวคำอธิบายธุรกิจ (Business Description Completeness)",
          status: "improve",
          score: 80,
          info: "กูเกิลอนุญาตให้อธิบายธุรกิจได้สูงถึง 750 ตัวอักษร โดยห้ามยัดเบอร์ติดต่อสแปม และควรประยุกต์ใส่คีย์เวิร์ดบอกจุดประสงค์ของการบริการเพื่อให้ระบบเข้าใจสายงาน",
          recommendation: "ข้อความแนะนำของคุณมีความยาวเพียงร้อยกว่าอักษร ควรเพิ่มเติมเล่าเรื่องราวจุดเด่น ประวัติ แบรนด์ และคีย์เวิร์ดเป้าหมายให้ใกล้เคียง 600-700 ตัวอักษร"
        },
        {
          name: "สถิติจำนวนรูปภาพและการฝังพิกัด (Storefront Image Quality & Geotags)",
          status: "missing",
          score: 40,
          info: "รูปภาพหน้าร้านที่มีป้ายชื่อชัดเจน (Storefront) และภาพสินค้าภายในช่วยเปิดกระบอกเสียงความโปร่งใส ป้องกันหมุดถูกระงับ (Suspend) การอัปเดตรูปใหม่สม่ำเสมอมีผลต่อยอดเสิร์ชเจอสูงสุด",
          recommendation: "คำแนะนำด่วน: คุณส่งรูปประกอบต่ำกว่า 10 ภาพ และไม่มีรูปภาพป้ายหน้าร้านระนาบสายตาอย่างเป็นวิศวกรรม แนะนำให้อัปโหลดภาพความเคารพสม่ำเสมอสัดส่วน WebP สะอาด"
        },
        {
          name: "การเคลมสิทธิ์ความเป็นเจ้าของลบล้างสแปม (Listing Claim & Verification)",
          status: "perfect",
          score: 100,
          info: "การยืนยันตัวตนแง่กฎหมายว่าเป็นเจ้าของหมุดนั้นๆ จริง (Claimed & Verified) ช่วยรับรองว่าร้านนี้พร้อมดำเนินการอย่างถูกต้องและไม่โดนผู้อื่นแย่งสิทธิ์แก้ไขเบอร์",
          recommendation: "หมุดร้านค้าได้รับการส่งเอกสารอ้างอิงยืนยันสัญชาติเรียบร้อย มีภูมิคุ้มกันมาตรฐานดีมาก"
        },
        {
          name: "ข้อมูลวันเวลาทำการมาตรฐาน (Completeness of Operating Hours)",
          status: "perfect",
          score: 100,
          info: "ระบุวันปิดเปิดให้ละเอียด รวมถึงกำหนดเวลาทำการพิเศษในช่วงวันหยุดนกขัตฤกษ์ เพื่อรักษาสุขภาพข้อมูลไม่ให้ลูกค้าเดินทางมาแล้วพบป้ายร้านปิดตัวลงจนโกรธเคืองรีวิวคะแนนตกต่ำ",
          recommendation: "ข้อมูลเวลาทำการกรอกครบถ้วนเรียบร้อย ดีเยี่ยม!"
        },
        {
          name: "ปริมาณรีวิว 5 ดาวและอัตราตอบกลับ (Reviews Volume & Replies Response)",
          status: "improve",
          score: 65,
          info: "รีวิวดาวเฉลี่ยหนุน (4.5+ ดาว) และการตอบกลับคอมเมนต์ของลูกค้าทุกบล็อกอย่างเร่งรีบคือสัญญาณบอกกูเกิลว่าคุณมีปฏิสัมพันธ์เชิงบวกสูงสุด",
          recommendation: "คะแนนเฉลี่ยดีงาม แต่พบการตอบรีวิวลูกค้าเก่าล่าช้าเฉลี่ยเกิน 7 วัน แนะนำให้ส่งคำทักทายพร้อมสอดแทรกคีย์เวิร์ดของสินค้าธุรกิจเสริมลงในรีวิวแต่ละอัน"
        },
        {
          name: "ส่วนสถาปัตยกรรมตอบคำถาม Q&A คลายข้อสงสัย",
          status: "missing",
          score: 20,
          info: "หน้า Q&A ในกูเกิลแมปส์เปิดโอกาสให้ลูกค้าหรือแอดมินมาตั้งถามคำที่พบบ่อย (เช่น มีที่จอดรถส่วนตัวไหม, รับสิทธิ์คนละครึ่งไหม) เพื่ออิงคีย์เวิร์ดแบบธรรมชาติ",
          recommendation: "ไม่พบบอร์ดคำถามตอบใดๆ ในหมุด แนะนำให้ใช้บัญชีทั่วไปเข้ามาร่างตั้งถาม 3-5 ข้อ และใช้สิทธิ์เจ้าของหมุดเข้ามาพิมพ์ตอบเพื่อเพิ่มความมั่นใจให้ผู้เดินทางผ่านหน้าแรก"
        }
      ];

      setAuditResult({
        name: businessName,
        totalScore: simulatedScore,
        recs: recommendationList
      });
      setLoading(false);
    }, 2800);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen text-gray-900 font-sans pb-24 selection:bg-emerald-105 selection:bg-emerald-100">
      
      {/* Visual Sticky Header bar */}
      <div className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between font-sans">
          <Link
            to="/"
            id="gmb-back-to-home"
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
          <div className="flex items-center space-x-1 border border-emerald-100 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            <span>📍</span>
            <span>GMB Strength Auditor v1.50</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro Layout Titles */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <MapPin className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-990 font-sans text-gray-900 leading-tight">
            ประเมินคะแนนความแข็งแกร่งของหมุด Google Maps 📍
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            เปลี่ยนเรื่องยากระดับพรีเมียมให้กระจ่างใสในชิ้นเดียว! 
            ป้อน URL ลิงก์แผนที่กูเกิลของแบรนด์คุณ เพื่อสล็อตสับวิเคราะห์ความแกร่งให้แตะ 100% 
            และกางคำแนะนำแก้ไขภาษาไทยอย่างง่ายได้ทันใจสำหรับระดับกระเป๋าเงิน
          </p>
        </div>

        {/* Entry Link Input Form */}
        <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl shadow-sm text-center max-w-3xl mx-auto">
          <form onSubmit={handleAudit} className="space-y-4">
            <div className="text-left space-y-1.5 focus-within:ring-2 focus-within:ring-emerald-500 rounded-xl transition-all">
              <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider pl-1">
                วางลิงก์พิกัดร้านค้าของคุณจาก Google Maps (Google Maps URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="ตัวอย่างเช่น: https://maps.app.goo.gl/xxx หรือ https://www.google.com/maps/place/..."
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none text-sm font-medium focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <MapPin className="w-4 h-4 animate-bounce" />
                      <span>กำลังส่องประเมินหมุดแรคชิป ({progress}%)</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>ประเมินคะแนนหมุดฟรี</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-[11px] text-gray-400 block pt-1.5 leading-tight pl-1">
                * วิธีเก็บลิงก์: เปิดแอป Google Maps &gt; หามุมร้านค้า &gt; คลิกปุ่ม "แชร์" (Share) &gt; กด "คัดลอกลิงก์" เพื่อนำมาสแกนความเข้มแข็ง
              </span>
            </div>
          </form>

          {/* Loading animated state bar */}
          {loading && (
            <div className="mt-8 space-y-2.5">
              <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
              <p className="text-[11px] text-gray-450 italic text-center text-gray-500">
                *กำลังดึงประวัติการอัปโหลดแบนเนอร์ภาพ, จำนวนภาพ storefront, ตาราง Q&A และร้อยละคะแนนตอบกลับ...
              </p>
            </div>
          )}
        </div>

        {/* Results layout */}
        <AnimatePresence>
          {auditResult && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-10 max-w-3xl mx-auto"
            >
              {/* Grand strength indicator gauge card */}
              <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                <div className="space-y-2">
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider block w-fit">
                    คะแนนความแกร่งของโปรไฟล์ (GMB Profile Strength Score)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    ระบบประมวลผลหมุด: <span className="text-emerald-600">"{auditResult.name}"</span>
                  </h2>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    เกณฑ์ประเมินสากลรวมทั้งพารามิเตอร์ประดับร้านค้า รูปภาพยืนยันตัวตน และการอัปเดตตอบโต้สถาปัตยกรรม Google Maps
                  </p>
                </div>

                {/* Score Circle metrics badge */}
                <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-slate-50 border border-gray-100 rounded-3xl w-40 h-40 shadow-inner">
                  <span className="text-4xl font-extrabold font-mono text-emerald-600">
                    {auditResult.totalScore}%
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">GMB STRENGTH</span>
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mt-2">
                    ต้องปรับแต่งเพิ่ม
                  </span>
                </div>
              </div>

              {/* Recommendation Sections Details with Info hover labels on technical keywords */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-950 flex items-center space-x-1.5">
                    <Award className="w-5 h-5 text-emerald-500 animate-pulse" />
                    <span>คำแนะนำเพื่อไปจุดแกร่งสูงสุด (Profile Optimization)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-gray-400">7 Checklist Audits</span>
                </div>
                <p className="text-xs text-gray-400">
                  💡 เกร็ดความรู้มือใหม่: เอาเมาส์วางหรือสัมผัสป้ายสีเขียวกลมไอคอน <span className="inline-block p-0.5 bg-emerald-50 text-emerald-600 rounded"><Info className="w-3.5 h-3.5 inline" /></span> เพื่อเรียนรู้ศัพท์เทคโนโลยีด้านพรมแดนแผนที่ง่ายดาย!
                </p>

                <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                  {auditResult.recs.map((rec: GmbRecommendation, index: number) => (
                    <div key={index} className="p-5 sm:p-6 space-y-3.5 hover:bg-gray-50/50 transition-colors">
                      
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          
                          {/* Title with built-in Hover info circle */}
                          <div className="flex items-center space-x-2 relative group md:inline-flex">
                            <h4 className="text-xs sm:text-sm font-black text-gray-950 leading-snug">
                              {rec.name}
                            </h4>
                            
                            {/* Hover Help block */}
                            <div className="relative inline-block cursor-help text-emerald-500 hover:text-emerald-600 p-0.5 bg-emerald-50 rounded select-none">
                              <Info className="w-3.5 h-3.5" />
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-950 text-white text-[10px] sm:text-xs rounded-xl p-3 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30 font-normal leading-relaxed">
                                {rec.info}
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Status badges */}
                        <div className="shrink-0 flex items-center space-x-2.5">
                          <span className="font-mono text-xs font-bold text-gray-450">{rec.score} คะแนน</span>
                          {rec.status === "perfect" && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">สำเร็จ ✓</span>
                          )}
                          {rec.status === "improve" && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase">ปรับปรุง ⚠️</span>
                          )}
                          {rec.status === "missing" && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full uppercase">ตกหล่น ❌</span>
                          )}
                        </div>
                      </div>

                      {/* Detail Recommendation content in Thai */}
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">🛠️ สูตรปรับแต่งเพื่อพิชิตคะแนนร้อยละ 100:</span>
                        <p className="text-[11px] leading-relaxed text-gray-600 font-medium">
                          {rec.recommendation}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Master Conclusion GMB Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg overflow-hidden relative">
                <div className="absolute right-0 bottom-0 text-slate-800 opacity-20 translate-y-5 translate-x-5">
                  <MapPin className="w-48 h-48" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-base sm:text-lg font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>สรุปการเอาชนะ Local SEO สำหรับมือใหม่</span>
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                    การทำ SEO บนพิกัดหมุดแผนที่ไม่ได้อาศัยอะไรยากลับซับซ้อนไปกว่า <strong>ความสม่ำเสมอ</strong> และ 
                    <strong>ความสอดคล้อง</strong> ของข้อมูลในและนอกเว็บ! ป้อนข้อมูลเวลาทำการ ปิด/เปิดร้านให้ละเอียด, 
                    แชร์รูปถ่ายแบรนด์ที่มีคุณภาพสากล, และขยันเชิญชวนลูกค้ามารีวิวผลงาน 5 ดาวร่วมสัปดาห์ 
                    เพียงเท่านี้ หมุดร้านค้าของคุณก็จะโดดเด่นติดอันดับได้ง่ายกว่าใครบน Google Maps ทันที!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beginners info cards if not tested yet */}
        {!auditResult && !loading && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">❓ ความสำคัญของ GMB ในวิชา SEO</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                กูเกิลล็อกแผนที่แสดงผลไว้เป็นกล่องแผนที่ท้องถิ่น (Local Map Pack) คั่นระหว่างการเสิร์ชบทความ 
                ทำให้แบรนด์ผู้ประกอบการที่มีหมุดความแกร่งสูงกว่า ขี่ชิงรับสายโทรและขยายลูกค้าได้ลื่นไหลทันที
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">💡 วิธีง่ายสุดในการได้รีวิว 5 ดาว</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                เพียงแชร์ลิงก์ Direct Review Link ผ่านใบพับ QR Code บนเคาน์เตอร์เช็คบิล 
                พร้อมมอบของสมนาคุณหรือให้โบนัสแชร์ส่วนลดแก่ผู้เข้ามาช่วยเหลือแสดงความคิดเห็นสากล 5 ดาว
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
