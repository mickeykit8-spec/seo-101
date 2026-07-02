import { ReactNode, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Analytics from "./components/Analytics";
import Navbar from "./components/Navbar";
import PageCMSRoute from "./components/PageCMSRoute";
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
import { SITE_ROUTES_BY_KEY, SitePageDefinition } from "./utils/site";

// Helper component to reset window scroll position when changing routes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function withCMS(definition: SitePageDefinition, element: ReactNode, disableSeo = false) {
  return (
    <PageCMSRoute definition={definition} disableSeo={disableSeo}>
      {element}
    </PageCMSRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between overflow-x-hidden">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={withCMS(SITE_ROUTES_BY_KEY.home, <Home />)} />
            <Route path="/Blog" element={withCMS(SITE_ROUTES_BY_KEY.blog, <Blog />)} />
            <Route path="/BlogPost" element={withCMS(SITE_ROUTES_BY_KEY.blogPost, <BlogPost />, true)} />
            <Route path="/BlogPost/:id" element={withCMS(SITE_ROUTES_BY_KEY.blogPost, <BlogPost />, true)} />
            <Route path="/Games" element={withCMS(SITE_ROUTES_BY_KEY.games, <Games />)} />
            <Route path="/SEOTools" element={withCMS(SITE_ROUTES_BY_KEY.seoTools, <SEOTools />)} />
            <Route path="/GmbTools" element={withCMS(SITE_ROUTES_BY_KEY.gmbTools, <GmbTools />)} />
            <Route path="/ClassicSEO" element={withCMS(SITE_ROUTES_BY_KEY.classicSeo, <ClassicSEO />)} />
            <Route path="/AIOverviews" element={withCMS(SITE_ROUTES_BY_KEY.aiOverviews, <AIOverviews />)} />
            <Route path="/GenerativeEngine" element={withCMS(SITE_ROUTES_BY_KEY.generativeEngine, <GenerativeEngine />)} />
            <Route path="/CoreUpdates" element={withCMS(SITE_ROUTES_BY_KEY.coreUpdates, <CoreUpdates />)} />
            <Route path="/PageSpeed" element={withCMS(SITE_ROUTES_BY_KEY.pageSpeed, <PageSpeedTest />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
