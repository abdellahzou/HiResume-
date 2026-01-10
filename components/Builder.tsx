"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useResumeStore } from "../store"
import type { Translation, TemplateId } from "../types"
import { Editor } from "./Editor"
import { Preview } from "./Preview"
import { AdSpace } from "./AdSpace"
import { SHOW_ADS } from "../constants"
import { generateLatex, generateDocx, downloadFile } from "../utils"
import { 
  Printer, Code, FileText, Download, CheckCircle2, 
  ChevronRight, ChevronLeft, Sparkles, Layout 
} from "lucide-react"

interface BuilderProps {
  t: Translation
}

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore()
  const stepperRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  const steps = [
    { id: 0, label: t.steps.personal },
    { id: 1, label: t.steps.experience },
    { id: 2, label: t.steps.projects },
    { id: 3, label: t.steps.education },
    { id: 4, label: t.steps.certifications },
    { id: 5, label: t.steps.skills },
    { id: 6, label: t.steps.preview },
  ]

  const templates: { id: TemplateId; name: string }[] = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" },
    { id: "minimal", name: "Minimal" },
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "executive", name: "Executive" },
  ]

  // Simulate a "Saving" effect when resume data changes
  useEffect(() => {
    setIsSaving(true)
    const timeout = setTimeout(() => setIsSaving(false), 800)
    return () => clearTimeout(timeout)
  }, [resume])

  useEffect(() => {
    if (stepperRef.current) {
      const activeBtn = stepperRef.current.querySelector('[data-active="true"]')
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [currentStep])

  const handlePdfExport = () => {
    const originalTitle = document.title
    const safeName = resume.personalInfo.fullName.replace(/[^a-z0-9]/gi, "_").substring(0, 20)
    document.title = safeName ? `Resume_${safeName}` : "Resume"
    window.print()
    document.title = originalTitle
  }

  const handleLatexExport = () => {
    const latex = generateLatex(resume, t)
    downloadFile(latex, "resume.tex", "text/x-tex")
  }

  const handleDocxExport = async () => {
    const blob = await generateDocx(resume, t)
    downloadFile(blob, "resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased text-slate-900">
      
      {/* 1. TOP NAVIGATION / STEPPER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex-none no-print">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div 
            className="flex items-center justify-start md:justify-center gap-3 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-2" 
            ref={stepperRef}
          >
            {steps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center gap-3 md:gap-8 flex-shrink-0">
                  <button
                    onClick={() => setStep(step.id)}
                    data-active={isActive}
                    className="group flex items-center gap-3 outline-none"
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                      ${isActive 
                        ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110" 
                        : isCompleted 
                          ? "bg-emerald-500 text-white" 
                          : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}
                    `}>
                      {isCompleted ? <CheckCircle2 size={16} strokeWidth={3} /> : index + 1}
                    </div>
                    <span className={`
                      text-sm font-medium transition-colors hidden sm:block
                      ${isActive ? "text-blue-600 font-bold" : isCompleted ? "text-slate-600" : "text-slate-400"}
                    `}>
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="h-[1px] w-4 md:w-8 bg-slate-200 flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        
        {/* LEFT: Editor Panel */}
        <section className="w-full lg:w-[420px] xl:w-[480px] flex flex-col no-print bg-white border-r border-slate-200 shadow-xl z-20 overflow-hidden">
          {/* Editor Header */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{steps[currentStep].label}</h2>
              <p className="text-xs text-slate-500">Step {currentStep + 1} of {steps.length}</p>
            </div>
            {isSaving && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Autosaved
              </div>
            )}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Editor t={t} />
              {SHOW_ADS && <AdSpace className="h-24 rounded-xl border-slate-200" label="Premium Features" />}
            </div>
          </div>

          {/* Editor Footer / Navigation */}
          <footer className="p-4 bg-white border-t border-slate-100 flex gap-3 flex-none shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <button
              disabled={currentStep === 0}
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              className="px-4 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-all flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              {t.actions.back}
            </button>
            <button
              onClick={() => setStep(Math.min(steps.length - 1, currentStep + 1))}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black hover:shadow-lg active:scale-[0.98] transition-all"
            >
              {currentStep === steps.length - 1 ? t.nav.preview : t.actions.next}
              <ChevronRight size={18} />
            </button>
          </footer>
        </section>

        {/* RIGHT: Live Preview Panel */}
        <section className="flex-1 flex flex-col overflow-hidden bg-[#F1F5F9]">
          {/* Preview Toolbar */}
          <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between z-10">
            <div className="flex items-center gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setTemplateId(tmpl.id)}
                  className={`
                    px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                    ${resume.templateId === tmpl.id 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                  `}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleLatexExport}
                className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                title="LaTeX Source"
              >
                <Code size={18} />
              </button>
              <button 
                onClick={handleDocxExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                <FileText size={18} className="text-blue-500" />
                <span className="text-sm">Word</span>
              </button>
              <button 
                onClick={handlePdfExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] transition-all shadow-sm"
              >
                <Printer size={18} />
                <span className="text-sm">Download PDF</span>
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
            <div className="max-w-[850px] mx-auto">
              <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden animate-in zoom-in-95 duration-700 origin-top">
                <Preview t={t} />
              </div>
              
              <div className="mt-12 opacity-50 hover:opacity-100 transition-opacity">
                {SHOW_ADS && <AdSpace className="h-20" label="Resume Tips & Tricks" />}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 3. MOBILE OVERLAY FIX (Optional styling) */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #E2E8F0; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          h-screen { height: auto !important; overflow: visible !important; }
        }
      `}</style>
    </div>
  )
}
