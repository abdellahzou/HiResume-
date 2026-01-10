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
    <div className="min-h-screen bg-gray-50">

      {/* ================= MOBILE UI ================= */}
      <div className="lg:hidden flex flex-col min-h-screen">

        {/* Mobile Stepper */}
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

        {/* Mobile Content */}
        <main className="flex-1 px-4 py-6 space-y-6">
          <h1 className="text-2xl font-bold">{steps[currentStep]?.label}</h1>

          {currentStep < 6 ? (
            <>
              <Editor t={t} />
              {SHOW_ADS && <AdSpace className="h-20" label="Ad Space (Mobile)" />}
            </>
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
                        : "bg-gray-200"
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handlePdfExport}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold flex justify-center gap-2"
                >
                  <Printer size={16} /> Download PDF
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleDocxExport} className="py-2 border rounded-lg font-semibold flex justify-center gap-2">
                    <FileText size={14} /> Word
                  </button>
                  <button onClick={handleLatexExport} className="py-2 border rounded-lg font-semibold flex justify-center gap-2">
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

        {/* Mobile Bottom Nav */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3">
          <button
            disabled={currentStep === 0}
            onClick={() => setStep(currentStep - 1)}
            className="flex-1 py-3 rounded-lg bg-gray-800 text-white font-semibold disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={() => setStep(currentStep + 1)}
            className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* ================= DESKTOP UI ================= */}
      <div className="hidden lg:grid grid-cols-[260px_1fr_520px] h-screen">

        {/* Sidebar Stepper */}
        <aside className="bg-white border-r p-6 space-y-4">
          {steps.map((step) => {
            const active = currentStep === step.id
            const done = currentStep > step.id

            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                  active ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    done
                      ? "bg-slate-800 text-white"
                      : active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-white"
                  }`}
                >
                  {done ? <CheckCircle2 size={14} /> : step.id + 1}
                </div>
                <span className="font-semibold">{step.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Editor */}
        <main className="p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">
            {steps[currentStep]?.label}
          </h1>

          {currentStep < 6 ? (
            <>
              <Editor t={t} />
              {SHOW_ADS && <AdSpace className="mt-6 h-24" label="Ad Space (Desktop)" />}
            </>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      resume.templateId === tmpl.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handlePdfExport} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex gap-2">
                  <Printer size={16} /> PDF
                </button>
                <button onClick={handleDocxExport} className="px-4 py-2 border rounded-lg flex gap-2">
                  <FileText size={16} /> Word
                </button>
                <button onClick={handleLatexExport} className="px-4 py-2 border rounded-lg flex gap-2">
                  <Code size={16} /> LaTeX
                </button>
              </div>
            </>
          )}
        </main>

        {/* Live Preview */}
        <aside className="bg-gray-100 border-l p-6 overflow-hidden">
          <div className="bg-white rounded-xl shadow h-full overflow-y-auto">
            <Preview t={t} />
          </div>
        </aside>
      </div>
    </div>
  )
}
