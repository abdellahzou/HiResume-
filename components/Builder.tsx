"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { useResumeStore } from "../store"
import type { Translation, TemplateId } from "../types"
import { Editor } from "./Editor"
import { Preview } from "./Preview"
import { AdSpace } from "./AdSpace"
import { SHOW_ADS } from "../constants"
import { generateLatex, generateDocx, downloadFile } from "../utils"
import { Printer, Code, FileText, Download, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react"

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

  useEffect(() => {
    if (stepperRef.current) {
      const activeBtn = stepperRef.current.querySelector('[data-active="true"]')
      if (activeBtn) {
        // block: "nearest" ensures we don't scroll the whole page, only the container
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

  const maxStep = 6

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 overflow-hidden">
      {/* HEADER SECTION: Fixed at top */}
      <div className="bg-white border-b border-gray-200 py-4 md:py-6 z-40 no-print flex-none w-full overflow-hidden">
        {/* Step Circles - Scrollable container that doesn't push the page */}
        <div 
          className="flex items-center justify-start md:justify-center gap-4 mb-4 px-6 overflow-x-auto no-scrollbar scroll-smooth" 
          ref={stepperRef}
        >
          {steps.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={() => setStep(step.id)}
                  data-active={isActive}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-blue-500 text-white ring-4 ring-blue-200 shadow-md"
                      : isCompleted
                        ? "bg-slate-700 text-white"
                        : "bg-gray-300 text-white"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
                </button>

                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-12 h-0.5 flex-shrink-0 transition-all ${isCompleted ? "bg-slate-700" : "bg-gray-300"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Labels Row - Scrollable container */}
        <div className="flex items-center justify-start md:justify-center gap-4 overflow-x-auto no-scrollbar px-6">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setStep(step.id)}
              className={`text-xs md:text-sm font-semibold whitespace-nowrap px-2 py-1 transition-all flex-shrink-0 ${
                currentStep === step.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : currentStep > step.id
                    ? "text-slate-700"
                    : "text-gray-500"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT: Split Screen */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Left Sidebar: Editor (Independent Scroll) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col no-print border-r border-gray-200 bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="flex flex-col gap-6">
              <Editor t={t} />
              
              {SHOW_ADS && (
                <div className="mt-4 pt-6 border-t border-dashed border-gray-200">
                  <AdSpace className="h-20" label="Ad Space (In-Form)" />
                </div>
              )}
            </div>
          </div>

          {/* Nav Buttons: Fixed at bottom of sidebar */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 flex-none">
            <button
              disabled={currentStep === 0}
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white font-semibold rounded-lg text-sm hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
              {t.actions.back}
            </button>
            <button
              onClick={() => setStep(Math.min(maxStep, currentStep + 1))}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition-all shadow-sm"
            >
              {currentStep === maxStep ? t.nav.preview : t.actions.next}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Content: Preview (Independent Scroll) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-100/50">
          {/* Internal wrapper to handle spacing and centering */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              
              {/* Download & Template Bar */}
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex-none">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Download size={18} className="text-blue-600" />
                      Download
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={handlePdfExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all">
                        <Printer size={16} /> PDF
                      </button>
                      <button onClick={handleDocxExport} className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all">
                        <FileText size={16} /> Word
                      </button>
                      <button onClick={handleLatexExport} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
                        <Code size={16} /> LaTeX
                      </button>
                    </div>
                  </div>

                  <div className="md:border-l md:pl-6 border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {t.actions.changeTemplate}
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[300px]">
                      {templates.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          onClick={() => setTemplateId(tmpl.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            resume.templateId === tmpl.id
                              ? "bg-slate-900 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tmpl.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Sheet */}
              <div className="bg-white shadow-2xl ring-1 ring-gray-200 min-h-[1100px] mb-8">
                <Preview t={t} />
              </div>

              {SHOW_ADS && <AdSpace className="h-24 mb-4" label="Ad Space (Bottom)" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
