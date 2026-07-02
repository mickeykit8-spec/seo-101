import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Rocket, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "หน้าหลัก", path: "/" },
    { name: "บทความ", path: "/Blog" },
    { name: "เกม SEO", path: "/Games" },
    { name: "เครื่องมือ SEO", path: "/SEOTools" },
    { name: "ความเร็วเว็บ", path: "/PageSpeed" },
    { name: "GMB", path: "/GmbTools", icon: true },
    { name: "Classic SEO", path: "/ClassicSEO" },
    { name: "AI Overviews", path: "/AIOverviews" },
    { name: "GEO", path: "/GenerativeEngine" },
    { name: "Core Updates", path: "/CoreUpdates" }
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Modern Register Modal trigger (simulated in UI)
  const [showRegModal, setShowRegModal] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", website: "" });

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setShowRegModal(false);
      setRegForm({ name: "", email: "", phone: "", website: "" });
    }, 2500);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo area */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="border border-emerald-500 text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded-lg font-mono text-xs font-bold tracking-wider">
                  SEO
                </div>
                <span className="font-sans font-bold text-gray-900 leading-none tracking-tight text-lg">
                  Academy
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm transition-all duration-150 flex items-center space-x-1 ${
                    isActive(link.path)
                      ? "text-emerald-600 bg-emerald-50 font-medium rounded-full"
                      : "text-gray-650 hover:text-gray-900 hover:bg-gray-50 rounded-full"
                  }`}
                >
                  {link.icon && <MapPin className="w-3.5 h-3.5 text-gray-500 inline mr-0.5" />}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* CTA Register Button */}
            <div className="hidden xl:flex items-center">
              <button
                onClick={() => setShowRegModal(true)}
                id="btn-register-navbar"
                className="ml-4 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>ลงทะเบียน</span>
              </button>
            </div>

            {/* Mobile Hamburger toggle */}
            <div className="flex items-center xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                id="btn-hamburger-toggle"
                className="p-2 text-gray-600 hover:text-emerald-500 hover:bg-gray-50 rounded-full active:border-gray-200 focus:outline-none"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="xl:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 text-sm transition-all ${
                      isActive(link.path)
                        ? "text-emerald-600 bg-emerald-50 font-medium rounded-xl"
                        : "text-gray-650 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                    }`}
                  >
                    {link.icon && <MapPin className="w-3.5 h-3.5 text-gray-500 inline mr-1" />}
                    <span>{link.name}</span>
                  </Link>
                ))}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowRegModal(true);
                    }}
                    id="btn-register-mobile"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full text-center shadow-sm flex items-center justify-center space-x-1.5"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>ลงทะเบียนฟรี</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowRegModal(false)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setShowRegModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
 
              {regSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">ลงทะเบียนสำเร็จ!</h3>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    ยินดีต้อนรับสู่ SEO Academy คอร์สและคลังความรู้ของคุณจะถูกส่งเข้าไปโดยเร็วที่สุด
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-950 flex items-center space-x-2">
                    <Rocket className="text-emerald-500 w-5 h-5" />
                    <span>ลงทะเบียนเรียนฟรี</span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    รับสิทธิ์เข้าถึงคอร์สเรียน SEO พื้นฐาน และไฟล์เครื่องมือช่วยเหลือทันที
                  </p>
 
                  <form onSubmit={handleRegSubmit} className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">ชื่อ-นามสกุล / ชื่อเล่น</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น คุณสมศักดิ์"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-450"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">อีเมลแอดเดรส</label>
                      <input
                        type="email"
                        required
                        placeholder="example@yourdomain.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-450"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">เบอร์โทรศัพท์</label>
                      <input
                        type="tel"
                        required
                        placeholder="เช่น 081-XXXXXXX"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-450"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">ลิงก์เว็บไซต์หากมี (เพื่อรับการประเมินฟรี)</label>
                      <input
                        type="url"
                        placeholder="https://mysite.com"
                        value={regForm.website}
                        onChange={(e) => setRegForm({ ...regForm, website: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-450"
                      />
                    </div>
 
                    <button
                      type="submit"
                      className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition-all shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>ยืนยันเข้าเรียนทันที</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
