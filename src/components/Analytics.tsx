import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getMetaEnv(): Record<string, string | undefined> {
  return ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {});
}

function appendScript(id: string, options: { src?: string; text?: string; async?: boolean }) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  if (options.src) script.src = options.src;
  if (options.text) script.text = options.text;
  if (options.async) script.async = true;
  document.head.appendChild(script);
}

export default function Analytics() {
  const location = useLocation();
  const env = getMetaEnv();
  const ga4Id = env.VITE_GA4_ID?.trim();
  const clarityId = env.VITE_CLARITY_ID?.trim();
  const hotjarId = env.VITE_HOTJAR_ID?.trim();

  useEffect(() => {
    if (ga4Id) {
      appendScript("ga4-loader", {
        src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`,
        async: true,
      });

      appendScript("ga4-init", {
        text: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          window.gtag('js', new Date());
          window.gtag('config', ${JSON.stringify(ga4Id)}, { send_page_view: false });
        `,
      });
    }

    if (clarityId) {
      appendScript("clarity-init", {
        text: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", ${JSON.stringify(clarityId)});
        `,
      });
    }

    if (hotjarId) {
      appendScript("hotjar-init", {
        text: `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${Number(hotjarId) || 0},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
      });
    }
  }, [clarityId, ga4Id, hotjarId]);

  useEffect(() => {
    if (!ga4Id || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [ga4Id, location.pathname, location.search]);

  return null;
}
