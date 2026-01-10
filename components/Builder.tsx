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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Printer,
  FileText,
  Code,
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
        <main className="flex-1 px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {steps[currentStep]?.label}
            </h1>
          </div>

          {currentStep < 6 ? (
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
              <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 h-[75vh] overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <Preview t={t} />
                </div>
              </div>
            </>
          )}
        </main>

        {/* MOBILE BOTTOM NAV */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3">
          <button
            disabled={currentStep === 0}
            onClick={() => setStep(Math.max(0, currentStep - 1))}
            className="flex-1 py-3 rounded-lg bg-gray-800 text-white font-semibold disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={() => setStep(Math.min(6, currentStep + 1))}
            className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* ================= DESKTOP VIEW (>= 1024px) ================= */}
      <div className="hidden lg:flex min-h-screen bg-gray-50">
        {/* LEFT SIDEBAR - VERTICAL STEPPER */}
        <div className="w-64 bg-white border-r flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900">Resume Builder</h2>
          </div>
          
          <div className="flex-1 p-4 space-y-2">
            {steps.map((step, index) => {
              const active = currentStep === step.id
              const done = currentStep > step.id

              return (
                <button
                  key={step.id}
                  onClick={() => setStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                      active
                        ? "bg-blue-600 text-white"
                        : done
                        ? "bg-slate-800 text-white"
                        : "bg-gray-300 text-white"
                    }`}
                  >
                    {done ? <CheckCircle2 size={16} /> : index + 1}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      active ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="p-4 border-t space-y-2">
            <button
              disabled={currentStep === 0}
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              className="w-full py-2.5 rounded-lg bg-gray-800 text-white font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStep(Math.min(6, currentStep + 1))}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              Next Step <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* MIDDLE - EDITOR */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {steps[currentStep]?.label}
              </h1>
            </div>

            {currentStep < 6 ? (
              <div className="space-y-6">
                <Editor t={t} />
                {SHOW_ADS && (
                  <AdSpace className="h-24" label="Ad Space (Desktop)" />
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Choose Template
                  </h3>
                  <div className="flex gap-2">
                    {templates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setTemplateId(tmpl.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          resume.templateId === tmpl.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Download Resume
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={handlePdfExport}
                      className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700"
                    >
                      <Printer size={18} /> Download PDF
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleDocxExport}
                        className="py-2.5 rounded-lg border border-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
                      >
                        <FileText size={16} /> Word
                      </button>
                      <button
                        onClick={handleLatexExport}
                        className="py-2.5 rounded-lg border border-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
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

        {/* RIGHT - LIVE PREVIEW */}
        <div className="w-[480px] bg-gray-100 border-l overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
            <h2 className="text-sm font-bold text-gray-900">Live Preview</h2>
          </div>
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 overflow-hidden">
              <div className="aspect-[8.5/11] overflow-y-auto">
                <Preview t={t} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
