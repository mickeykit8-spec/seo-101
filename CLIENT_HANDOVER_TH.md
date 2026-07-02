# เอกสารส่งมอบโปรเจกต์ SEO Academy

## ภาพรวม

โปรเจกต์นี้เป็นเว็บแอป React + Vite + TypeScript พร้อม Express server สำหรับแพลตฟอร์ม SEO Academy รองรับหน้าเรียนรู้ SEO, บทความ, เครื่องมือวิเคราะห์ SEO, GMB, PageSpeed, AI Overviews และ Generative Engine Optimization

## สิ่งที่รวมในแพ็กเกจ

- Source code สำหรับ frontend และ backend
- Production build ในโฟลเดอร์ `dist`
- ไฟล์ SEO สำหรับ crawler ใน `public`
- ตัวอย่าง environment variables ใน `.env.example`
- คู่มือใช้งานและตั้งค่าใน `README.md`
- Script สำหรับ generate SEO files, build, run และตรวจ TypeScript

## สิ่งที่ไม่รวมในแพ็กเกจ

- `node_modules`
- ไฟล์ `.env` จริงหรือ secret จริง
- log ไฟล์จากเครื่องพัฒนา
- Git metadata และไฟล์ภายในของ Codex/agent

## การติดตั้ง

```bash
npm install
```

## การตั้งค่า Environment

คัดลอก `.env.example` เป็น `.env` แล้วตั้งค่าตามระบบจริง

```bash
cp .env.example .env
```

ค่าที่ควรแก้ก่อน deploy จริง:

- `GEMINI_API_KEY`
- `APP_URL`
- `VITE_SITE_URL`
- `VITE_SITE_NAME`
- `VITE_DEFAULT_OG_IMAGE`
- `VITE_STORYBLOK_TOKEN`
- `VITE_GA4_ID`
- `VITE_CLARITY_ID`
- `VITE_HOTJAR_ID`
- `VITE_GSC_VERIFICATION`
- `VITE_BING_VERIFICATION`

หมายเหตุ: ห้ามใส่ secret ที่ต้องปิดเป็นความลับไว้ในตัวแปร `VITE_*` เพราะค่ากลุ่มนี้จะถูกส่งไปยัง browser

## การรัน Development

```bash
npm run dev
```

เปิดใช้งานที่:

```text
http://localhost:3000
```

## การ Build และรัน Production

```bash
npm run build
npm start
```

## จุดที่ต้องแก้ก่อนใช้งานจริง

1. เปลี่ยน domain placeholder จาก `https://seo-academy.example.com` เป็น domain จริง
2. ตั้งค่า analytics และ webmaster verification ตามบัญชีของลูกค้า
3. ตั้งค่า Storyblok token ถ้าต้องการแก้เนื้อหาผ่าน CMS
4. ตรวจสอบ `GEMINI_API_KEY` กับ hosting จริง
5. หากต้องการข้อมูล SEO จริง 100% ควรเชื่อมต่อ API ภายนอก เช่น PageSpeed Insights, Search Console หรือ backlink provider แทน fallback simulator
6. เพิ่ม rate limit และ production monitoring สำหรับ endpoint `/api/analyze-seo`

## รายการตรวจรับก่อน Deploy

```bash
npm run lint
npm run build
```

ตรวจ URL สำคัญ:

```text
/
/Blog
/BlogPost
/BlogPost/seo-basics-guide-2026
/SEOTools
/GmbTools
/ClassicSEO
/AIOverviews
/GenerativeEngine
/CoreUpdates
/PageSpeed
/sitemap.xml
/robots.txt
/llms.txt
/api/analyze-seo
```

## สรุปสถานะส่งมอบ

โปรเจกต์พร้อมส่งมอบในรูปแบบ source + production build โดยไม่มี dependency หนักหรือ secret จริงในแพ็กเกจ ลูกค้าสามารถติดตั้ง dependency ใหม่ด้วย `npm install` และ deploy ด้วยคำสั่ง `npm run build` / `npm start`
