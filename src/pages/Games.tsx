import { useState, useEffect, useRef } from "react";
import { 
  Gamepad2, Brain, Trophy, Code, Sparkles, 
  ArrowUp, ArrowDown, ChevronRight, CheckCircle2, CircleAlert, Sparkle, RefreshCw, Award, Users, AlertTriangle, Check, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getUserProfile, 
  saveUserProfile, 
  awardPoints, 
  unlockBadge, 
  getLeaderboard, 
  ALL_BADGES, 
  Badge 
} from "../utils/gamification";

export default function Games() {
  // Gamification profile states
  const [profile, setProfile] = useState(() => getUserProfile());
  const [leaderboard, setLeaderboard] = useState(() => getLeaderboard());
  const [toastMsg, setToastMsg] = useState<{ text: string; subText?: string } | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Trigger toast notification
  const triggerToast = (text: string, subText?: string) => {
    setToastMsg({ text, subText });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Synchronize gamification profile state when changed
  const reloadProfile = () => {
    const updated = getUserProfile();
    setProfile(updated);
    setLeaderboard(getLeaderboard());
  };

  useEffect(() => {
    window.addEventListener("seo_101_gamification_update", reloadProfile);
    return () => {
      window.removeEventListener("seo_101_gamification_update", reloadProfile);
    };
  }, []);

  // Award points handler
  const handleAwardPoints = (pts: number, reason: string) => {
    const prevPoints = profile.points;
    const updated = awardPoints(pts);
    setProfile(updated);
    setLeaderboard(getLeaderboard());
    triggerToast(`🎉 +${pts} คะแนน!`, reason);

    // Dynamic Badge checks based on points
    if (updated.points >= 250 && !updated.badges.includes("seo_novice")) {
      const { newlyUnlocked } = unlockBadge("seo_novice");
      if (newlyUnlocked) {
        triggerToast("🎖️ ปลดล็อคเหรียญรางวัล!", "SEO Novice: เริ่มต้นก้าวแรกเรียบร้อย");
      }
    }
  };

  // Unlock badge helper
  const handleUnlockBadge = (badgeId: string, badgeName: string) => {
    const { newlyUnlocked } = unlockBadge(badgeId);
    if (newlyUnlocked) {
      reloadProfile();
      triggerToast(`🎖️ ปลดล็อคเหรียญ "${badgeName}" แล้ว!`, "ได้รับเพิ่มโบนัสพิเศษ +150 คะแนน!");
    }
  };

  // --- GAME 1: KEYWORD SEARCH INTENT QUIZ ---
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const quizData = [
    {
      scenario: "คุณต้องการโปรโมตร้านเช่ารถหรูย่าน 'ทองหล่อ' คีย์เวิร์ดใดดึงดูดคนยอมจ่ายเงินก้อนโตและตรงจุดประสงค์ที่สุด?",
      options: [
        { text: "รถเก๋งประหยัดน้ำมันราคาหลักร้อย", isCorrect: false, desc: "ไม่ใช่คุณสมบัติที่ตรงกับกลุ่มตลาดเช่ารถหรูแบบพรีเมียม" },
        { text: "เช่ารถหรู ทองหล่อ", isCorrect: true, desc: "ถูกต้อง! ตรงทั้งพื้นที่เป้าหมายและจำแนกกลุ่มคนมีกำลังซื้อสูง คุ้มค่าเฉลี่ยสูงสุด!" },
        { text: "วิธีลบรอยขีดข่วนสีรถยนต์เองที่บ้าน", isCorrect: false, desc: "นี่คือคีย์เวิร์ดบทช่วยสอนเพื่อทำความสะอาดรถ ไม่ใช่ความตั้งใจมาเช่า" },
        { text: "ห้างสรรพสินค้าพลาซ่าในทองหล่อ", isCorrect: false, desc: "กว้างและจืดจางเกินไป ดึงได้แต่คนเดินห้างทั่วไปที่ไม่ได้สนใจรถยนต์" }
      ]
    },
    {
      scenario: "คำสืบค้นด้วยวลี 'วิธีเปิดใช้งานโหมดประหยัดพลังงานบนมือถือ Android 15' จัดอยู่ในการจัดประเภทเจตนารมณ์ (Search Intent) แบบใด?",
      options: [
        { text: "Transactional Intent (พร้อมซื้อขาย)", isCorrect: false, desc: "ผู้ใช้งานต้องหาแนวทางทำด้วยตัวเอง ไม่ได้หามือถือเครื่องใหม่ทันที" },
        { text: "Informational Intent (ต้องการหาความรู้)", isCorrect: true, desc: "ถูกต้อง! ผู้ค้นหาต้องการหาคำแนะนำ ข้อมูล หรือขั้นตอนการปฏิบัติหน้าที่" },
        { text: "Navigational Intent (การนำทางไปเว็บไซต์)", isCorrect: false, desc: "ไม่ได้ระบุชื่อเว็บโดยตรง เช่น YouTube หรือ Facebook เพื่อเข้าชมเป้าหมาย" },
        { text: "Commercial Intent (เปรียบเทียบเชิงพาณิชย์)", isCorrect: false, desc: "ไม่มีชื่อเปรียบเทียบระหว่างผลิตภัณฑ์หรือแบรนด์เพื่อตัดสินใจซื้อ" }
      ]
    },
    {
      scenario: "คีย์เวิร์ดแบบ 'Google Search Console เทียบกับ Ahrefs เครื่องมือไหนดีกว่ากันสำหรับปี 2026' ถือเป็นกลุ่มเจตนาใด?",
      options: [
        { text: "Commercial Intent (เพื่อวิเคราะห์เปรียบเทียบก่อนซื้อ)", isCorrect: true, desc: "ถูกต้องยอดเยี่ยม! เป็นการนำสองแบรนด์สินค้ามาจับเข่าวัดคุณภาพ เพื่อเตรียมจ่ายเงินเกื้อหนุนในภายหลัง" },
        { text: "Informational Intent (หาข้อมูลล้วน)", isCorrect: false, desc: "แม้ว่าจะหาความรู้ แต่จุดประสงค์เน้นเจาะสถิติเปรียบเทียบสินค้าแบรนด์ชั้นนำ" },
        { text: "Navigational Intent (นำทางด่วน)", isCorrect: false, desc: "ผู้ใช้ไม่ได้พยายามพิมพ์คำเพื่อกดลิ้งค์ตรงด่วน" }
      ]
    }
  ];

  const handleQuizAnswer = (isCorrect: boolean, desc: string) => {
    setQuizFeedback(desc);
    setQuizCorrect(isCorrect);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      handleAwardPoints(70, "ตอบคำถามวิเคราะห์เจตนาคีย์เวิร์ดถูกต้อง!");
    } else {
      triggerToast("❌ ตอบพลาดยังไม่ตรงจุด", "ลองประเมินทบทวนใหม่อีกครั้ง");
    }
  };

  const nextQuiz = () => {
    setQuizFeedback(null);
    setQuizCorrect(null);
    if (quizIndex < quizData.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setQuizFinished(true);
      handleUnlockBadge("intent_master", "Intent Master 🧠");
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizFeedback(null);
    setQuizCorrect(null);
    setQuizFinished(false);
    setQuizScore(0);
  };


  // --- GAME 2: RANKING SIMULATOR ACTIONS ---
  const [simWebsites, setSimWebsites] = useState([
    { id: "A", domain: "thai-seo-premium.com", da: 58, backlinks: 12500, secure: true, loadSpeed: "0.8s", score: 94 },
    { id: "B", domain: "ez-spam-directory.info", da: 8, backlinks: 120, secure: false, loadSpeed: "4.5s", score: 25 },
    { id: "C", domain: "academic-knowledge.or.th", da: 48, backlinks: 3200, secure: true, loadSpeed: "1.2s", score: 85 },
    { id: "D", domain: "blog-copied-articles.blogspot.com", da: 28, backlinks: 18000, secure: true, loadSpeed: "2.1s", score: 55 } // high backlinks but duplicated copy authority
  ]);
  const [simChecked, setSimChecked] = useState(false);
  const [simSuccess, setSimSuccess] = useState(false);

  const moveRankingItem = (index: number, direction: "up" | "down") => {
    const newItems = [...simWebsites];
    if (direction === "up" && index > 0) {
      const temp = newItems[index];
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = temp;
    } else if (direction === "down" && index < newItems.length - 1) {
      const temp = newItems[index];
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = temp;
    }
    setSimWebsites(newItems);
    setSimChecked(false);
  };

  const checkSimRankingResult = () => {
    const currentOrder = simWebsites.map(w => w.id).join("");
    setSimChecked(true);
    if (currentOrder === "ACDB") {
      setSimSuccess(true);
      handleAwardPoints(150, "จัดลำดับสุขภาพเว็บไซต์ขึ้นหน้าแรกกูเกิลสำเร็จ!");
      handleUnlockBadge("rank_engineer", "Rank Engineer 🏆");
    } else {
      setSimSuccess(false);
      triggerToast("❌ ผิดพลาดนิดหน่อย", "ลองคำนวณเปรียบเทียบ Domain Authority, พลัง HTTPS และความช้าสแปมใหม่อีกรอบ");
    }
  };


  // --- GAME 3: THE COMPONENT CORRECTOR (NEW COMPONENT REPAIR GAME) ---
  const [repairIndex, setRepairIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRepaired, setIsRepaired] = useState(false);

  const repairChallenges = [
    {
      title: "รูปภาพ Banner หัวเว็บหลัก 1 หน้าแรกของบริษัท",
      wrongSnippet: `<img src="/images/banner_new2026.png" />`,
      correctOption: `<img src="/images/banner_new2026.png" alt="คอร์สสอนทำ SEO 101 อัปเกรดทราฟฟิกปี 2026" />`,
      options: [
        { text: `<img src="/images/banner_new2026.png" alt="คอร์สสอนทำ SEO 101 อัปเกรดทราฟฟิกปี 2026" />`, isCorrect: true, reason: "ใส่ข้อความอธิบายรูปภาพ (Alt Text) มีความสำคัญสูงสุดในการช่วยบอททำความเข้าใจความหมายรูปและดันขึ้น Google Images!" },
        { text: `<img src="/images/banner_new2026.png" style="width: 100%" />`, isCorrect: false, reason: "การตกแต่งสไตล์ความกว้างไม่ได้ระบุคำแปลเนื้อหาให้ Search Engine" },
        { text: `<!-- รูปภาพร้านสุดเจ๋ง --> \n<img src="/images/banner_new2026.png" />`, isCorrect: false, reason: "ช่องคอมเมนต์ในโค้ดจะส่งผลช่วยเหลือเฉพาะโปรแกรมเมอร์ ไม่เกี่ยวกับบอทภาพ" }
      ],
      description: "ข้อผิดพลาด: ขาดแอตทริบิวต์ alt (Alternative Text) ซึ่งถือเป็นกุญแจเด็ดในการอธิบายภาพถ่ายให้ผู้บกพร่องสติปัญญาและสแกนเนอร์กูเกิลประทับรับรู้"
    },
    {
      title: "การจัดสรรโครงสร้างมาตรฐานหัวข้อเรื่องหลัก (Heading TAG)",
      wrongSnippet: `<h1>คินน์ช็อป ยินดีต้อนรับ</h1>\n<h1>บริการออกแบบเว็บไซต์</h1>\n<h1>ติดต่อเราทันที</h1>`,
      correctOption: `<h1>คินน์ช็อป ยินดีต้อนรับ</h1>\n<h2>บริการออกแบบเว็บไซต์ของเรา</h2>\n<h3>ช่องทางการติดต่อเรา</h3>`,
      options: [
        { text: `<h1>คินน์ช็อป ยินดีต้อนรับ</h1>\n<h2>บริการออกแบบเว็บไซต์ของเรา</h2>\n<h3>ช่องทางการติดต่อเรา</h3>`, isCorrect: true, reason: "ถูกต้อง! หลักสากลที่ดี 1 หน้ารันเว็บหลักควรมีเพียงหนึ่งหัวข้อ H1 หลักเพื่อบอกความสำคัญที่สุด นอกนั้นปัดลงไปเป็นชั้น H2/H3 เสมือนสารบัญ" },
        { text: `<h1 class="text-xl">คินน์ช็อป ยินดีต้อนรับ</h1>\n<h1 class="text-base">บริการออกแบบเว็บไซต์</h1>\n<h1 class="text-xs">ติดต่อเราทันที</h1>`, isCorrect: false, reason: "การปรับขนาดเท็กซ์ให้เล็กลงแต่ยังใช้ตระกูล H1 ซ้ำๆ 3 ตัว ถือว่าล้มเหลวในการจัดกลุ่มความสำคัญ" },
        { text: `<p><b>คินน์ช็อป ยินดีต้อนรับ</b></p>\n<p>บริการออกแบบของเรา</p>`, isCorrect: false, reason: "การใช้ประโยคทั่วไปตีกรอบด้วย p จะทำให้ตัวบอทมองไม่เห็นโครงสร้างเด่นชัด" }
      ],
      description: "ข้อผิดพลาด: หน้าเว็บมีแท็ก H1 มากมายล้นหลักการ คติเตือนใจคือ H1 ควรมีเพียงคำเดียวเพื่อแทนความหมายชื่อเรื่องหลักของเอกสารนั้นเพื่อจัดระเบียบให้สะอาด"
    },
    {
      title: "โครงสร้างตัวอย่าง URL เข้ามาหน้าอ่านบทความ",
      wrongSnippet: `https://seo101.com/index.php?category=blog&post_id=983427&lang=th`,
      correctOption: `https://seo101.com/blog/what-is-geo-trends`,
      options: [
        { text: `https://seo101.com/blog/what-is-geo-trends`, isCorrect: true, reason: "ถูกต้อง! URL แบบสถิต (Static URL) ที่บ่งบอกคีย์เวิร์ดตามสัดส่วนช่วยให้อ่านและจำได้ง่าย ทั่วโลกยกย่องว่าช่วยกระตุ้นคลิกได้มีสัญชาตญาณสูง" },
        { text: `https://seo101.com/index.php?category=983427&keyword=seo-trends`, isCorrect: false, reason: "ยังคงมีความรกจากระบบหลังบ้านไดนามิกปนเปื้อนอยู่อีกมาก" },
        { text: `https://seo101.com/p/th-th-th/blog/983427_what_is_geo`, isCorrect: false, reason: "มีคลังรหัสและตัวคั่นยุ่งระยับไปหมด ทำให้ยากต่อการสืบค้น" }
      ],
      description: "ข้อผิดพลาด: ลิงก์ไดนามิก (Dynamic URL) รกและไร้คีย์เวิร์ดเป้าหมาย ทำให้คนสับสนและบอทยากจะตีความลำดับความลึกหมวดหมู่"
    }
  ];

  const handleRepairAnswer = (isCorrectChoice: boolean, explanationText: string) => {
    setShowExplanation(true);
    if (isCorrectChoice) {
      setIsRepaired(true);
      handleAwardPoints(100, "แก้ไขซ่อมแซมโค้ดบิดเบี้ยวได้มาตรฐานของ On-Page!");
      if (repairIndex === repairChallenges.length - 1) {
        handleUnlockBadge("page_squasher", "On-Page Squasher 🛠️");
      }
    } else {
      setIsRepaired(false);
      triggerToast("❌ ชิ้นส่วนยังคงสั้นหรือผิดพลาด", "โปรดลองเลือกวิธีประยุกต์จัดวางตัวอื่น");
    }
  };

  const nextRepair = () => {
    setShowExplanation(false);
    setIsRepaired(false);
    setRepairIndex((prev) => (prev + 1) % repairChallenges.length);
  };


  // --- GAME 4: META TAG CHECKER ---
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaSaved, setMetaSaved] = useState(false);

  const titleLen = metaTitle.length;
  const descLen = metaDesc.length;
  const isTitleSafe = titleLen >= 50 && titleLen <= 60;
  const isDescSafe = descLen >= 120 && descLen <= 155;

  const saveMetaTags = () => {
    if (isTitleSafe && isDescSafe) {
      setMetaSaved(true);
      handleAwardPoints(120, "คำนวณและปรับตัวอักษรบนคำสรุปเสิร์ช (SERP) สำเร็จทักษะระดับสูง!");
      handleUnlockBadge("meta_architect", "Meta Architect ✍️");
      setTimeout(() => setMetaSaved(false), 3000);
    } else {
      triggerToast("⚠️ ความยาวยังไม่อยู่ในช่วงสมบูรณ์", "ปรับแต่งตัวอักษรให้เข้ากับแสงเน้นเขียวแล้วยื่นตรวจสอบใหม่");
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans pb-24 relative overflow-hidden">
      
      {/* Background visual graphics */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 bg-slate-900 text-white p-5 max-w-sm rounded-2xl shadow-md border border-slate-850 font-sans"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl pt-0.5 animate-bounce">🎖️</span>
              <div>
                <h4 className="font-black text-sm text-emerald-400">{toastMsg.text}</h4>
                {toastMsg.subText && <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed">{toastMsg.subText}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Top HUD Navigation bar to display XP, Badges, Level */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-205 py-3.5 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase flex items-center space-x-1">
              <Sparkle className="w-3 h-3 text-emerald-500 animate-spin" />
              <span>SCORE POINTS: {profile.points} pts</span>
            </span>
            
            <div className="w-24 sm:w-40 bg-slate-105 rounded-full h-2 overflow-hidden border border-slate-200">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (profile.points / 1200) * 100)}%` }}
              />
            </div>
            
            <span className="text-[10px] bg-slate-800 text-white px-2.5 py-1 font-bold uppercase rounded-lg">
              Level {Math.floor(profile.points / 250) + 1}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-xs text-slate-450 font-bold flex items-center space-x-1.5">
              <span>🏆 สมญานาม:</span>
              <span className="text-slate-800 font-extrabold bg-slate-100 px-2.5 py-1 rounded-lg">
                {profile.points >= 800 ? "SEO Commander 👑" : profile.points >= 500 ? "SEO Specialist 🎓" : profile.points >= 250 ? "SEO Analyst 📖" : "SEO Pathseeker 🗺️"}
              </span>
            </div>
            
            <div className="text-xs text-slate-450 font-bold flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-lg">
              <span>🎖️ ปลดล็อค:</span>
              <span className="font-extrabold">{profile.badges.length}/{ALL_BADGES.length} ตรา</span>
            </div>
          </div>

        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        
        {/* Intro Dashboard Center */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full font-sans text-xs font-bold animate-pulse">
            <Gamepad2 className="w-4 h-4 text-emerald-500 animate-spin" />
            <span>SEO 101 GAMIFIED ARCADE V2</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none font-sans">
            ลานประลองทักษะ <span className="text-emerald-600 bg-emerald-50 px-2 rounded-lg font-black">SEO & GEO</span> 🕹️
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            ทดสอบสมรรถภาพด้วยระบบประชันคำนวณ สะสมคะแนนความชอบ ปลดล็อคตราเหรียญเกียรติยศ และครองอันดับหัวตารางผู้นำการเรียนรู้ในระดับสากล!
          </p>
        </div>

        {/* Global Gamification & Leaderboard Sidebar and Main Area Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Workspace */}
          <div className="lg:col-span-8">
            {activeGame ? (
              <div>
                
                {/* GAME CONTROL HEADER */}
                <div className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between mb-8 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <Brain className="w-6 h-6 animate-pulse" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                        {activeGame === "quiz" && "มินิเกมที่ 1: ตอบคำถามวิเคราะห์ Search Intent 🧠"}
                        {activeGame === "rank" && "มินิเกมที่ 2: จำลองแรงค์อัลกอรึทึม (Rank Simulator) 📊"}
                        {activeGame === "repair" && "มินิเกมที่ 3: ซ่อมแซมโค้ดปริศนาโครงสร้างหน้าเว็บ 🛠️"}
                        {activeGame === "meta" && "มินิเกมที่ 4: ออกแบบ Meta Tags เคร่งครัดกูเกิล SERPs ✍️"}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold">โหมดทุ่มเทฝึกสอน | อัตราชนะปลดตราเหรียญพรีเมียม</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setActiveGame(null); restartQuiz(); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    ออกห้องเล่นเกม
                  </button>
                </div>

                {/* GAME 1 CONTENT: SEARCH INTENT QUIZ */}
                {activeGame === "quiz" && (
                  <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                    {!quizFinished ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
                          <span>วิชาประจัญบานคีย์เวิร์ด</span>
                          <span>คำถามที่ {quizIndex + 1} จาก {quizData.length}</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-slate-850 leading-snug">
                          {quizData[quizIndex].scenario}
                        </h4>

                        <div className="space-y-3.5 pt-2">
                          {quizData[quizIndex].options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              disabled={quizFeedback !== null}
                              onClick={() => handleQuizAnswer(opt.isCorrect, opt.desc)}
                              className={`w-full p-4 text-left border rounded-2xl transition-all font-semibold text-xs sm:text-sm flex justify-between items-center cursor-pointer ${
                                quizFeedback 
                                  ? opt.isCorrect 
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                    : "bg-slate-50 border-slate-200 text-slate-400"
                                  : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                              }`}
                            >
                              <span>{opt.text}</span>
                              {quizFeedback && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />}
                            </button>
                          ))}
                        </div>

                        {quizFeedback && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold leading-relaxed ${
                              quizCorrect 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                : "bg-rose-50 border-rose-200 text-rose-800"
                            }`}
                          >
                            <p className="font-extrabold uppercase mb-1">{quizCorrect ? "✓ กลยุทธ์เฉียบแหลม" : "✗ ยังวิเคราะห์ตื้นเขิน"}</p>
                            <p>{quizFeedback}</p>
                            <button
                              onClick={nextQuiz}
                              className="mt-4 px-4 py-2 bg-slate-805 text-white font-black text-xs rounded-xl bg-slate-800 hover:bg-slate-900 cursor-pointer flex items-center space-x-1.5"
                            >
                              <span>{quizIndex < quizData.length - 1 ? "ทำข้อถัดไป" : "สรุปผลลัพธ์ด่าน"}</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 space-y-6">
                        <span className="text-5xl">🧠</span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900">ทดสอบคุณสมบัติผ่านเรียบร้อย!</h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed max-w-sm mx-auto">
                          คุณทำคะแนนได้ {quizScore} จาก {quizData.length} คะแนน ปลดล็อคเหรียญรางวัลพิเศษ Intent Master เข้ากระเป๋า
                        </p>
                        <div className="flex justify-center space-x-2 pt-2">
                          <button 
                            onClick={restartQuiz}
                            className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                          >
                            ทำใหม่อีกรอบ
                          </button>
                          <button 
                            onClick={() => { setActiveGame(null); restartQuiz(); }}
                            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                          >
                            กลับห้องแอนะล็อก
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* GAME 2: RANKING SIMULATOR */}
                {activeGame === "rank" && (
                  <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <Award className="w-4 h-4 text-emerald-500" />
                        <span>จำลองแรงกิ้งเสิร์ชเวิลด์ (Google Sandbox Rule)</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-850">
                        จัดลำดับเว็บไซต์ทีมีคุณภาพการทำเทคนิคอลสูงสุดขึ้นไปอยู่อันดับ 1 (บนสุด) เรียงลงมาล่างสุด
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        พิจารณาสัญชาตญาณความปลอดภัย HTTPS, ขนาดพอร์ต DA เลเวล, คุณภาพลิงก์, และความเฉื่อยโหลดสปีดที่ไม่มีสแปม
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {simWebsites.map((web, index) => (
                        <div 
                          key={web.id}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center sm:justify-between gap-4 transition-all"
                        >
                          <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                            <span className="w-8 h-8 bg-slate-200 text-slate-800 font-black text-sm rounded-xl flex items-center justify-center shadow-2sm">
                              #{index + 1}
                            </span>
                            <div>
                              <span className="font-mono text-xs sm:text-sm font-bold text-slate-800">{web.domain}</span>
                              <div className="flex flex-wrap gap-2 mt-1 text-[10px] sm:text-[11px] text-slate-400 font-bold">
                                <span>Domain Auth: <strong className="text-slate-650">{web.da}</strong></span>
                                <span>•</span>
                                <span>Backlinks: <strong className="text-slate-650">{web.backlinks.toLocaleString()}</strong></span>
                                <span>•</span>
                                <span>Load Speed: <strong className={parseInt(web.loadSpeed) < 2 ? "text-emerald-500" : "text-amber-500"}>{web.loadSpeed}</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Level movement buttons */}
                          <div className="flex space-x-1.5 shrink-0 ml-auto sm:ml-0">
                            <button
                              disabled={index === 0}
                              onClick={() => moveRankingItem(index, "up")}
                              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4 text-slate-500" />
                            </button>
                            <button
                              disabled={index === simWebsites.length - 1}
                              onClick={() => moveRankingItem(index, "down")}
                              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        onClick={checkSimRankingResult}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                      >
                        ส่งความถูกต้องตรวจสอบแรงค์
                      </button>

                      {simChecked && (
                        <div className="text-xs sm:text-sm font-bold">
                          {simSuccess ? (
                            <span className="text-emerald-650 text-emerald-600">✓ ลำดับคุณถูกต้องเป๊ะ! รับโบนัสความดีความชอบสูงสุด +150 XP</span>
                          ) : (
                            <span className="text-rose-600">✗ ลำดับยังคงติดขัดอยู่ ลองประเมินความปลอดภัยและแบคพาสอีกรอบ</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* GAME 3: COMPONENT CORRECTOR */}
                {activeGame === "repair" && (
                  <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 pb-3">
                      <span>ซ่อมส่วนประกอบ HTML ให้เป็นมิตรกับบอท SEO</span>
                      <span>หัวข้อแก้ไข {repairIndex + 1} จาก {repairChallenges.length}</span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm sm:text-base font-black text-slate-850">
                        ด่านแก้ไข: {repairChallenges[repairIndex].title}
                      </h4>
                      <p className="text-xs text-rose-600 bg-rose-50/50 border border-rose-100 p-3 rounded-xl font-bold leading-relaxed">
                        {repairChallenges[repairIndex].description}
                      </p>

                      {/* Display wrong snippet code */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">โค้ดผิดพลาด (Broken Snippet):</span>
                        <pre className="p-3 bg-slate-900 text-red-400 font-mono text-xs rounded-xl overflow-x-auto text-left select-all font-semibold">
                          {repairChallenges[repairIndex].wrongSnippet}
                        </pre>
                      </div>

                      {/* Selection Options */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เลือกทางเลือกแก้ที่ดีที่สุด:</span>
                        {repairChallenges[repairIndex].options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            disabled={showExplanation}
                            onClick={() => handleRepairAnswer(opt.isCorrect, opt.reason)}
                            className={`w-full p-4 border rounded-2xl transition-all font-mono text-xs text-left cursor-pointer flex justify-between items-center ${
                              showExplanation
                                ? opt.isCorrect 
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                  : "bg-slate-50 border-slate-200 text-slate-400"
                                : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <span>{opt.text}</span>
                          </button>
                        ))}
                      </div>

                      {showExplanation && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold leading-relaxed space-y-3 ${
                            isRepaired ? "bg-emerald-50 border-emerald-200 text-emerald-805 text-emerald-800" : "bg-rose-50 border-rose-250 text-rose-805 text-rose-800"
                          }`}
                        >
                          <p className="font-black">{isRepaired ? "✓ ประกอบเสร็จสมบูรณ์ร้อยเปอร์เซ็นต์!" : "✗ ลองประยุกต์ทวนสูตรใหม่"}</p>
                          <p>{repairChallenges[repairIndex].options.find(o => showExplanation && o.reason)?.reason}</p>
                          
                          <button
                            onClick={nextRepair}
                            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                          >
                            {repairIndex < repairChallenges.length - 1 ? "แก้ปริศนาถัดไป" : "ย้อนด่านใหม่"}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* GAME 4: META TAG CHARACTER SAFE LIMIT CHECKER */}
                {activeGame === "meta" && (
                  <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">SERP Google Simulator (Character Rules)</span>
                      <h4 className="text-sm sm:text-base font-black text-slate-850">
                        ปรับความยาว Meta Title & Description เพื่อให้บอทไม่ตัดขัดและดึงใจคนคลิก (CTR Optimal Pixel)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <label>Meta Title (ควรอยู่ระหว่าง 50 - 60 ตัวอักษร):</label>
                            <span className={isTitleSafe ? "text-emerald-500 font-extrabold" : "text-amber-500 font-bold"}>
                              {titleLen} ตัวอักษร
                            </span>
                          </div>
                          <input
                            type="text"
                            placeholder="ระบุชื่อหัวเรื่องกระชับ เช่น คอร์สสอนยิงแอดพรีเมียมด้วยสูตรแฮก"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <label>Meta Description (ควรอยู่ระหว่าง 120 - 155 ตัวอักษร):</label>
                            <span className={isDescSafe ? "text-emerald-500 font-extrabold" : "text-amber-500 font-bold"}>
                              {descLen} ตัวอักษร
                            </span>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="ระบุข้อความสรุปโดมเท็คท์ ดึงดูดความตื่นตาตื่นใจ พร้อมคีย์เวิร์ดเป้าหมาย"
                            value={metaDesc}
                            onChange={(e) => setMetaDesc(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold leading-relaxed"
                          />
                        </div>

                        <button
                          onClick={saveMetaTags}
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          ส่งประเมินสากล
                        </button>
                      </div>

                      {/* GOOGLE PREVIEW SIMULATION CARD */}
                      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">จำลองผลลัพธ์บนเครื่องกูเกิล (CTR Preview):</span>
                        
                        <div className="space-y-1 text-left font-sans font-medium">
                          <span className="text-[10.5px] text-slate-400 block truncate">https://youracademy.com/seo-tutorials</span>
                          
                          <h4 className="text-lg text-emerald-600 hover:underline cursor-pointer truncate leading-snug font-semibold">
                            {metaTitle ? metaTitle : "กรุณาเริ่มกรอก Meta Title เพื่อตรวจสอบ..."}
                          </h4>
                          
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                            {metaDesc ? metaDesc : "กรุณากรอกข้ออธิบาย Meta Description ด้านซ้ายเพื่อให้ตัวปัดสแกนเนอร์วิเคราะห์ความแน่นสว่างบนหน้าเสิร์ชจำลอง..."}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-bold">
                          <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                            <span className="text-slate-400 block uppercase text-[8.5px]">Title Status:</span>
                            <span className={isTitleSafe ? "text-emerald-500" : "text-amber-500"}>
                              {isTitleSafe ? "สมบูรณ์แบบ ✓" : "ความยาวไม่ฟิต"}
                            </span>
                          </div>
                          <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                            <span className="text-slate-400 block uppercase text-[8.5px]">Desc Status:</span>
                            <span className={isDescSafe ? "text-emerald-500" : "text-amber-500"}>
                              {isDescSafe ? "สมบูรณ์แบบ ✓" : "ระดมไม่สมดุล"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {metaSaved && (
                      <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-black text-center rounded-xl animate-pulse">
                        🎖️ สถิติเฉียบ! ตัวอักษรของคุณผ่านเกณฑ์คุณภาพ แฮ็กการแสดงผลอันดับหนึ่งเสร็จสมบูรณ์แล้ว
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              
              /* ARCADE SELECTION DASHBOARD HOME PAGE MODULES */
              <div className="space-y-8">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block px-1 border-l-4 border-emerald-500 pl-3.5">
                  โปรดเลือกห้องมินเกมเพื่อลับวิทยายุทธ์:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* GAME 1 CARD */}
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl w-fit text-emerald-650 text-emerald-600">
                        <Brain className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-850">Game 1: Keyword Focus Quiz</h3>
                      <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                        ปราบคำถามจำเนียนคีย์เวิร์ด เจาะลึกอารมณ์และเจตจำนงแฝง (Search Intent) ของกลุ่มเป้าหมายชาวไทยให้ตรงวัตถุประสงค์
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setActiveGame("quiz")}
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        เริ่มทำแบบทดสอบ
                      </button>
                    </div>
                  </div>

                  {/* GAME 2 CARD */}
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl w-fit text-emerald-650 text-emerald-600">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-850">Game 2: Rank Simulator</h3>
                      <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                        สกัดแบรนด์และวางตำแหน่งแรงกิ้งของเว็บบลิสต์ประมวลสัดส่วนพารามิเตอร์ DA, SSL, หน้าช้าสแปมเพื่อครองหน้าแรกกูเกิล
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setActiveGame("rank")}
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        เข้าสแกนจำลองแรงก์
                      </button>
                    </div>
                  </div>

                  {/* GAME 3 CARD */}
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl w-fit text-emerald-650 text-emerald-600">
                        <Code className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-850">Game 3: Component Corrector</h3>
                      <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                        สวมเกราะโปรแกรมเมอร์เข้าตรวจโค้ด ซ่อมหน้าแบรนด์รูป เว็บไซต์สับสน หัวจดหมาย H1 ซ้ำซากเพื่อความสมบูรณ์แบบ
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setActiveGame("repair")}
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        เริ่มผ่าตัดประกอบโค้ด
                      </button>
                    </div>
                  </div>

                  {/* GAME 4 CARD */}
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all duration-200">
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl w-fit text-emerald-650 text-emerald-600">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-850">Game 4: Meta Characters</h3>
                      <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                        คำนวณและป้อนรหัสขัดเกลา Meta Title และสรุปดีพเท็คท์ให้อยู่เป้าสายตา CTR ไม่ขาดหายในการแสดงผลกูเกิลเสิร์ชของคนไทย
                      </p>
                    </div>
                    <div className="pt-5 mt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setActiveGame("meta")}
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        เปิดตะแกรงโมเดลคำนวณ
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            )}
          </div>

          {/* Right Sidebar - Dynamic Leaderboard & Unlocked Badges */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Realtime Leaderboard (Local State Sync) */}
            <div className="bg-white border border-slate-205 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center space-x-1.5 text-slate-700 font-extrabold text-sm pb-1.5 border-b border-slate-100">
                <Users className="w-5 h-5 text-emerald-500" />
                <span>อันดับผู้แข่งขันสัปดาห์นี้</span>
              </div>
              
              <div className="space-y-3">
                {leaderboard.map((user, idx) => (
                  <div 
                    key={user.id}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                      user.isUser 
                        ? "bg-emerald-50 border-2 border-emerald-555 border-emerald-300 scale-102" 
                        : "bg-slate-50 border border-slate-150"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 text-xs font-black rounded-lg flex items-center justify-center ${
                        idx === 0 
                          ? "bg-amber-100 text-amber-700" 
                          : idx === 1 
                            ? "bg-slate-200 text-slate-700" 
                            : "bg-orange-100 text-orange-700"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="font-sans font-medium text-xs sm:text-sm">
                        <span className="font-extrabold text-slate-800 block">
                          {user.name} {user.isUser && "(คุณ 👑)"}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{user.title}</span>
                      </div>
                    </div>
                    
                    <span className="font-pixel text-emerald-700 text-xs font-black shrink-0">
                      {user.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements - Badges List */}
            <div className="bg-white border border-slate-205 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center space-x-1.5 text-slate-700 font-extrabold text-sm pb-1.5 border-b border-slate-100">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <span>เหรียญตาเกียรติยศ (My Badges)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ALL_BADGES.map((badge) => {
                  const isUnlocked = profile.badges.includes(badge.id);
                  return (
                    <div 
                      key={badge.id}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                        isUnlocked 
                          ? "bg-emerald-50/50 border-emerald-250 text-emerald-900 shadow-sm"
                          : "bg-slate-50/50 border-slate-150 text-slate-400 grayscale opacity-45"
                      }`}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <h5 className="font-extrabold text-[11px] leading-none text-slate-800">{badge.title}</h5>
                      <span className="text-[8.5px] text-slate-400 block font-bold uppercase leading-none">
                        {isUnlocked ? "ปลดล็อคแล้ว ✓" : " LOCKED "}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
