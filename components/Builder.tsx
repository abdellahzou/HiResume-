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
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Zap,
  Eye,
  ChevronRight,
  ChevronLeft,
  Printer,
  Code,
  FileText,
  Download,
  CheckCircle2,
} from "lucide-react"

interface BuilderProps {
  t: Translation
}

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore()
  const stepperRef = useRef<HTMLDivElement>(null)

  const steps = [
    { id: 0, label: t.steps.personal, icon: User },
    { id: 1, label: t.steps.experience, icon: Briefcase },
    { id: 2, label: t.steps.projects, icon: FolderGit2 },
    { id: 3, label: t.steps.education, icon: GraduationCap },
    { id: 4, label: t.steps.certifications, icon: Award },
    { id: 5, label: t.steps.skills, icon: Zap },
    { id: 6, label: t.steps.preview, icon: Eye },
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
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const handlePdfExport = () => {
    const element = document.getElementById("resume-preview")
    if (!element) return

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
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Left Side: Editor (Always visible, not hidden on preview) */}
      <div className={`w-full md:w-1/3 flex flex-col gap-6 no-print`}>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-200">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 px-2">Build Your Resume</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" ref={stepperRef}>
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <button
                  key={step.id}
                  onClick={() => setStep(step.id)}
                  data-active={isActive}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md ring-2 ring-blue-300"
                      : isCompleted
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="relative">
                    <Icon size={18} />
                    {isCompleted && <CheckCircle2 size={12} className="absolute -top-1 -right-1 fill-current" />}
                  </div>
                  <span className="text-[10px] leading-tight">{step.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Ad Placeholder 1 - Sidebar */}
        <AdSpace className="h-32" label="Ad Space (Sidebar)" />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px] flex flex-col flex-1">
          <Editor t={t} />

          {/* Ad Placeholder 2 (Inside Form Flow) */}
          {SHOW_ADS && (
            <div className="mt-8 pt-8 border-t border-dashed border-gray-200">
              <AdSpace className="h-20" label="Ad Space (In-Flow)" />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            disabled={currentStep === 0}
            onClick={() => setStep(Math.max(0, currentStep - 1))}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> {t.actions.back}
          </button>
          <button
            onClick={() => setStep(Math.min(maxStep, currentStep + 1))}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            {currentStep === maxStep ? t.nav.preview : t.actions.next} <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Right Side: Preview (Always visible) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Action Bar - Download & Template Selection */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm no-print sticky top-[4.5rem] z-30 transition-all">
          <div className="space-y-4">
            {/* Download Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Download size={18} className="text-blue-600" />
                Download
              </h3>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePdfExport}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                  title="Export as PDF (ATS-friendly, single page)"
                >
                  <Printer size={16} /> PDF
                </button>
                <button
                  onClick={handleDocxExport}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all"
                >
                  <FileText size={16} /> Word
                </button>
                <button
                  onClick={handleLatexExport}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  <Code size={16} /> LaTeX
                </button>
              </div>
            </div>

            {/* Template Selection */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t.actions.changeTemplate}
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

        {/* The Resume Paper */}
        <div className="overflow-auto pb-10 print:pb-0">
          <Preview t={t} />
        </div>

        {/* Ad Placeholder 3 (Bottom) */}
        <AdSpace className="h-24" label="Ad Space (Bottom Banner)" />
      </div>
    </div>
  )
}
