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
  Download,
  Printer,
  FileText,
  Code,
  CheckCircle2,
} from "lucide-react"

interface BuilderProps {
  t: Translation
}

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore()
  const stepperRef = useRef<HTMLDivElement>(null)

  const maxStep = 6
  const isPreview = currentStep === maxStep

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
      const active = stepperRef.current.querySelector('[data-active="true"]')
      active?.scrollIntoView({ behavior: "smooth", inline: "center" })
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  /* ---------------- EXPORTS ---------------- */

  const handlePdfExport = () => {
    const originalTitle = document.title
    const safeName = resume.personalInfo.fullName
      ?.replace(/[^a-z0-9]/gi, "_")
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

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)]">
      {/* ───────────────── STEPPER ───────────────── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm no-print">
        <div
          ref={stepperRef}
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide snap-x"
        >
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <button
                key={step.id}
                data-active={isActive}
                onClick={() => setStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-semibold text-sm snap-start whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-100"
                      : isCompleted
                      ? "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                {step.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ───────────────── MAIN CONTENT ───────────────── */}
      <div className="flex-grow bg-slate-50/50">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32 grid md:grid-cols-[420px_1fr] gap-8">
          {/* LEFT — EDITOR */}
          <div className="space-y-6 no-print">
            <Editor t={t} />

            {SHOW_ADS && <AdSpace className="h-24" label="Ad Space" />}
          </div>

          {/* RIGHT — PREVIEW */}
          <div className="flex flex-col gap-6">
            {/* ACTION CARD */}
            <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-[6.5rem] z-20 no-print">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Download size={20} className="text-blue-600" />
                Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={handlePdfExport}
                  className="btn-primary"
                >
                  <Printer size={18} /> PDF
                </button>

                <button
                  onClick={handleDocxExport}
                  className="btn-secondary"
                >
                  <FileText size={18} /> Word
                </button>

                <button
                  onClick={handleLatexExport}
                  className="btn-tertiary"
                >
                  <Code size={18} /> LaTeX
                </button>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {t.actions.changeTemplate}
              </p>

              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={`px-5 py-2.5 rounded-xl border text-sm font-bold whitespace-nowrap transition-all
                      ${
                        resume.templateId === tmpl.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW PAPER */}
            <div className="overflow-auto pb-10">
              <Preview t={t} />
            </div>

            <AdSpace className="h-24" label="Ad Space (Bottom)" />
          </div>
        </div>
      </div>

      {/* ───────────────── FOOTER NAV ───────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 no-print">
        <div className="max-w-6xl mx-auto flex gap-4">
          <button
            disabled={currentStep === 0}
            onClick={() => setStep(Math.max(0, currentStep - 1))}
            className="footer-btn-secondary"
          >
            <ChevronLeft size={20} /> {t.actions.back}
          </button>

          <button
            onClick={() =>
              setStep(isPreview ? 0 : Math.min(maxStep, currentStep + 1))
            }
            className="footer-btn-primary"
          >
            {isPreview ? "Edit Info" : t.actions.next}
            {!isPreview && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
