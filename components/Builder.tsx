import type React from "react"
import { useEffect, useRef } from "react"
import { useResumeStore } from "../store"
import type { Translation, TemplateId } from "../types"
import { Editor } from "./Editor"
import { Preview } from "./Preview"
import { Printer, Download, User, ChevronRight, CheckCircle2 } from "lucide-react"

export const Builder: React.FC<{ t: Translation }> = ({ t }) => {
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
    { id: "professional", name: "Professional" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold">H</div>
          <span className="font-bold text-xl">HiResume</span>
        </div>
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold">
          <Printer size={18} /> Export PDF
        </button>
      </header>

      {/* MOBILE STEPPER (RESTORED) */}
      <div className="lg:hidden bg-white border-b overflow-x-auto no-scrollbar py-3 px-4 flex gap-6">
        {steps.map((s, i) => (
          <div key={s.id} onClick={() => setStep(s.id)} className="flex flex-col items-center min-w-[60px]">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === s.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {currentStep > s.id ? <CheckCircle2 size={14} /> : i + 1}
             </div>
             <span className="text-[10px] mt-1 text-gray-500 font-medium whitespace-nowrap">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP NAV */}
        <aside className="hidden lg:flex w-64 bg-white border-r flex-col p-4">
          {steps.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} className={`w-full text-left px-4 py-3 rounded-lg mb-1 font-medium text-sm transition-colors ${currentStep === s.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>
              {s.label}
            </button>
          ))}
          <div className="mt-auto space-y-2">
            <button disabled={currentStep === 0} onClick={() => setStep(currentStep - 1)} className="w-full py-2 border rounded-lg text-sm">Previous</button>
            <button onClick={() => setStep(Math.min(7, currentStep+1))} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">Next Step</button>
          </div>
        </aside>

        {/* EDITOR AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-12">
          <div className="max-w-2xl mx-auto">
             {currentStep < 7 ? (
               <div className="bg-white p-6 lg:p-10 rounded-2xl border shadow-sm">
                 <h2 className="text-2xl font-bold mb-8">{steps[currentStep].label}</h2>
                 <Editor t={t} />
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border">
                    <h3 className="font-bold mb-4">Choose Template</h3>
                    <div className="flex gap-2">
                      {templates.map(tmp => (
                        <button key={tmp.id} onClick={() => setTemplateId(tmp.id)} className={`px-4 py-2 rounded-lg text-sm ${resume.templateId === tmp.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                          {tmp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="lg:hidden"><Preview t={t} /></div>
               </div>
             )}
          </div>
        </main>

        {/* DESKTOP PREVIEW */}
        <aside className="hidden lg:flex w-[480px] bg-slate-900 border-l p-4 overflow-y-auto">
          <Preview t={t} />
        </aside>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden h-16 bg-white border-t p-3 flex gap-3">
        <button disabled={currentStep === 0} onClick={() => setStep(currentStep - 1)} className="flex-1 border rounded-xl font-bold">Back</button>
        <button onClick={() => setStep(Math.min(7, currentStep + 1))} className="flex-2 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
          {currentStep === 7 ? "Export PDF" : "Next Step"} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
