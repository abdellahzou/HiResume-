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
    downloadFile(blob, "resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  }

  const handleLatexExport = () => {
    const latex = generateLatex(resume, t)
    downloadFile(latex, "resume.tex", "text/x-tex")
  }

  const handlePrimaryAction = () => {
    if (currentStep === 7) handlePdfExport()
    else setStep(Math.min(7, currentStep + 1))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-bold text-gray-900">HiResume</span>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <button onClick={handlePdfExport} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2">
             <Download size={16} /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ================= LEFT NAV ================= */}
        <aside className="hidden lg:flex w-64 bg-white border-r flex-col">
          <nav className="flex-1 py-6">
            {steps.map((step) => {
              const active = currentStep === step.id
              return (
                <button
                  key={step.id}
                  onClick={() => setStep(step.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                    active ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-medium ${active ? "font-bold" : ""}`}>{step.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="p-4 space-y-2">
             <button disabled={currentStep === 0} onClick={() => setStep(currentStep - 1)} className="w-full py-2 border rounded-lg text-sm font-medium disabled:opacity-30">Previous</button>
             <button onClick={handlePrimaryAction} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">{currentStep === 7 ? "Print PDF" : "Next"}</button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT (EDITOR) ================= */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {currentStep < 7 ? (
               <div className="bg-white rounded-xl shadow-sm border p-6 lg:p-8">
                 <h2 className="text-2xl font-bold mb-6">{steps[currentStep].label}</h2>
                 <Editor t={t} />
               </div>
            ) : (
               <div className="space-y-6">
                  <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-bold mb-4">Choose Template</h3>
                    <div className="flex flex-wrap gap-2">
                      {templates.map(tmp => (
                        <button key={tmp.id} onClick={() => setTemplateId(tmp.id)} className={`px-4 py-2 rounded-lg text-sm font-medium ${resume.templateId === tmp.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {tmp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border p-6 lg:hidden">
                    <h3 className="font-bold mb-4">Preview</h3>
                    <Preview t={t} />
                  </div>
               </div>
            )}
            {SHOW_ADS && <AdSpace className="mt-8 h-24" />}
          </div>
        </main>

        {/* ================= RIGHT PREVIEW (DESKTOP) ================= */}
        <aside className="hidden xl:flex w-[500px] bg-slate-800 flex-col border-l border-slate-700 overflow-y-auto">
           <div className="p-6 sticky top-0 z-10 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 flex justify-between items-center">
              <span className="text-white font-bold uppercase tracking-widest text-xs">Live A4 Preview</span>
              <div className="flex gap-2">
                 <button onClick={handlePdfExport} title="Print" className="p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"><Printer size={18} /></button>
                 <button onClick={handleDocxExport} title="Download Word" className="p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"><FileText size={18} /></button>
              </div>
           </div>
           <div className="flex-1 p-4">
              {/* Note: Preview handles its own scaling internally based on the width of this container */}
              <Preview t={t} />
           </div>
        </aside>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="lg:hidden h-16 bg-white border-t px-4 flex items-center gap-3 sticky bottom-0 z-50">
        <button disabled={currentStep === 0} onClick={() => setStep(currentStep - 1)} className="flex-1 py-3 border rounded-lg font-bold disabled:opacity-30">Back</button>
        <button onClick={handlePrimaryAction} className="flex-2 py-3 bg-blue-600 text-white rounded-lg font-bold">
          {currentStep === 7 ? "Export PDF" : "Next"}
        </button>
      </div>
    </div>
  )
}
