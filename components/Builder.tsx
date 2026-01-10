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
import {
  Printer,
  Code,
  FileText,
  Download,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
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
    const el = stepperRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [currentStep])

  const handlePdfExport = () => {
    const originalTitle = document.title
    const safeName = resume.personalInfo.fullName
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 20)
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
    downloadFile(
      blob,
      "resume.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  }

  const maxStep = 6

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-gray-200 py-4 md:py-6 no-print">
        {/* Step Circles */}
        <div
          ref={stepperRef}
          className="flex items-center gap-4 px-6 overflow-x-auto no-scrollbar justify-start md:justify-center"
        >
          {steps.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center gap-4 flex-shrink-0">
                <button
                  data-active={isActive}
                  onClick={() => setStep(step.id)}
                  className={`w-10 h-10 rounded-full font-bold transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : isCompleted
                      ? "bg-slate-800 text-white"
                      : "bg-gray-300 text-white"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : index + 1}
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-12 h-0.5 ${
                      isCompleted ? "bg-slate-800" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Labels */}
        <div className="flex items-center gap-4 px-6 mt-2 overflow-x-auto no-scrollbar justify-start md:justify-center">
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

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* -------- LEFT / EDITOR -------- */}
        <div className="w-full lg:w-[420px] bg-white border-r border-gray-200 flex flex-col no-print">
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <Editor t={t} />

            {SHOW_ADS && (
              <div className="mt-6 pt-6 border-t border-dashed">
                <AdSpace className="h-20" label="Ad Space (Editor)" />
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t flex gap-3">
            <button
              disabled={currentStep === 0}
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              {t.actions.back}
            </button>
            <button
              onClick={() => setStep(Math.min(maxStep, currentStep + 1))}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold"
            >
              {t.actions.next}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* -------- RIGHT / PREVIEW -------- */}
        <div className="flex-1 bg-slate-100">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {/* Sticky Download Bar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
              <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Download size={18} className="text-blue-600" />
                  Download
                </h3>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handlePdfExport}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                  >
                    <Printer size={16} />
                    PDF
                  </button>
                  <button
                    onClick={handleDocxExport}
                    className="px-4 py-2 bg-white border rounded-lg text-sm font-semibold flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Word
                  </button>
                  <button
                    onClick={handleLatexExport}
                    className="px-4 py-2 bg-white border rounded-lg text-sm font-semibold flex items-center gap-2"
                  >
                    <Code size={16} />
                    LaTeX
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll Content */}
            <div className="p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Template Selector */}
                <div className="bg-white border rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    {t.actions.changeTemplate}
                  </p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {templates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setTemplateId(tmpl.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          resume.templateId === tmpl.id
                            ? "bg-slate-900 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resume Preview */}
                <div className="bg-white shadow-2xl ring-1 ring-gray-200 min-h-[1100px]">
                  <Preview t={t} />
                </div>

                {SHOW_ADS && (
                  <AdSpace className="h-24" label="Ad Space (Bottom)" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
