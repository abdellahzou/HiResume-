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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Printer,
  FileText,
  Code,
  Download,
  Menu,
  User,
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
    { id: 6, label: "Custom" },
    { id: 7, label: t.steps.preview },
  ]

  const templates: { id: TemplateId; name: string }[] = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" },
    { id: "minimal", name: "Minimal" },
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

  const handlePrimaryAction = () => {
    if (currentStep === 7) {
      handlePdfExport()
    } else {
      setStep(Math.min(7, currentStep + 1))
    }
  }

  return (
    <>
      {/* ================= MOBILE VIEW (< 1024px) ================= */}
      <div className="lg:hidden min-h-screen bg-gray-50 flex flex-col">
        {/* MOBILE STEPPER */}
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
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

        {/* MOBILE CONTENT */}
        <main className="flex-1 px-4 py-6 space-y-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {steps[currentStep]?.label}
            </h1>
          </div>

          {currentStep < 7 ? (
            <div className="space-y-6">
              <Editor t={t} />
              {SHOW_ADS && (
                <AdSpace className="h-20" label="Ad Space (Mobile)" />
              )}
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      resume.templateId === tmpl.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <button
                  onClick={handlePdfExport}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Printer size={16} /> Download PDF
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDocxExport}
                    className="py-2 rounded-lg border font-semibold flex items-center justify-center gap-2"
                  >
                    <FileText size={14} /> Word
                  </button>
                  <button
                    onClick={handleLatexExport}
                    className="py-2 rounded-lg border font-semibold flex items-center justify-center gap-2"
                  >
                    <Code size={14} /> LaTeX
                  </button>
                </div>
              </div>
              
              {/* MOBILE PREVIEW CONTAINER */}
              <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 h-[65vh] overflow-hidden relative">
                 <Preview t={t} />
              </div>
            </>
          )}
        </main>

        {/* MOBILE BOTTOM NAV */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3 z-20">
          <button
            disabled={currentStep === 0}
            onClick={() => setStep(Math.max(0, currentStep - 1))}
            className="flex-1 py-3 rounded-lg bg-gray-800 text-white font-semibold disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={handlePrimaryAction}
            className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2"
          >
            {currentStep === 7 ? (
              <>
                <Printer size={18} /> Download PDF
              </>
            ) : (
              "Next Step"
            )}
          </button>
        </div>
      </div>

      {/* ================= DESKTOP VIEW (>= 1024px) ================= */}
      <div className="hidden lg:flex min-h-screen bg-gray-50">
        {/* TOP HEADER */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HiResume</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} className="text-gray-600" />
            </button>
            <button className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex w-full mt-16 h-[calc(100vh-64px)] overflow-hidden">
          {/* LEFT SIDEBAR - NAVIGATION */}
          <div className="w-64 bg-white border-r flex flex-col h-full overflow-y-auto">
            {/* Steps Navigation */}
            <div className="py-6">
              {steps.map((step, index) => {
                const active = currentStep === step.id
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setStep(step.id)}
                    className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                      active
                        ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`flex items-center justify-center flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`}>
                       <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className={`text-sm font-medium ${active ? "font-semibold" : ""}`}>
                      {step.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-auto px-4 pb-6 space-y-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setStep(Math.max(0, currentStep - 1))}
                className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={handlePrimaryAction}
                className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {currentStep === 7 ? (
                  <>
                    <Printer size={16} /> Download PDF
                  </>
                ) : (
                  <>
                    Next <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MIDDLE - EDITOR */}
          <div className="flex-1 overflow-y-auto bg-gray-50 h-full relative">
            <div className="max-w-3xl mx-auto p-8 pb-32">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {steps[currentStep]?.label}
                </h1>
              </div>

              {currentStep < 7 ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <Editor t={t} />
                  </div>
                  {SHOW_ADS && (
                    <AdSpace className="h-24" label="Ad Space" />
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Template Selector */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Template
                    </h3>
                    <div className="flex gap-3">
                      {templates.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          onClick={() => setTemplateId(tmpl.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            resume.templateId === tmpl.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tmpl.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DESKTOP PREVIEW STEP CONTAINER */}
                  <div className="bg-gray-200/50 rounded-xl border border-gray-300 overflow-hidden h-[800px] relative">
                     <Preview t={t} />
                  </div>

                  {/* Download */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Download Resume
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={handlePdfExport}
                        className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Printer size={18} /> Download PDF
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleDocxExport}
                          className="py-2.5 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText size={16} /> Word
                        </button>
                        <button
                          onClick={handleLatexExport}
                          className="py-2.5 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Code size={16} /> LaTeX
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - LIVE PREVIEW SIDEBAR */}
          <div className="w-[450px] bg-slate-800 border-l border-slate-700 h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-semibold text-white">Live Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePdfExport}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download size={14} /> PDF
                </button>
              </div>
            </div>
            
            {/* 
               Preview Container for Sidebar 
               The Preview component inside here will automatically scale itself 
               to fit this 450px width using the ResizeObserver logic.
            */}
            <div className="flex-1 overflow-hidden bg-slate-900 relative">
               <div className="absolute inset-0 p-6">
                  <Preview t={t} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
