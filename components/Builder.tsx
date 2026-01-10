"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useResumeStore } from "../store"
import type { Translation, TemplateId } from "../types"
import { Editor } from "./Editor"
import { Preview } from "./Preview"
import { AdSpace } from "./AdSpace"
import { SHOW_ADS } from "../constants"
import { generateLatex, generateDocx, downloadFile } from "../utils"
import {
  CheckCircle2,
  Printer,
  FileText,
  Code,
  ArrowRight,
  ArrowLeft,
  LayoutTemplate
} from "lucide-react"

interface BuilderProps {
  t: Translation
}

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore()
  const stepperRef = useRef<HTMLDivElement>(null)

  const steps = [
    { id: 0, label: t.steps.personal },
    { id: 1, label: t.steps.experience },
    { id: 2, label: t.steps.projects },
    { id: 3, label: t.steps.education },
    { id: 4, label: t.steps.certifications },
    { id: 5, label: t.steps.skills },
    { id: 6, label: "Finalize" }, // Renamed for Desktop context
  ]

  // Added 'creative' and 'professional' based on previous context updates
  const templates: { id: TemplateId; name: string }[] = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" },
    { id: "minimal", name: "Minimal" },
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "executive", name: "Executive" },
  ]

  useEffect(() => {
    const el = stepperRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ behavior: "smooth", inline: "center" })
  }, [currentStep])

  const handlePdfExport = () => window.print()

  const handleDocxExport = async () => {
    const blob = await generateDocx(resume, t)
    downloadFile(
      blob,
      "resume.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  }

  const handleLatexExport = () => {
    const latex = generateLatex(resume, t)
    downloadFile(latex, "resume.tex", "text/x-tex")
  }

  // Shared Action Buttons Component
  const ExportActions = () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 mb-6">
        <strong>Ready to download?</strong> Choose your preferred format below. 
        For the best result, PDF is recommended.
      </div>

      <button
        onClick={handlePdfExport}
        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3"
      >
        <Printer size={20} /> Download PDF
      </button>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleDocxExport}
          className="py-3 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 font-semibold transition-all flex items-center justify-center gap-2"
        >
          <FileText size={18} /> Word (DOCX)
        </button>
        <button
          onClick={handleLatexExport}
          className="py-3 rounded-xl border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-700 font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Code size={18} /> LaTeX Source
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* =====================================================================================
          MOBILE VIEW (HIDDEN ON DESKTOP)
          This preserves your exact current mobile layout
      ===================================================================================== */}
      <div className="md:hidden flex flex-col min-h-screen">
        <div className="bg-white border-b px-4 pt-4 pb-3">
          <div
            ref={stepperRef}
            className="flex items-center gap-6 overflow-x-auto no-scrollbar"
          >
            {steps.map((step, index) => {
              const active = currentStep === step.id
              const done = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-col items-center min-w-[64px]">
                  <div
                    data-active={active}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : done
                        ? "bg-slate-800 text-white"
                        : "bg-gray-300 text-white"
                    }`}
                  >
                    {done ? <CheckCircle2 size={14} /> : index + 1}
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-semibold text-center ${
                      active ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <main className="flex-1 px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {steps[currentStep]?.label}
            </h1>
          </div>

          {currentStep < 6 ? (
            <div className="space-y-6">
              <Editor t={t} />
              {SHOW_ADS && <AdSpace className="h-20" label="Ad Space" />}
            </div>
          ) : (
            <>
              {/* Mobile Template Selector */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      resume.templateId === tmpl.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700"
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
              
              <ExportActions />

              {/* Mobile Preview */}
              <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 h-[60vh] overflow-hidden relative">
                <div className="h-full overflow-y-auto overflow-x-hidden">
                  <div className="transform origin-top scale-[0.5] sm:scale-[0.6] w-[210mm]"> 
                    {/* Scale down A4 to fit mobile width */}
                    <Preview t={t} />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3 z-20">
          <button
            disabled={currentStep === 0}
            onClick={() => setStep(Math.max(0, currentStep - 1))}
            className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold disabled:opacity-40"
          >
            Back
          </button>

          <button
            onClick={() => setStep(Math.min(6, currentStep + 1))}
            className="flex-1 py-3 rounded-lg bg-slate-900 text-white font-semibold"
          >
            {currentStep === 6 ? 'Finish' : 'Next Step'}
          </button>
        </div>
      </div>

      {/* =====================================================================================
          DESKTOP VIEW (HIDDEN ON MOBILE)
          New 3-Column Layout: Nav | Editor | Live Preview
      ===================================================================================== */}
      <div className="hidden md:flex flex-1 max-w-[1600px] mx-auto w-full p-6 gap-8 h-[calc(100vh-64px)]">
        
        {/* 1. LEFT SIDEBAR: Navigation */}
        <aside className="w-64 shrink-0 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
            <h2 className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-6">Build Steps</h2>
            <nav className="space-y-2 flex-1">
              {steps.map((step, index) => {
                const active = currentStep === step.id
                const done = currentStep > step.id
                return (
                  <button
                    key={step.id}
                    onClick={() => setStep(step.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                        active
                          ? "bg-blue-600 border-blue-600 text-white"
                          : done
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      {done ? <CheckCircle2 size={12} /> : index + 1}
                    </div>
                    {step.label}
                  </button>
                )
              })}
            </nav>
            {SHOW_ADS && <div className="mt-auto"><AdSpace className="h-32 w-full text-xs" label="Ad" /></div>}
          </div>
        </aside>

        {/* 2. MIDDLE COLUMN: Editor Area */}
        <section className="flex-1 min-w-[500px] flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
               {steps[currentStep]?.label}
            </h1>
            <span className="text-sm text-slate-500">Step {currentStep + 1} of 7</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
            {currentStep < 6 ? (
              <Editor t={t} />
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                 <h2 className="text-xl font-bold mb-2">🎉 Your resume is ready!</h2>
                 <p className="text-slate-600 mb-8">Review your design on the right, then select a format to download.</p>
                 <ExportActions />
              </div>
            )}
          </div>

          {/* Desktop Bottom Navigation Buttons */}
          <div className="pt-4 border-t mt-auto flex justify-between items-center bg-gray-50 z-10">
            <button
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            
            {currentStep < 6 && (
              <button
                onClick={() => setStep(Math.min(6, currentStep + 1))}
                className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200 hover:shadow-xl transition-all flex items-center gap-2"
              >
                Next Step <ArrowRight size={18} />
              </button>
            )}
          </div>
        </section>

        {/* 3. RIGHT COLUMN: Sticky Live Preview */}
        <aside className="w-[450px] xl:w-[550px] shrink-0 h-full flex flex-col">
          {/* Template Selector Bar */}
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-2 text-slate-500 text-sm font-medium">
                <LayoutTemplate size={16} />
                <span className="hidden xl:inline">Template:</span>
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-full">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      resume.templateId === tmpl.id
                        ? "bg-slate-900 text-white shadow-md"
                        : "hover:bg-gray-100 text-slate-600"
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex-1 bg-slate-200/50 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner flex items-center justify-center p-4">
            <div className="h-full w-full overflow-y-auto custom-scrollbar flex justify-center">
                 {/* 
                    Transform scale logic: 
                    A4 width is approx 210mm (~794px). 
                    The container is smaller (~450px-550px).
                    We scale down the preview to fit nicely without horizontal scroll.
                 */}
                 <div className="transform scale-[0.55] xl:scale-[0.65] origin-top h-fit shadow-2xl">
                    <Preview t={t} className="min-h-[297mm]" /> 
                 </div>
            </div>
            
            {/* Overlay hint */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-400 border border-white/50 shadow-sm pointer-events-none">
                Live Preview
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
