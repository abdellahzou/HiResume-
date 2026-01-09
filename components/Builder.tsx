import React from 'react';
import { useResumeStore } from '../store';
import { Translation, TemplateId } from '../types';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { AdSpace } from './AdSpace';
import { SHOW_ADS } from '../constants';
import { generateLatex, generateDocx, downloadFile } from '../utils';
import { ChevronRight, ChevronLeft, Printer, Code, FileText, Download } from 'lucide-react';

interface BuilderProps {
  t: Translation;
}

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore();

  const steps = [
    { id: 0, label: t.steps.personal },
    { id: 1, label: t.steps.experience },
    { id: 2, label: t.steps.projects },
    { id: 3, label: t.steps.education },
    { id: 4, label: t.steps.certifications },
    { id: 5, label: t.steps.skills },
    { id: 6, label: t.steps.preview },
  ];

  const templates: { id: TemplateId; name: string }[] = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
  ];

  const handlePdfExport = () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    // 1. Set a nice filename for the print job
    const originalTitle = document.title;
    const safeName = resume.personalInfo.fullName.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
    document.title = safeName ? `Resume_${safeName}` : 'Resume';

    // 2. Calculate Scaling
    // A4 height in pixels (96 DPI) is approx 1123px.
    // We want to fit content to 1 page if possible, or scale comfortably.
    const a4HeightPx = 1122; 
    
    // Reset to measure true height
    document.documentElement.style.setProperty('--print-scale', '1');
    const contentHeight = element.scrollHeight;
    
    let scale = 1;
    // If content is slightly larger than 1 page, scale it down to fit.
    // If it's huge (multi-page), we might let it flow or scale to 1 page depending on preference.
    // Here we try to fit single page if it's close.
    if (contentHeight > a4HeightPx) {
       // Add a buffer so it doesn't clip edges
       scale = (a4HeightPx - 20) / contentHeight;
       // Don't scale down ridiculously small
       scale = Math.max(scale, 0.6); 
    }

    // 3. Set CSS Variable for @media print
    document.documentElement.style.setProperty('--print-scale', scale.toString());

    // 4. Print (Browser generates Vector PDF)
    window.print();

    // 5. Cleanup
    document.title = originalTitle;
  };

  const handleLatexExport = () => {
    const latex = generateLatex(resume, t);
    downloadFile(latex, 'resume.tex', 'text/x-tex');
  };

  const handleDocxExport = async () => {
    const blob = await generateDocx(resume, t);
    downloadFile(blob, 'resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  };

  const maxStep = 6;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Left Side: Editor (Hidden in Print, Visible in Steps 0-5) */}
      <div className={`w-full md:w-1/3 flex flex-col gap-6 no-print ${currentStep === maxStep ? 'hidden md:flex' : ''}`}>
        
        {/* Progress Steps */}
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex flex-col gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentStep === step.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span>{step.label}</span>
                {currentStep === step.id && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Ad Placeholder 1 - Sidebar */}
        <AdSpace className="h-32" label="Ad Space (Sidebar)" />

        {/* Navigation Controls */}
          <div className="flex justify-between gap-4 mt-auto">
            <button
              disabled={currentStep === 0}
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> {t.actions.back}
            </button>
            <button
              onClick={() => setStep(Math.min(maxStep, currentStep + 1))}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              {currentStep === maxStep ? t.nav.preview : t.actions.next} <ChevronRight size={16} />
            </button>
          </div>
      </div>

      {/* Center/Right: Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Editor Form View */}
        {currentStep < maxStep && (
            <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[500px] flex flex-col">
              <Editor t={t} />
              
              {/* Ad Placeholder 2 (Inside Form Flow) */}
              {SHOW_ADS && (
                <div className="mt-8 pt-8 border-t border-dashed border-gray-200">
                   <AdSpace className="h-20" label="Ad Space (In-Flow)" />
                </div>
              )}
            </div>
        )}

        {/* Preview View */}
        <div className={`${currentStep === maxStep ? 'block' : 'hidden md:block'} flex-col gap-4`}>
            
            {/* Prominent Action Bar */}
            <div className="bg-white border-b border-gray-200 p-5 mb-2 rounded-xl shadow-md no-print sticky top-[4.5rem] z-30 transition-all">
              <div className="flex flex-col gap-5">
                 
                 {/* Row 1: Download Actions (Primary) */}
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                       <Download size={24} className="text-blue-600"/> 
                       Download Resume
                    </h3>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <button onClick={handlePdfExport} className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5" title="Save as PDF using browser dialog">
                           <Printer size={18} /> {t.actions.downloadPdf}
                        </button>
                        <button onClick={handleDocxExport} className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-3 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-lg font-bold shadow-sm transition-all">
                           <FileText size={18} /> Word
                        </button>
                        <button onClick={handleLatexExport} className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg font-bold shadow-sm transition-all">
                           <Code size={18} /> LaTeX
                        </button>
                    </div>
                 </div>

                 {/* Row 2: Template Selection (Secondary) */}
                 <div className="flex flex-col md:flex-row items-start md:items-center gap-3 pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                       {t.actions.changeTemplate}:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
                      {templates.map(tmpl => (
                         <button
                          key={tmpl.id}
                          onClick={() => setTemplateId(tmpl.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                            resume.templateId === tmpl.id 
                            ? 'bg-slate-800 text-white shadow-md ring-2 ring-slate-800 ring-offset-2' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                         >
                           {tmpl.name}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            {/* The Resume Paper */}
            <div className="overflow-auto pb-10 print:pb-0">
              <Preview t={t} />
            </div>
            
            {/* Ad Placeholder 3 (Bottom) */}
            <AdSpace className="h-24 mb-4" label="Ad Space (Bottom Banner)" />
        </div>
      </div>
    </div>
  );
};
