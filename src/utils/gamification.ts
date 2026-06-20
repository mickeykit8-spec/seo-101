// Gamification engine for SEO 101

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  points: number;
  badges: string[]; // unlocked badge ids
  completedLessons: string[]; // completed lesson ids
  streak: number;
  lastActive?: string;
}

export const ALL_BADGES: Badge[] = [
  {
    id: "seo_novice",
    title: "SEO Novice 🎖️",
    description: "เริ่มต้นก้าวแรกสู่จักรวาลดันอันดับกูเกิล",
    icon: "🌱"
  },
  {
    id: "intent_master",
    title: "Intent Master 🧠",
    description: "ตอบควิซวิเคราะห์เจตนาผู้ค้นหา (Search Intent) ถูกต้องถ้วนหน้า",
    icon: "⚡"
  },
  {
    id: "rank_engineer",
    title: "Rank Engineer 🏆",
    description: "สลับจัดอันดับตามดัชนีคะแนนโดเมนและ Backlinks ได้อย่างแม่นยำ",
    icon: "📊"
  },
  {
    id: "page_squasher",
    title: "On-Page Squasher 🛠️",
    description: "แก้ไขโค้ด HTML แย่ๆ (H1/Alt/Title) ให้ถูกต้องตามหลัก SEO สากล",
    icon: "🐛"
  },
  {
    id: "meta_architect",
    title: "Meta Architect ✍️",
    description: "แต่งคำพาดหัวและบทสรุป Meta Tag ได้ระยะตัวอักษรพอดีปลอดภัย",
    icon: "✨"
  },
  {
    id: "ai_pioneer",
    title: "AI Search Pioneer 🤖",
    description: "ศึกษาเจาะลึกความแตกต่างของ Google AIO และระบบ GEO ยุคใหม่",
    icon: "📡"
  },
  {
    id: "pricing_explorer",
    title: "Specialist Aspirant 💼",
    description: "เข้าเยี่ยมชมเปรียบเทียบตารางเรทแพ็คเกจระดับคุณภาพ 2026",
    icon: "🎯"
  }
];

const DEFAULT_PROFILE: UserProfile = {
  points: 120,
  badges: ["seo_novice"],
  completedLessons: [],
  streak: 1,
  lastActive: new Date().toDateString()
};

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem("seo_101_profile");
    if (stored) {
      const parsed = JSON.parse(stored) as UserProfile;
      // Guarantee initial badge
      if (!parsed.badges || parsed.badges.length === 0) {
        parsed.badges = ["seo_novice"];
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error parsing profile", err);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem("seo_101_profile", JSON.stringify(profile));
  // Dispatch event for reactive updates in other components
  window.dispatchEvent(new Event("seo_101_gamification_update"));
}

export function awardPoints(pts: number): UserProfile {
  const profile = getUserProfile();
  profile.points += pts;
  saveUserProfile(profile);
  return profile;
}

export function unlockBadge(badgeId: string): { profile: UserProfile; newlyUnlocked: boolean } {
  const profile = getUserProfile();
  if (profile.badges.includes(badgeId)) {
    return { profile, newlyUnlocked: false };
  }
  profile.badges.push(badgeId);
  // Award 150 bonus points on unlock badge!
  profile.points += 150;
  saveUserProfile(profile);
  return { profile, newlyUnlocked: true };
}

export function completeLesson(lessonId: string, ptReward: number = 50): { profile: UserProfile; newlyCompleted: boolean } {
  const profile = getUserProfile();
  if (profile.completedLessons.includes(lessonId)) {
    return { profile, newlyCompleted: false };
  }
  profile.completedLessons.push(lessonId);
  profile.points += ptReward;
  saveUserProfile(profile);
  return { profile, newlyCompleted: true };
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  badgeCount: number;
  title: string;
  isCurrentUser?: boolean;
}

export function getLeaderboard(): LeaderboardEntry[] {
  const profile = getUserProfile();
  
  const staticEnts: LeaderboardEntry[] = [
    { name: "คุณกิตติพงษ์ (SEO Guru)", points: 950, badgeCount: 6, title: "🥇 Professional Master" },
    { name: "คุณพิมลพรรณ (GEO Pioneer)", points: 820, badgeCount: 5, title: "🥈 Generative Expert" },
    { name: "คุณปิยะบุตร (Local SEO King)", points: 640, badgeCount: 4, title: "🥉 Maps Dominator" },
    { name: "คุณศิรินทรา (Content Craft)", points: 510, badgeCount: 3, title: "Topical Writer" },
    { name: "คุณอัครพงศ์ (Tech Audit)", points: 390, badgeCount: 2, title: "Site Crawler" }
  ];

  const userEntry: LeaderboardEntry = {
    name: "คุณ (ผู้ใช้งานปัจจุบัน)",
    points: profile.points,
    badgeCount: profile.badges.length,
    title: profile.points >= 800 ? "SEO Commander 👑" : profile.points >= 500 ? "SEO Specialist 🎓" : profile.points >= 250 ? "SEO Analyst 📖" : "SEO Pathseeker 🗺️",
    isCurrentUser: true
  };

  const all = [...staticEnts, userEntry];
  all.sort((a, b) => b.points - a.points);
  return all;
}
