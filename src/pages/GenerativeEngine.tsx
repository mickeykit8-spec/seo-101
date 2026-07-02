import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wifi, BarChart2, BookOpen, Layers, Pocket } from "lucide-react";
import { motion } from "motion/react";

export default function GenerativeEngine() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      {/* Sticky Top Header */}
      <div className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            id="back-to-home-geo"
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
          <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            GEO 📡
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Header Description */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Generative Engine Optimization (GEO) 📡
            </h1>
            <p className="text-gray-550 text-base leading-relaxed font-normal">
              โมเดลการสร้างคะแนนระดับสากลยุคใหม่ สำหรับแพลตฟอร์มอย่าง ChatGPT (with Search), Gemini, Perplexity และ Claude 
              เป้าหมายที่แท้จริงคือการเพิ่มความกว้างและสัดส่วนความหนาแน่นของการอ้างอิงแบรนด์ (Brand Citations) 
              เพื่อให้ AI คัดเลือกสินค้าหรือผลงานบริการของธุรกิจเราไปส่งมอบให้แก่ลูกค้า
            </p>
          </div>

          {/* Core GEO Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {[
              {
                title: "Citation Density 📊",
                desc: "สร้างความสอดคล้องเชิงสถิติตัวเลข มีการระบุเครดิตผลงาน อ้างอิงลิงก์ และสร้างสรรค์คีย์เวิร์ดพิกัดแบรนด์ให้เข้าคู่กับคำถามบ่อยครั้ง"
              },
              {
                title: "Topical Authority 📚",
                desc: "ครอบคลุมเนื้อหาในสายอาชีพอย่างรอบด้าน เขียนอธิบายศัพท์เทคนิคละเอียด โดยจัดลำดับโครงสร้างเนื้อหาแบบต้นไม้ที่มีรากฐานแข็งแรง"
              },
              {
                title: "Information Gain 🧪",
                desc: "ส่งมอบข้อมูลชุดใหม่ที่มีสิทธิ์ได้รับคลิกสูง เช่น ผลลัพธ์จากการสุ่มตรวจแล็บ, สัมภาษณ์ศิษย์เก่าในพื้นที่เรียน หรือภาพบันทึกพิกัดของจริง"
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-950 text-sm">{pillar.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Editable warning for future google updates */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Wifi className="w-5 h-5" />
              <h3 className="font-bold text-base text-emerald-950">⚙️ กลยุทธ์ GEO ที่ปรับตามแพลตฟอร์ม AI</h3>
            </div>
            <p className="text-emerald-900/85 text-xs sm:text-sm leading-relaxed">
              เครื่องมือและทฤษฎี GEO มีการค้นพบใหม่และปรับสัดส่วนโครงสร้างอยู่ตลอดเวลา เนื้อหาหน้านี้จึงควรเชื่อมโยงกับพฤติกรรมของ ChatGPT, Gemini, Perplexity และแพลตฟอร์ม AI อื่น 
              เพื่อให้แนวทางปฏิบัติยังทันกระแสและนำไปใช้ได้จริง
            </p>
          </div>

          <div className="pt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-full shadow transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>เรียนวิชา GEO สมบูรณ์แล้ว • กลับสู่หน้าหลัก</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
