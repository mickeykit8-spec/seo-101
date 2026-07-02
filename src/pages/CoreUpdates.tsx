import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertOctagon, Heart, Shield, HelpCircle, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function CoreUpdates() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      {/* Sticky Header */}
      <div className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            id="back-to-home-core"
            className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
          <span className="text-xs bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            CORE UPDATES ☢️
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
          {/* Header titles */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Google Core Updates: ปราสาทและทฤษฎีการผ่านวิกฤตความสะอาดเว็บ ☢️
            </h1>
            <p className="text-gray-550 text-base leading-relaxed font-normal">
              กูเกิลปล่อยอัปเดตระบบตรวจจับประมวลผลค้นหาแกนกลาง (Core Updates) หลายครั้งต่อปี 
              จุดประสงค์หลักคือการคัดกรองเนื้อหาปิ่นปั้นอัตโนมัติด้วย AI ในปริมาณมากแบบไร้ประโยชน์ และสแปมคีย์เวิร์ดซ้ำซ้อน 
              หากคุณต้องการรอดพ้นอย่างถาวรและรักษาแต้มความยั่งยืนของทราฟฟิก เกณฑ์มาตรฐาน E-E-A-T คือเกราะกำบังหลัก!
            </p>
          </div>

          {/* E-E-A-T Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[
              {
                title: "Experience 🎒",
                desc: "แสดงประสบการณ์ตรง มีการถ่ายภาพจริง ระบุเวลา หรือสาเหตุพิกัดปัญหาที่มีความเรียบง่าย"
              },
              {
                title: "Expertise 🧠",
                desc: "แสดงออกถึงความเชี่ยวชาญพิเศษเชิงเฉพาะทาง มีประวัติผู้แต่งประกอบชัดเจน"
              },
              {
                title: "Authoritativeness 🛡️",
                desc: "การกล่าวถึงในเว็บไซต์แวดวงผู้ประกอบการอาชีพ มีลิงก์ชื่นชมภายนอกคุณภาพสูงเข้าช่วย"
              },
              {
                title: "Trustworthiness 🤝",
                desc: "ประเด็นสำคัญที่สุด: หน้าเว็บมีความปลอดภัย ติดตั้ง HTTPS ใบรับรองสมบูรณ์ ปราศจากไวรัสและโฆษกบังคับรบกวนเว็บ"
              }
            ].map((eeat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm space-y-2">
                <h3 className="font-bold text-gray-950 text-xs sm:text-sm">{eeat.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed font-normal">{eeat.desc}</p>
              </div>
            ))}
          </div>

          {/* Core Info Alert Box */}
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-2 text-rose-800">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-base text-rose-950">☢️ แผนรับมือ Google Core Updates</h3>
            </div>
            <p className="text-rose-900/85 text-xs sm:text-sm leading-relaxed">
              Google มักออกคำแนะนำและระบบประเมินคุณภาพใหม่เป็นระยะ เนื้อหาหน้านี้จึงควรเน้นหลัก E-E-A-T, ความน่าเชื่อถือของผู้เขียน, คุณภาพแหล่งอ้างอิง 
              และแนวทางลดความเสี่ยงจากเนื้อหาซ้ำหรือเนื้อหาที่ไม่เป็นประโยชน์
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-full shadow transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>เรียนรู้เกราะป้องกัน E-E-A-T สำเร็จ • กลับสู่กระดานหลัก</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
