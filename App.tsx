import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import { useResumeStore } from './store';
import { TRANSLATIONS } from './constants';
import { Builder } from './components/Builder';
import { Landing } from './components/Landing';
import { Legal } from './components/Legal';
import { Seo } from './components/Seo';
import { Language } from './types';
import { FileText, Languages, RefreshCw } from 'lucide-react';

const SiteLayout = ({ children }: { children?: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  
  // Validate language, default to 'en' if invalid
  const validLangs: Language[] = ['en', 'fr', 'es'];
  const currentLang = validLangs.includes(lang as Language) ? (lang as Language) : 'en';
  
  const t = TRANSLATIONS[currentLang];
  const { resetResume } = useResumeStore();

  const toggleLanguage = () => {
    // Cycle through available languages: en -> fr -> es -> en
    const currentIndex = validLangs.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % validLangs.length;
    const newLang = validLangs[nextIndex];

    // Navigate to the same page but in the new language
    const currentPath = window.location.hash.replace(`#/${currentLang}`, '');
    navigate(`/${newLang}${currentPath}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 print:bg-white text-slate-900">
      {/* Dynamic SEO Head Management */}
      <Seo t={t} lang={currentLang} />

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 no-print backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to={`/${currentLang}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 text-white p-1.5 rounded-md shadow-sm">
                <FileText size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">{t.nav.brand}</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to={`/${currentLang}/builder`} className="hidden sm:inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
                {t.nav.builder}
              </Link>
               <button
                onClick={resetResume}
                className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
                title={t.actions.reset}
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-700 transition-colors"
              >
                <Languages size={14} />
                {currentLang}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full p-4 md:p-6 gap-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 text-white p-1 rounded-md">
                        <FileText size={16} />
                    </div>
                    <span className="font-bold text-lg">{t.nav.brand}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{t.footer.disclaimer}</p>
                <p className="text-xs text-slate-400">{t.footer.copyright}</p>
            </div>
            <div className="col-span-1 md:col-span-3 flex flex-wrap gap-8 md:justify-end">
                <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-sm uppercase text-slate-400">Legal</h4>
                    <Link to={`/${currentLang}/privacy`} className="text-sm text-slate-600 hover:text-blue-600">{t.footer.privacy}</Link>
                    <Link to={`/${currentLang}/terms`} className="text-sm text-slate-600 hover:text-blue-600">{t.footer.terms}</Link>
                </div>
                 <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-sm uppercase text-slate-400">Support</h4>
                    <Link to={`/${currentLang}/contact`} className="text-sm text-slate-600 hover:text-blue-600">{t.footer.contact}</Link>
                    <Link to={`/${currentLang}/faq`} className="text-sm text-slate-600 hover:text-blue-600">{t.footer.faq}</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

// Wrapper components to pass props correctly to SiteLayout children
const LandingPage = () => {
    const { lang } = useParams<{ lang: string }>();
    const validLangs: Language[] = ['en', 'fr', 'es'];
    const currentLang = validLangs.includes(lang as Language) ? (lang as Language) : 'en';
    return <Landing t={TRANSLATIONS[currentLang]} lang={currentLang} />;
};

const BuilderPage = () => {
    const { lang } = useParams<{ lang: string }>();
    const validLangs: Language[] = ['en', 'fr', 'es'];
    const currentLang = validLangs.includes(lang as Language) ? (lang as Language) : 'en';
    return <Builder t={TRANSLATIONS[currentLang]} />;
};

const LegalPage = ({ type }: { type: 'privacy' | 'terms' | 'faq' | 'contact' }) => {
     const { lang } = useParams<{ lang: string }>();
    const validLangs: Language[] = ['en', 'fr', 'es'];
    const currentLang = validLangs.includes(lang as Language) ? (lang as Language) : 'en';
    return <Legal t={TRANSLATIONS[currentLang]} type={type} />;
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        
        {/* Language Routes */}
        <Route path="/:lang" element={<SiteLayout><LandingPage /></SiteLayout>} />
        <Route path="/:lang/builder" element={<SiteLayout><BuilderPage /></SiteLayout>} />
        
        {/* Legal Pages */}
        <Route path="/:lang/privacy" element={<SiteLayout><LegalPage type="privacy" /></SiteLayout>} />
        <Route path="/:lang/terms" element={<SiteLayout><LegalPage type="terms" /></SiteLayout>} />
        <Route path="/:lang/faq" element={<SiteLayout><LegalPage type="faq" /></SiteLayout>} />
        <Route path="/:lang/contact" element={<SiteLayout><LegalPage type="contact" /></SiteLayout>} />
      </Routes>
    </Router>
  );
};

export default App;