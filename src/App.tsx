import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Games from "./pages/Games";
import SEOTools from "./pages/SEOTools";
import GmbTools from "./pages/GmbTools";
import ClassicSEO from "./pages/ClassicSEO";
import AIOverviews from "./pages/AIOverviews";
import GenerativeEngine from "./pages/GenerativeEngine";
import CoreUpdates from "./pages/CoreUpdates";
import PageSpeedTest from "./pages/PageSpeedTest";

// Helper component to reset window scroll position when changing routes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Blog" element={<Blog />} />
            <Route path="/BlogPost" element={<BlogPost />} />
            <Route path="/Games" element={<Games />} />
            <Route path="/SEOTools" element={<SEOTools />} />
            <Route path="/GmbTools" element={<GmbTools />} />
            <Route path="/ClassicSEO" element={<ClassicSEO />} />
            <Route path="/AIOverviews" element={<AIOverviews />} />
            <Route path="/GenerativeEngine" element={<GenerativeEngine />} />
            <Route path="/CoreUpdates" element={<CoreUpdates />} />
            <Route path="/PageSpeed" element={<PageSpeedTest />} />
            {/* Catch-all fallback navigation redirect */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
