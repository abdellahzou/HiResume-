import React, { useState, useRef } from 'react';
import { Translation, AtsResult } from '../types';
import { extractTextFromPdf, extractTextFromDocx, analyzeResume } from '../utils';
import { UploadCloud, CheckCircle, AlertCircle, FileText, ChevronDown, ChevronUp, RefreshCw, Lock, BarChart3 } from 'lucide-react';
import { AdSpace } from './AdSpace';

interface AtsCheckerProps {
  t: Translation;
}

export const AtsChecker: React.FC<AtsCheckerProps> = ({ t }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      await processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    // Reset state
    setFile(selectedFile);
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      let text = '';
      if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
        text = await extractTextFromPdf(selectedFile);
      } else if (selectedFile.name.toLowerCase().endsWith('.docx')) {
        text = await extractTextFromDocx(selectedFile);
      } else {
        throw new Error('Unsupported file type. Please upload PDF or DOCX.');
      }

      if (!text || text.trim().length === 0) {
          throw new Error('Could not extract text. If this is a PDF, ensure it is not an image scan.');
      }

      // Fake delay for UX (so user sees "Analyzing...")
      setTimeout(() => {
        const analysis = analyzeResume(text, selectedFile.name);
        setResult(analysis);
        setIsAnalyzing(false);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error parsing file.');
      setIsAnalyzing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreBg = (score: number) => {
      if (score >= 80) return 'bg-green-100 border-green-200';
      if (score >= 60) return 'bg-yellow-50 border-yellow-200';
      return 'bg-red-50 border-red-200';
  };

  // -- RENDER: ANALYSIS RESULT VIEW --
  if (result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b pb-8">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.ats.scoreTitle}</h1>
                  <p className="text-gray-500">{t.ats.scoreSubtitle}</p>
               </div>
               <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-8 ${getScoreBg(result.score).replace('bg-', 'border-')} ${getScoreColor(result.score)}`}>
                  <span className="text-4xl font-extrabold">{result.score}</span>
                  <span className="text-xs font-bold uppercase">/ 100</span>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8">
               {/* Strengths */}
               <div>
                  <h3 className="flex items-center gap-2 font-bold text-green-700 mb-4 uppercase text-sm tracking-wide">
                     <CheckCircle size={18} /> {t.ats.strengths}
                  </h3>
                  <ul className="space-y-3">
                     {result.strengths.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-100">
                           <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                           {s}
                        </li>
                     ))}
                     {result.strengths.length === 0 && <p className="text-gray-400 italic text-sm">No specific strengths detected.</p>}
                  </ul>
               </div>

               {/* Improvements */}
               <div>
                  <h3 className="flex items-center gap-2 font-bold text-red-700 mb-4 uppercase text-sm tracking-wide">
                     <AlertCircle size={18} /> {t.ats.improvements}
                  </h3>
                  <ul className="space-y-3">
                     {result.improvements.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-100">
                           <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                           {s}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t">
               <h3 className="font-bold text-gray-900 mb-6">{t.ats.breakdown}</h3>
               <div className="space-y-4">
                  <ScoreBar label={t.ats.categories.sections} score={result.breakdown.sections} max={20} />
                  <ScoreBar label={t.ats.categories.keywords} score={result.breakdown.keywords} max={30} />
                  <ScoreBar label={t.ats.categories.formatting} score={result.breakdown.formatting} max={15} />
                  <ScoreBar label={t.ats.categories.skills} score={result.breakdown.skills} max={15} />
                  <ScoreBar label={t.ats.categories.clarity} score={result.breakdown.clarity} max={20} />
               </div>
            </div>

            <div className="mt-8 flex justify-center">
               <button 
                 onClick={() => { setFile(null); setResult(null); }}
                 className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
               >
                  <RefreshCw size={18} /> {t.ats.reupload}
               </button>
            </div>
         </div>
         <AdSpace className="h-24" />
      </div>
    );
  }

  // -- RENDER: UPLOAD / LANDING VIEW --
  return (
    <div className="flex flex-col gap-16">
      <div className="max-w-3xl mx-auto w-full text-center space-y-6 pt-10">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <Lock size={12} /> {t.ats.privacy}
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t.ats.heroTitle}</h1>
         <p className="text-xl text-slate-600">{t.ats.heroSubtitle}</p>
         
         {/* Upload Card */}
         <div 
            className={`mt-10 p-10 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isAnalyzing ? 'bg-gray-50 border-blue-200' : 'bg-white border-blue-100 hover:border-blue-400 hover:shadow-lg'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
         >
            <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept=".pdf,.docx" 
               onChange={handleFileChange}
            />
            
            <div className="flex flex-col items-center gap-4">
               {isAnalyzing ? (
                  <>
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                     <p className="text-lg font-medium text-slate-700">{t.ats.analyzing}</p>
                  </>
               ) : (
                  <>
                     <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <UploadCloud size={32} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-slate-900">{t.ats.uploadTitle}</h3>
                        <p className="text-slate-500 mt-1">{t.ats.uploadDesc}</p>
                     </div>
                     <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">PDF or DOCX</span>
                  </>
               )}
            </div>
         </div>
         {error && <p className="text-red-500 font-medium mt-4">{error}</p>}
      </div>
      
      <AdSpace className="max-w-4xl mx-auto w-full h-24" />

      {/* SEO Content Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 px-4">
         <div className="space-y-6">
            <div className="flex gap-4">
               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <BarChart3 size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.ats.landing.whyMatters}</h3>
                  <p className="text-slate-600 leading-relaxed">{t.ats.landing.whyMattersDesc}</p>
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.ats.landing.howWorks}</h3>
                  <p className="text-slate-600 leading-relaxed">{t.ats.landing.howWorksDesc}</p>
               </div>
            </div>

            <div className="flex gap-4">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <Lock size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.ats.landing.privacyTitle}</h3>
                  <p className="text-slate-600 leading-relaxed">{t.ats.landing.privacyDesc}</p>
               </div>
            </div>
         </div>

         <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t.landing.faqTitle}</h3>
            <div className="space-y-4">
               {t.ats.landing.faq.map((item, i) => (
                  <details key={i} className="group bg-white rounded-lg border border-gray-100 shadow-sm">
                     <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-slate-900">
                        {item.q}
                        <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition" />
                     </summary>
                     <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-gray-50 pt-3">
                        {item.a}
                     </div>
                  </details>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

// Helper Component for Score Bars
const ScoreBar = ({ label, score, max }: { label: string, score: number, max: number }) => {
   const percentage = Math.min((score / max) * 100, 100);
   return (
      <div>
         <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="font-bold text-gray-900">{Math.round(score)} / {max}</span>
         </div>
         <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
               className={`h-full rounded-full transition-all duration-1000 ${percentage > 75 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
               style={{ width: `${percentage}%` }}
            ></div>
         </div>
      </div>
   );
};