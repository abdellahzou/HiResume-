import React from 'react';
import { Link } from 'react-router-dom';
import { Translation } from '../types';
import { SHOW_ADS } from '../constants';
import { AdSpace } from './AdSpace';
import { ShieldCheck, FileText, Download, CheckCircle, Zap, Eye, ChevronRight, Star } from 'lucide-react';

interface LandingProps {
  t: Translation;
  lang: string;
}

export const Landing: React.FC<LandingProps> = ({ t, lang }) => {
  
  const scrollToTemplates = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('templates');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="text-center space-y-8 px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t.landing.stats.users}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
            {t.landing.heroTitle.split(' ').map((word, i) => 
              i === 3 || i === 4 ? <span key={i} className="text-blue-600">{word} </span> : <span key={i}>{word} </span>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto text-balance font-light leading-relaxed">
            {t.landing.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              to={`/${lang}/builder`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200"
            >
              {t.landing.cta} <ChevronRight className="ml-2" />
            </Link>
            <a
              href="#templates"
              onClick={scrollToTemplates}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-gray-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
            >
              {t.landing.ctaSecondary}
            </a>
          </div>

          <div className="pt-8 flex justify-center gap-8 text-sm font-medium text-slate-500">
             <div className="flex items-center gap-2">
               <CheckCircle size={16} className="text-green-500"/> {t.landing.stats.downloads}
             </div>
             <div className="flex items-center gap-2">
               <ShieldCheck size={16} className="text-green-500"/> {t.landing.stats.cost}
             </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-16 mx-auto max-w-5xl px-4 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative rounded-xl bg-gray-900 ring-1 ring-gray-900/10 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1]">
            {/* Browser Header */}
            <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {/* UI Mockup Content */}
             <div className="flex h-full bg-white">
                <div className="w-1/4 border-r bg-gray-50 p-4 space-y-3 hidden md:block">
                   <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                   <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                   <div className="h-20 bg-blue-50 rounded border border-blue-100 mt-4"></div>
                   <div className="h-20 bg-white rounded border border-gray-100"></div>
                </div>
                <div className="flex-1 p-8 bg-gray-100 flex justify-center">
                   <div className="w-[210mm] h-full bg-white shadow-lg p-8 transform scale-75 origin-top">
                      <div className="h-8 w-1/2 bg-gray-800 mb-4"></div>
                      <div className="h-4 w-1/3 bg-gray-400 mb-8"></div>
                      <div className="space-y-4">
                         <div className="h-2 w-full bg-gray-100"></div>
                         <div className="h-2 w-full bg-gray-100"></div>
                         <div className="h-2 w-3/4 bg-gray-100"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. AD SPACE - LEADERBOARD */}
      {SHOW_ADS && (
        <div className="max-w-4xl mx-auto w-full px-4">
          <AdSpace className="h-24" label="Ad Space (High Visibility Leaderboard)" />
        </div>
      )}

      {/* 3. SOCIAL PROOF */}
      <section className="text-center px-4">
         <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-8">{t.landing.trustedBy}</p>
         <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos - purely CSS text for now to avoid assets */}
            {['TechCorp', 'Innovate', 'FutureSystems', 'GlobalWeb', 'AlphaDesign'].map(logo => (
              <span key={logo} className="text-xl font-bold font-serif text-slate-800">{logo}</span>
            ))}
         </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t.landing.featuresTitle}</h2>
           <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">{t.landing.feature1Title}</h3>
            <p className="text-slate-600 leading-relaxed">{t.landing.feature1Desc}</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">{t.landing.feature2Title}</h3>
            <p className="text-slate-600 leading-relaxed">{t.landing.feature2Desc}</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Download size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">{t.landing.feature3Title}</h3>
            <p className="text-slate-600 leading-relaxed">{t.landing.feature3Desc}</p>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-24 -skew-y-2 relative overflow-hidden">
        <div className="skew-y-2 max-w-7xl mx-auto px-4 relative z-10">
           <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{t.landing.howItWorksTitle}</h2>
           <div className="grid md:grid-cols-3 gap-12">
              {t.landing.howItWorksSteps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-full bg-blue-600 text-xl font-bold flex items-center justify-center mb-6 border-4 border-slate-800 shadow-[0_0_0_8px_rgba(59,130,246,0.3)]">
                     {idx + 1}
                   </div>
                   <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                   <p className="text-slate-400">{step.desc}</p>
                   {idx < 2 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>}
                </div>
              ))}
           </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
      </section>

      {/* 6. TEMPLATES SHOWCASE */}
      <section id="templates" className="max-w-7xl mx-auto px-4 pt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t.landing.templatesTitle}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t.landing.templatesDesc}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
           {/* Template Thumbnails (CSS Representations) */}
           {['Modern', 'Classic', 'Minimal', 'Professional', 'Creative', 'Executive'].map((style, i) => (
             <div key={style} className="group relative bg-gray-100 rounded-xl overflow-hidden aspect-[1/1.41] shadow-md hover:shadow-2xl transition-all border border-gray-200">
                <div className="absolute inset-0 bg-white p-4 transform transition-transform group-hover:scale-105">
                   {/* Abstract Resume Shapes */}
                   <div className={`h-full w-full flex flex-col gap-2 ${i % 2 === 0 ? 'items-start' : 'items-center'}`}>
                      <div className="w-1/2 h-4 bg-slate-800 mb-2"></div>
                      <div className="w-full h-2 bg-slate-200"></div>
                      <div className="w-full h-2 bg-slate-200"></div>
                      <div className="w-2/3 h-2 bg-slate-200 mb-4"></div>
                      <div className="w-full flex-1 bg-slate-50 border border-dashed border-slate-200"></div>
                   </div>
                </div>
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors flex items-center justify-center">
                   <Link to={`/${lang}/builder`} className="opacity-0 group-hover:opacity-100 bg-white text-slate-900 font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Use {style}
                   </Link>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur p-3 border-t text-center font-medium text-sm">
                   {style}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 7. FAQ ACCORDION (Good for Rich Snippets) */}
      <section className="max-w-3xl mx-auto px-4 w-full">
         <h2 className="text-3xl font-bold text-center mb-10">{t.landing.faqTitle}</h2>
         <div className="space-y-4">
            {t.landing.faqItems.map((item, idx) => (
              <details key={idx} className="group bg-white rounded-xl shadow-sm border border-gray-100 open:ring-2 open:ring-blue-100">
                 <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-slate-900 marker:content-none hover:bg-gray-50 rounded-xl transition">
                    {item.q}
                    <ChevronRight className="h-5 w-5 text-slate-400 transition group-open:rotate-90" />
                 </summary>
                 <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-gray-50 pt-4">
                    {item.a}
                 </div>
              </details>
            ))}
         </div>
      </section>

      {/* 8. SEO TEXT BLOCK (Bottom of page content) */}
      <section className="bg-gray-50 py-16">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">{t.landing.seoTitle}</h2>
            <p className="text-slate-600 leading-loose text-justify">
               {t.landing.seoContent}
            </p>
         </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="text-center px-4 pb-12">
         <div className="bg-blue-600 text-white rounded-3xl p-12 md:p-20 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">{t.landing.heroTitle}</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">{t.landing.heroSubtitle}</p>
            <Link
              to={`/${lang}/builder`}
              className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
            >
              {t.landing.cta} <ChevronRight className="ml-2" />
            </Link>
         </div>
      </section>

    </div>
  );
};