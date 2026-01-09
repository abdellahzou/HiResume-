import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
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

const A4_HEIGHT_PX = 1122; // ≈ 297mm at 96dpi
const MIN_SCALE = 0.82;
const SCALE_STEP = 0.01;

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore();
  const stepperRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [fontScale, setFontScale] = useState(1);

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
      activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // 🔒 AUTO FONT SCALE TO FORCE 1 PAGE
  useLayoutEffect(() => {
    if (currentStep !== 6) return;
    const el = previewWrapperRef.current;
    if (!el) return;

    let scale = 1;
    el.style.setProperty('--resume-scale', `${scale}`);

    while (el.scrollHeight > A4_HEIGHT_PX && scale > MIN_SCALE) {
      scale -= SCALE_STEP;
      el.style.setProperty('--resume-scale', `${scale}`);
    }

    setFontScale(scale);
  }, [resume, currentStep, resume.templateId]);

  // ✅ HIGH QUALITY 1-PAGE PDF (NO STRETCH)
  const handlePdfExport = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    setIsGeneratingPdf(true);

    try {
      // @ts-ignore
      const worker = html2pdf().set({
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 4,
          backgroundColor: '#ffffff',
          useCORS: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(element).toCanvas();

      const canvas = await worker.get('canvas');
      const imgData = canvas.toDataURL('image/jpeg', 1);

      // @ts-ignore
      const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
      pdf.save('resume.pdf');

    } catch (e) {
      console.error(e);
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
    downloadFile(blob, 'resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  };

  const isPreview = currentStep === 6;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)]">

      {/* STEPPER */}
      <div className="sticky top-16 z-30 bg-white border-b no-print">
        <div ref={stepperRef} className="flex gap-2 overflow-x-auto px-4 py-3">
          {steps.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                data-active={currentStep === s.id}
                className={`px-4 py-2 rounded-full flex gap-2 items-center text-sm font-bold ${
                  currentStep === s.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border text-slate-500'
                }`}
              >
                <Icon size={16} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-grow bg-slate-50">
        <div className="max-w-4xl mx-auto p-6">

          {!isPreview && <Editor t={t} />}

          {isPreview && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm no-print">
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={handlePdfExport} disabled={isGeneratingPdf}
                    className="bg-blue-600 text-white py-3 rounded-xl font-bold">
                    {isGeneratingPdf ? 'Generating…' : 'PDF'}
                  </button>
                  <button onClick={handleDocxExport} className="border py-3 rounded-xl font-bold">Word</button>
                  <button onClick={handleLatexExport} className="border py-3 rounded-xl font-bold">LaTeX</button>
                </div>
              </div>

              {/* 🔒 LOCKED A4 PREVIEW */}
              <div className="mt-8 overflow-hidden">
                <div
                  ref={previewWrapperRef}
                  id="resume-preview"
                  style={{
                    width: '210mm',
                    height: '297mm',
                    transformOrigin: 'top left',
                    fontSize: `calc(1rem * var(--resume-scale, 1))`,
                    '--resume-scale': fontScale
                  } as React.CSSProperties}
                  className="bg-white shadow-lg mx-auto"
                >
                  <Preview t={t} />
                </div>
              </div>

              {SHOW_ADS && <AdSpace className="h-24 mt-6" />}
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 w-full bg-white border-t p-4 no-print">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button onClick={() => setStep(Math.max(0, currentStep - 1))}
            className="border px-6 py-3 rounded-xl font-bold">
            <ChevronLeft /> Back
          </button>
          <button onClick={() => setStep(Math.min(6, currentStep + 1))}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
            Next <ChevronRight />
          </button>
        </div>
      </div>

    </div>
  );
};
