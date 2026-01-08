import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Translation } from '../types';

interface SeoProps {
  t: Translation;
  lang: string;
}

export const Seo: React.FC<SeoProps> = ({ t, lang }) => {
  const location = useLocation();
  const baseUrl = window.location.origin + window.location.pathname; // Handling base URL correctly for SPA

  useEffect(() => {
    // 1. Update Title
    document.title = t.metaTitle;
    document.documentElement.lang = lang;

    // 2. Helper to update/create meta tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Helper to update/create link tags
    const updateLink = (rel: string, href: string, hreflang?: string) => {
      let selector = `link[rel="${rel}"]`;
      if (hreflang) selector += `[hreflang="${hreflang}"]`;
      
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (hreflang) element.setAttribute('hreflang', hreflang);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 4. Update Standard Meta Tags
    updateMeta('description', t.metaDesc);
    updateMeta('keywords', t.metaKeywords);
    updateMeta('author', 'HiResume');
    updateMeta('robots', 'index, follow');

    // 5. Update Open Graph (Facebook/LinkedIn)
    updateMeta('og:title', t.metaTitle, 'property');
    updateMeta('og:description', t.metaDesc, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:url', window.location.href, 'property');
    updateMeta('og:site_name', 'HiResume', 'property');
    // Using a placeholder image or generating one dynamically would be ideal
    // updateMeta('og:image', `${baseUrl}og-image.jpg`, 'property'); 

    // 6. Update Twitter Cards
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', t.metaTitle);
    updateMeta('twitter:description', t.metaDesc);

    // 7. Update Canonical & Hreflang
    // Assuming the app is deployed at root. Adjust logic if using hash router for SEO, 
    // though HashRouter is generally bad for SEO. 
    // Since we are using HashRouter in App.tsx, standard crawlers might struggle, 
    // but we still provide the tags for modern crawlers (like Google's) that render JS.
    
    // We construct a clean "canonical" URL assuming the hash strategy is temporary or handled by JS.
    const path = location.pathname === '/' ? '' : location.pathname;
    
    // Canonical for current page
    updateLink('canonical', `${window.location.origin}/#/${lang}${path}`);

    // Hreflang for language alternates
    // Note: Google recommends full absolute URLs
    updateLink('alternate', `${window.location.origin}/#/en${path}`, 'en');
    updateLink('alternate', `${window.location.origin}/#/fr${path}`, 'fr');
    updateLink('alternate', `${window.location.origin}/#/es${path}`, 'es');
    updateLink('alternate', `${window.location.origin}/#/en${path}`, 'x-default');

    // 8. JSON-LD Structured Data (SoftwareApplication)
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HiResume",
      "operatingSystem": "Web Browser",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": t.metaDesc,
      "featureList": "Resume Builder, PDF Export, ATS Friendly, Privacy Focused, No Signup"
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

  }, [lang, t, location]);

  return null;
};