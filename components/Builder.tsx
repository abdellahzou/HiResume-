import React from 'react';
import { useResumeStore } from '../store';
import { Translation, TemplateId } from '../types';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { AdSpace } from './AdSpace';
import { SHOW_ADS } from '../constants';
import { generateLatex, generateDocx, downloadFile } from '../utils';
import { ChevronRight, ChevronLeft, Printer, Code, Save, Layout, FileText } from 'lucide-react';

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

    // Use html2pdf global from the script tag in index.html
    // @ts-ignore
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      // @ts-ignore
      html2pdf().set(opt).from(element).save();
    } else {
      // Fallback if script fails to load
      window.print();
    }
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
            {/* Toolbar for Preview */}
            <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between no-print sticky top-20 z-40">
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                 {templates.map(tmpl => (
                   <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
                      resume.templateId === tmpl.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                   >
                     {tmpl.name}
                   </button>
                 ))}
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button onClick={handlePdfExport} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold uppercase tracking-wide transition-colors">
                    <Printer size={16} /> PDF
                  </button>
                  <button onClick={handleLatexExport} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-xs font-bold uppercase tracking-wide transition-colors">
                    <Code size={16} /> LaTeX
                  </button>
                  <button onClick={handleDocxExport} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-xs font-bold uppercase tracking-wide transition-colors">
                    <FileText size={16} /> DOCX
                  </button>
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