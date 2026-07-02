import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, AlertTriangle, Zap, MessageSquare, Target } from "lucide-react";
import { motion } from "motion/react";

export default function AIOverviews() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      {/* Header Sticky */}
      <div className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            id="back-to-home-aio"
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
          <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            AI OVERVIEWS 🤖
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
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Google AI Overviews (AIO): สรุปประเด็นด้วยเทคโนโลยี AI 🤖
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              ฟังก์ชั่น AI Overviews ของ Google บีบสรุปคำตอบสำเร็จรูปขึ้นไปวางหน้าแรกสุดของการเสิร์ช 
              ทำให้หน้าเว็บต่างต้องการให้แบรนด์ของตนเองเข้าไปเป็นแหล่งอ้างอิงลิงก์ของบอทคำถามอัจฉริยะเหล่านี้ 
              เพื่อรับทราฟฟิกตรงและแสดงอำนาจความนิยมเชิงข้อมูล
            </p>
          </div>

          {/* AI Strategy Info Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-gray-950">1. Conversational Queries</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                ผู้บริโภคยุคสารสนเทศสั่งการด้วยประโยคยาวคล้ายเพื่อนสนิทคุยกัน เช่น "แนะนำครีมบำรุงผิวหน้าแห้ง 
                ราคาประหยัด สำหรับวัยทำงาน" หน้าเว็บของเราควรสอดแทรกประโยคเหล่านี้ตรงจุดตามหัวข้อบทความหลัก
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold text-gray-950">2. FAQ Structure Integration</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                ตั้งคำถามพาดหัวเด่นชัดในรูปแบบ H2, H3 และเขียนตอบสั้นเข้าประเด็นโดยตรงไม่เกิน 2-3 บรรทัดแรก 
                เพื่อให้โมเดลคำตอบหยิบไปแสดงผลเป็นนิเวศแหล่งอ้างอิงต้นฉบับได้แม่นยำที่สุด
              </p>
            </div>
          </div>

          {/* Editable Guidelines Alert */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Target className="w-5 h-5" />
              <h3 className="font-bold text-base text-emerald-950">📝 แนวทางรับมือ AI Overviews ที่เปลี่ยนเร็ว</h3>
            </div>
            <p className="text-emerald-950/80 text-xs sm:text-sm leading-relaxed">
              AI Overviews เปลี่ยนรูปแบบสรุปคำตอบและแหล่งอ้างอิงอยู่เสมอ เนื้อหาหน้านี้จึงควรอัปเดตตามพฤติกรรมการค้นหาใหม่ คำถามจริงของผู้ใช้ 
              และแนวทางสร้างคำตอบที่ชัดเจน น่าเชื่อถือ และอ้างอิงได้
            </p>
          </div>

          {/* Core Technical Guidelines for AIO */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-950 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <span>พฤติกรรมการดึงข้อมูลของ AI Overviews (Googlebot LLM)</span>
            </h3>
            
            <div className="space-y-4 text-xs text-gray-600 font-medium leading-relaxed">
              <p>
                <b>● กลไกการอ่านแบบข้ามบรรทัด (Semantic Entity Extraction)</b>: 
                อัลกอริทึม LLM ของกูเกิลพิจารณาประเด็นความสัมพันธ์ของคำนาม (Nouns) และเจตนาผู้ใช้ (Search Intent) 
                มากว่าการเปรียบเทียบคำหลักเป๊ะๆ 
              </p>
              <p>
                <b>● ความถูกต้องข้อมูล (Factuality Checks)</b>: 
                เพจปั้นข้อมูลแต่งขึ้นเองโดยไม่มีอิงแหล่งวิชาการหรือวิวัฒนาการสติถิจะถูกละเว้นออกจากกล่องความรู้ 
                เนื่องจากผิดมาตรฐานความปลอดภัยเชิงสังคม
              </p>
            </div>
          </div>

          <div className="pt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-full shadow transition-all cursor-pointer"
            >
              <span>เสร็จสิ้นโมดูล AI OVERVIEWS • กลับสู่หน้าหลัก</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
