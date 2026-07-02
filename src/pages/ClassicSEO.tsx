import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Flame, Server, Code, Search, BookOpen, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function ClassicSEO() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      {/* Header Back Button & Topic Intro */}
      <div className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            id="back-to-home-classic"
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
          <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            SEO Classic Core 🔍
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Hero Header */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Classic Google SEO: หน้าแลนดิ้งเพจโครงสร้างพื้นฐาน 🔍
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              การทำ SEO ดั้งเดิม (Standard On-Page, Off-Page, และ Technical SEO) คือศิลาฤกษ์หลักที่ห้ามมองข้าม 
              แม้ว่าระบบประมวลผลคำตอบจะมี AI เข้ามาส่งเสริม แต่บอท Google Search 
              ยังคงต้องพึ่งพามาตรฐานสากลเหล่านี้เป็นด่านแรกเพื่อประเมินค่าคุณภาพของบทความ
            </p>
          </div>

          {/* Interactive Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-3">
              <div className="flex items-center space-x-2.5 text-emerald-600">
                <Code className="w-5 h-5" />
                <h3 className="font-bold text-gray-950 text-lg">On-Page Optimization</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                จัดแต่งพารามิเตอร์ภายในเพจให้อ่านเป็นระบบ ลำดับสัดส่วนหัวข้อ (Heading tags H1, H2, H3), 
                ตั้งค่าความหนาแน่นคำค้นหา (Keyword Density) และปรับข้อความดึงดูดการคลิกบน Meta Titles 
                และ Meta Descriptions อย่างเหมาะสม
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-3">
              <div className="flex items-center space-x-2.5 text-emerald-600">
                <Server className="w-5 h-5" />
                <h3 className="font-bold text-gray-950 text-lg">Technical SEO Standards</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                ดูแลความสะอาดและสุขภาพในฝั่งการตอบสนองระบบเซิร์ฟเวอร์ ติดตั้งใบรับรองความปลอดภัย HTTPS SSL, 
                เชื่อมโยง XML Sitemap ส่งตรวจดัชนี, เขียนคำสั่งใน Robots.txt และควบคุมเวลาส่งโหลดรูปภาพเพื่อเปิดใช้เร็วขึ้นบนทุกอุปกรณ์พกพา
              </p>
            </div>
          </div>

          {/* Guidelines Section for User Customization */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Flame className="w-5 h-5" />
              <h3 className="font-bold text-base text-emerald-950">💡 แนวทางอัปเดตสูตร Classic SEO</h3>
            </div>
            <p className="text-emerald-900/80 text-xs sm:text-sm leading-relaxed">
              หน้านี้รวบรวมหลักพื้นฐานที่ควรปรับให้ทันการเปลี่ยนแปลงของ Google อย่างต่อเนื่อง ทั้ง On-Page, Technical SEO, โครงสร้างหัวข้อ และตัวอย่างเช็กลิสต์ 
              เพื่อให้บทเรียนยังทันสมัย อ่านง่าย และนำไปใช้งานจริงได้สำหรับผู้เรียนทุกระดับ
            </p>
          </div>

          {/* Checklist for beginners */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-gray-950 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>เช็คลิสต์ด่วนสำหรับก้าวแรก (Classic SEO Checklist)</span>
            </h3>
            
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {[
                { title: "Meta Title ความยาวอยู่ในสเกล 50-60 ตัวอักษรพร้อมคำหลักหลัก", desc: "เพื่อป้องกันอักษรหล้นและแสดงผลสวยงามในหน้าผลลัพธ์การค้นหา" },
                { title: "H1 Tag มีเพียงชื่อเรื่องอันเดียวในหน้าเท่านั้น", desc: "ป้องกันบอทเข้าใจโครงสร้างและขอนำข้อมูลไปจัดอันดับผิดพลาด" },
                { title: "ความเร็วเพจพิกัดบนมือถือต่ำกว่า 2.5 วินาที", desc: "เพื่อรักษาอัตราการตีกลับ Bounce Rate ไม่ให้สูงจนเสียคะแนน" },
                { title: "ติดตั้ง XML Sitemap และส่งเข้า Google Search Console สม่ำเสมอ", desc: "เร่งความเร็วให้หน้าเว็บถูกจัดทำดัชนีในระยะสั้นที่สุด" }
              ].map((item, index) => (
                <div key={index} className="p-4 sm:p-5 flex items-start space-x-3">
                  <div className="p-1 bg-emerald-50 rounded text-emerald-600 mt-0.5">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Back CTA */}
          <div className="pt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-605 hover:bg-emerald-600 text-white font-bold text-sm rounded-full shadow transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>ทำความเข้าใจ Classic Complete • กลับสู่ห้องเรียน</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
