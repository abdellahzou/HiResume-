import React from 'react';
import { Translation } from '../types';
import { AdSpace } from './AdSpace';

interface LegalProps {
  t: Translation;
  type: 'privacy' | 'terms' | 'faq' | 'contact';
}

export const Legal: React.FC<LegalProps> = ({ t, type }) => {
  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">{t.legal.privacyTitle}</h1>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {t.legal.privacyContent.map((paragraph, idx) => (
                <p key={idx} className="p-2 bg-white rounded border border-gray-100 shadow-sm">{paragraph}</p>
              ))}
            </div>
          </>
        );
      case 'terms':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">{t.legal.termsTitle}</h1>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {t.legal.termsContent.map((paragraph, idx) => (
                <p key={idx} className="p-2 bg-white rounded border border-gray-100 shadow-sm">{paragraph}</p>
              ))}
            </div>
          </>
        );
      case 'faq':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">{t.legal.faqTitle}</h1>
            <div className="space-y-6">
              {t.legal.faqContent.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.q}</h3>
                  <p className="text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">{t.legal.contactTitle}</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
              <p className="text-lg text-slate-700 mb-6">{t.legal.contactDesc}</p>
              <a 
                href="mailto:abdellahmadinadz@gmail.com" 
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
              >
                abdellahmadinadz@gmail.com
              </a>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-12 px-4">
      {renderContent()}
      
      {/* Ad Space Footer of Legal Page */}
       <AdSpace className="mt-12 h-24" label="Ad Space (Legal Footer)" />
    </div>
  );
};