import React, { useRef, useEffect, useState } from 'react';
import { useResumeStore } from '../store';
import { Translation, TemplateId } from '../types';
import { Editor } from './Editor';
import { Preview } from './Preview';
import { AdSpace } from './AdSpace';
import { SHOW_ADS } from '../constants';
import { generateLatex, generateDocx, downloadFile } from '../utils';
import {
  User, Briefcase, FolderGit2, GraduationCap, Award, Zap, Eye,
  ChevronRight, ChevronLeft, Download, Printer, FileText, Code,
  CheckCircle2, Loader2
} from 'lucide-react';

interface BuilderProps {
  t: Translation;
}

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore();
  const stepperRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const steps = [
    { id: 0, label: t.steps.personal, icon: User },
    { id: 1, label: t.steps.experience, icon: Briefcase },
    { id: 2, label: t.steps.projects, icon: FolderGit2 },
    { id: 3, label: t.steps.education, icon: GraduationCap },
    { id: 4, label: t.steps.certifications, icon: Award },
    { id: 5, label: t.steps.skills, icon: Zap },
    { id: 6, label: t.steps.preview, icon: Eye },
  ];

  const templates: { id: TemplateId; name: string }[] = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
  ];

  useEffect(() => {
    if (stepperRef.current) {
      const activeBtn = stepperRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handlePdfExport = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    setIsGeneratingPdf(true);

    // @ts-ignore
    if (typeof html2pdf === 'undefined') {
      window.print();
      setIsGeneratingPdf(false);
      return;
    }

    const opt = {
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    try {
      // @ts-ignore
      const worker = html2pdf().set(opt).from(element).toCanvas();
      const canvas = await worker.get('canvas');

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // @ts-ignore
      const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
      const pdf = new jsPDF(opt.jsPDF);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save('resume.pdf');
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleLatexExport = () => {
    const latex = generateLatex(resume, t);
    downloadFile(latex, 'resume.tex', 'text/x-tex');
  };

  const handleDocxExport = async () => {
    const blob = await generateDocx(resume, t);
    downloadFile(
      blob,
      'resume.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  };

  const maxStep = 6;
  const isPreview = currentStep === maxStep;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)]">
      {/* STEPPER */}
      <div className="sticky top-16 z-30 bg-white border-b no-print">
        <div className="max-w-7xl mx-auto">
          <div
            ref={stepperRef}
            className="flex gap-2 overflow-x-auto px-4 py-3"
          >
            {steps.map(step => {
              const Icon = step.icon;
              const active = currentStep === step.id;
              const done = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setStep(step.id)}
                  data-active={active}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
                    active
                      ? 'bg-slate-900 text-white'
                      : done
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-white text-slate-500'
                  }`}
                >
                  {done ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-grow bg-slate-50">
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-32">
          {!isPreview && (
            <div className="max-w-2xl mx-auto">
              <Editor t={t} />
              {SHOW_ADS && <AdSpace className="h-24 mt-8" />}
            </div>
          )}

          {isPreview && (
            <div className="flex flex-col gap-8">
              {/* ACTIONS */}
              <div className="bg-white rounded-xl p-6 no-print">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handlePdfExport}
                    disabled={isGeneratingPdf}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold"
                  >
                    {isGeneratingPdf ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Printer size={18} />
                    )}
                    PDF
                  </button>

                  <button
                    onClick={handleDocxExport}
                    className="flex items-center justify-center gap-2 border px-4 py-3 rounded-xl font-bold"
                  >
                    <FileText size={18} /> Word
                  </button>

                  <button
                    onClick={handleLatexExport}
                    className="flex items-center justify-center gap-2 border px-4 py-3 rounded-xl font-bold"
                  >
                    <Code size={18} /> LaTeX
                  </button>
                </div>

                <div className="flex gap-3 mt-6 overflow-x-auto">
                  {templates.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={`px-5 py-2 rounded-xl font-bold border ${
                        resume.templateId === tpl.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-white'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* PREVIEW */}
              <div className="overflow-x-auto">
                <div className="min-w-[210mm] origin-top scale-[0.9] md:scale-100">
                  <Preview t={t} />
                </div>
              </div>

              <AdSpace className="h-24" />
            </div>
          )}
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 no-print">
        <div className="max-w-4xl mx-auto flex gap-4">
          <button
            disabled={currentStep === 0}
            onClick={() => setStep(Math.max(0, currentStep - 1))}
            className="flex-1 border rounded-xl py-3 font-bold"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() =>
              setStep(isPreview ? 0 : Math.min(maxStep, currentStep + 1))
            }
            className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-bold"
          >
            {isPreview ? 'Edit' : 'Next'}
            {!isPreview && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
