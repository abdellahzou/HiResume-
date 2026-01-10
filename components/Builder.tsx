"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
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
  Sparkles,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface BuilderProps {
  t: Translation
}

export const Builder: React.FC<BuilderProps> = ({ t }) => {
  const { currentStep, setStep, resume, setTemplateId } = useResumeStore()
  const stepperRef = useRef<HTMLDivElement>(null)
  const [previewCollapsed, setPreviewCollapsed] = useState(false)
  const [previewMaximized, setPreviewMaximized] = useState(false)

  const steps = [
    { id: 0, label: t.steps.personal, icon: "👤" },
    { id: 1, label: t.steps.experience, icon: "💼" },
    { id: 2, label: t.steps.projects, icon: "🚀" },
    { id: 3, label: t.steps.education, icon: "🎓" },
    { id: 4, label: t.steps.certifications, icon: "🏆" },
    { id: 5, label: t.steps.skills, icon: "⚡" },
    { id: 6, label: t.steps.preview, icon: "✨" },
  ]

  const templates: { id: TemplateId; name: string; color: string }[] = [
    { id: "modern", name: "Modern", color: "from-blue-500 to-cyan-500" },
    { id: "classic", name: "Classic", color: "from-slate-600 to-slate-800" },
    { id: "minimal", name: "Minimal", color: "from-gray-400 to-gray-600" },
    { id: "executive", name: "Executive", color: "from-purple-500 to-pink-500" },
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

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

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
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* LEFT SIDEBAR - MODERN VERTICAL STEPPER */}
        <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-xl">
          {/* Header with gradient */}
          <div className="relative p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-yellow-300" size={24} />
                <h2 className="text-2xl font-bold text-white">Resume Builder</h2>
              </div>
              <p className="text-blue-100 text-sm">Create your perfect resume</p>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6 relative">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-white/90 mt-2 font-medium">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>
          
          {/* Steps */}
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {steps.map((step, index) => {
              const active = currentStep === step.id
              const done = currentStep > step.id

              return (
                <button
                  key={step.id}
                  onClick={() => setStep(step.id)}
                  className={`group w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 scale-105"
                      : done
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 transition-all ${
                      active
                        ? "bg-white text-blue-600 shadow-lg"
                        : done
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <span className="text-2xl">{step.icon}</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-xs font-semibold mb-0.5 ${
                        active ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      Step {index + 1}
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        active ? "text-white" : done ? "text-green-700" : "text-gray-700"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="p-6 border-t border-gray-200 space-y-3 bg-white/50 backdrop-blur">
            <button
              disabled={currentStep === 0}
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              className="w-full py-3 rounded-xl bg-gray-800 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button
              onClick={() => setStep(Math.min(6, currentStep + 1))}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              {currentStep === 6 ? "Finish" : "Next Step"} <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* MIDDLE - EDITOR WITH GLASS MORPHISM */}
        <div className={`flex-1 overflow-y-auto transition-all duration-500 ${previewMaximized ? 'hidden' : ''}`}>
          <div className="max-w-4xl mx-auto p-10">
            {/* Header Card */}
            <div className="mb-8 bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg">
                  {steps[currentStep]?.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-1">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {steps[currentStep]?.label}
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Fill in the details below to build your professional resume
              </p>
            </div>

            {currentStep < 6 ? (
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                  <Editor t={t} />
                </div>
                {SHOW_ADS && (
                  <AdSpace className="h-32 rounded-2xl" label="Ad Space (Desktop)" />
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Template Selector - Premium Cards */}
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Sparkles className="text-yellow-500" size={20} />
                    Choose Your Template
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {templates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setTemplateId(tmpl.id)}
                        className={`group relative overflow-hidden p-6 rounded-xl transition-all duration-300 ${
                          resume.templateId === tmpl.id
                            ? "ring-2 ring-blue-500 shadow-2xl scale-105"
                            : "ring-1 ring-gray-200 hover:shadow-xl hover:scale-102"
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${tmpl.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="relative">
                          <div className={`h-20 rounded-lg bg-gradient-to-br ${tmpl.color} mb-3 shadow-lg`} />
                          <p className="font-bold text-gray-900">{tmpl.name}</p>
                          {resume.templateId === tmpl.id && (
                            <CheckCircle2 className="absolute top-0 right-0 text-blue-600" size={24} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Section - Premium */}
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Download className="text-green-500" size={20} />
                    Download Your Resume
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={handlePdfExport}
                      className="group w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-3 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-2xl"
                    >
                      <Printer size={20} />
                      <span>Download as PDF</span>
                      <div className="ml-auto bg-white/20 px-3 py-1 rounded-lg text-xs">
                        Recommended
                      </div>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleDocxExport}
                        className="py-3 rounded-xl bg-white border-2 border-gray-200 font-semibold flex items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <FileText size={18} /> Word Document
                      </button>
                      <button
                        onClick={handleLatexExport}
                        className="py-3 rounded-xl bg-white border-2 border-gray-200 font-semibold flex items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-50 transition-all"
                      >
                        <Code size={18} /> LaTeX
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - LIVE PREVIEW WITH CONTROLS */}
        <div className={`bg-gradient-to-br from-slate-100 to-slate-200 border-l border-gray-200/50 flex flex-col shadow-2xl transition-all duration-500 ${
          previewMaximized ? 'w-full' : previewCollapsed ? 'w-16' : 'w-[520px]'
        }`}>
          {/* Preview Header */}
          <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 flex items-center justify-between">
            {!previewCollapsed && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Eye className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Live Preview</h2>
                    <p className="text-xs text-gray-500">Updates in real-time</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMaximized(!previewMaximized)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={previewMaximized ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {previewMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={() => setPreviewCollapsed(!previewCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Collapse preview"
                  >
                    <EyeOff size={18} />
                  </button>
                </div>
              </>
            )}
            {previewCollapsed && (
              <button
                onClick={() => setPreviewCollapsed(false)}
                className="p-3 rounded-lg hover:bg-gray-100 transition-colors mx-auto"
                title="Expand preview"
              >
                <Eye size={20} />
              </button>
            )}
          </div>

          {/* Preview Content */}
          {!previewCollapsed && (
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-gray-900/5 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="aspect-[8.5/11] overflow-y-auto">
                    <Preview t={t} />
                  </div>
                </div>
                {/* Preview info badge */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg border border-gray-200/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-gray-700">
                      Live Preview Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
