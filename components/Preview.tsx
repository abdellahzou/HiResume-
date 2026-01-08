import React from 'react';
import { useResumeStore } from '../store';
import { Translation, ResumeData } from '../types';
import clsx from 'clsx';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';

interface PreviewProps {
  t: Translation;
  className?: string;
}

// Reusable Components
const ContactItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-1.5">
    <Icon size={14} className="opacity-70" />
    <span>{text}</span>
  </div>
);

const SectionHeader = ({ title, className }: { title: string, className?: string }) => (
  <h2 className={clsx("text-lg font-bold uppercase tracking-wider mb-3", className)}>
    {title}
  </h2>
);

// --- TEMPLATE 1: MODERN (Original) ---
const ModernTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-10 font-sans text-slate-800">
    <header className="border-b-2 border-slate-800 pb-6 mb-8">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 mb-2">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <p className="text-xl text-slate-600 mb-4 font-light">
        {resume.personalInfo.title || t.labels.jobTitle}
      </p>
      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
        {resume.personalInfo.email && <ContactItem icon={Mail} text={resume.personalInfo.email} />}
        {resume.personalInfo.phone && <ContactItem icon={Phone} text={resume.personalInfo.phone} />}
        {resume.personalInfo.location && <ContactItem icon={MapPin} text={resume.personalInfo.location} />}
        {resume.personalInfo.website && <ContactItem icon={Globe} text={resume.personalInfo.website} />}
      </div>
    </header>

    {resume.personalInfo.summary && (
      <section className="mb-8">
        <SectionHeader title={t.labels.summary} className="border-b border-gray-300 pb-1" />
        <p className="text-sm text-justify leading-relaxed text-slate-700">{resume.personalInfo.summary}</p>
      </section>
    )}

    {resume.experience.length > 0 && (
      <section className="mb-8">
        <SectionHeader title={t.headings.experience} className="border-b border-gray-300 pb-1" />
        <div className="space-y-6">
          {resume.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base text-slate-900">{exp.position}</h3>
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                  {exp.startDate} – {exp.current ? t.labels.present : exp.endDate}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-600 mb-2">{exp.company}</div>
              <p className="text-sm whitespace-pre-line text-slate-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {resume.education.length > 0 && (
      <section className="mb-8">
        <SectionHeader title={t.headings.education} className="border-b border-gray-300 pb-1" />
        <div className="space-y-4">
          {resume.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base text-slate-900">{edu.school}</h3>
                <span className="text-xs font-medium text-slate-500">
                  {edu.startDate} – {edu.current ? t.labels.present : edu.endDate}
                </span>
              </div>
              <div className="text-sm text-slate-700">{edu.degree}</div>
            </div>
          ))}
        </div>
      </section>
    )}

    {resume.skills.length > 0 && (
      <section>
        <SectionHeader title={t.headings.skills} className="border-b border-gray-300 pb-1" />
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <span key={skill.id} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}
  </div>
);

// --- TEMPLATE 2: CLASSIC ---
const ClassicTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-12 font-serif text-slate-900">
    <header className="text-center mb-8 border-b-2 border-black pb-6">
      <h1 className="text-3xl font-bold uppercase mb-2">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <div className="flex flex-wrap justify-center gap-3 text-sm mb-2">
         {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
         {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
         {resume.personalInfo.email && <span>• {resume.personalInfo.email}</span>}
         {resume.personalInfo.website && <span>• {resume.personalInfo.website}</span>}
      </div>
    </header>

    {resume.personalInfo.summary && (
      <section className="mb-6">
        <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-3 pb-1">{t.labels.summary}</h2>
        <p className="text-sm text-justify leading-normal">{resume.personalInfo.summary}</p>
      </section>
    )}

    {resume.experience.length > 0 && (
      <section className="mb-6">
         <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1">{t.headings.experience}</h2>
        <div className="space-y-4">
          {resume.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between font-bold text-sm">
                <span>{exp.company}, {exp.position}</span>
                <span>{exp.startDate} – {exp.current ? t.labels.present : exp.endDate}</span>
              </div>
              <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {resume.education.length > 0 && (
      <section className="mb-6">
        <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1">{t.headings.education}</h2>
        <div className="space-y-2">
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex justify-between text-sm">
              <div>
                <span className="font-bold">{edu.school}</span>, {edu.degree}
              </div>
              <span className="italic">{edu.startDate} – {edu.current ? t.labels.present : edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {resume.skills.length > 0 && (
      <section>
        <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-3 pb-1">{t.headings.skills}</h2>
        <p className="text-center text-sm">
          {resume.skills.map(s => s.name).join(' • ')}
        </p>
      </section>
    )}
  </div>
);

// --- TEMPLATE 3: MINIMAL ---
const MinimalTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-12 font-sans text-gray-800">
    <header className="mb-10">
      <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <p className="text-lg text-gray-500 mb-4">{resume.personalInfo.title}</p>
      <div className="text-sm text-gray-500 space-y-1">
        {resume.personalInfo.email && <div>{resume.personalInfo.email}</div>}
        {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
        {resume.personalInfo.website && <div>{resume.personalInfo.website}</div>}
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1 space-y-8">
        {resume.education.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{t.headings.education}</h3>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-medium text-sm">{edu.school}</div>
                  <div className="text-xs text-gray-500">{edu.degree}</div>
                  <div className="text-xs text-gray-400 mt-1">{edu.startDate && new Date(edu.startDate).getFullYear()}</div>
                </div>
              ))}
            </div>
          </section>
        )}
         {resume.skills.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{t.headings.skills}</h3>
            <div className="flex flex-col gap-2">
              {resume.skills.map((skill) => (
                <span key={skill.id} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="md:col-span-3 space-y-8">
        {resume.personalInfo.summary && (
          <section>
             <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{t.labels.summary}</h3>
             <p className="text-sm leading-relaxed text-gray-700">{resume.personalInfo.summary}</p>
          </section>
        )}
        
        {resume.experience.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">{t.headings.experience}</h3>
            <div className="space-y-8">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l border-gray-200">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <div className="text-sm text-gray-500 mb-2">{exp.company} | {exp.startDate} - {exp.current ? t.labels.present : exp.endDate}</div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// --- TEMPLATE 4: PROFESSIONAL ---
const ProfessionalTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="flex h-full min-h-[297mm]">
    {/* Sidebar */}
    <div className="w-1/3 bg-slate-100 p-8 border-r border-slate-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2 break-words">
          {resume.personalInfo.fullName || t.labels.fullName}
        </h1>
        <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
          {resume.personalInfo.title}
        </p>
      </div>

      <div className="space-y-6 text-sm">
        <div>
           <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.contact}</h3>
           <div className="space-y-2 text-slate-600">
              {resume.personalInfo.email && <div className="break-all">{resume.personalInfo.email}</div>}
              {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
              {resume.personalInfo.location && <div>{resume.personalInfo.location}</div>}
              {resume.personalInfo.website && <div className="break-all">{resume.personalInfo.website}</div>}
           </div>
        </div>

        {resume.education.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.education}</h3>
            <div className="space-y-3">
              {resume.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-semibold text-slate-800">{edu.school}</div>
                  <div className="text-slate-600">{edu.degree}</div>
                  <div className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.skills.length > 0 && (
           <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.skills}</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {resume.skills.map(skill => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

    {/* Main Content */}
    <div className="w-2/3 p-8">
       {resume.personalInfo.summary && (
         <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-3">{t.labels.summary}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{resume.personalInfo.summary}</p>
         </div>
       )}

       {resume.experience.length > 0 && (
         <div>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">{t.headings.experience}</h3>
            <div className="space-y-6">
              {resume.experience.map(exp => (
                <div key={exp.id}>
                   <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 text-md">{exp.position}</h4>
                      <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {exp.startDate} - {exp.current ? t.labels.present : exp.endDate}
                      </span>
                   </div>
                   <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
                   <p className="text-sm text-slate-700 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
         </div>
       )}
    </div>
  </div>
);

// --- TEMPLATE 5: CREATIVE ---
const CreativeTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="font-sans h-full">
     <header className="bg-slate-900 text-white p-10">
        <h1 className="text-5xl font-bold mb-2">{resume.personalInfo.fullName || t.labels.fullName}</h1>
        <p className="text-xl text-blue-300 font-medium tracking-wide mb-6">{resume.personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-6 text-sm text-slate-300">
          {resume.personalInfo.email && <div className="flex items-center gap-2"><Mail size={16}/> {resume.personalInfo.email}</div>}
          {resume.personalInfo.phone && <div className="flex items-center gap-2"><Phone size={16}/> {resume.personalInfo.phone}</div>}
          {resume.personalInfo.website && <div className="flex items-center gap-2"><Globe size={16}/> {resume.personalInfo.website}</div>}
        </div>
     </header>

     <div className="p-10 grid grid-cols-1 gap-10">
        {resume.personalInfo.summary && (
          <section className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500">
             <p className="text-slate-700 text-lg leading-relaxed italic">"{resume.personalInfo.summary}"</p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-10">
           <div className="col-span-2 space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center"><Briefcase size={18} /></span>
                {t.headings.experience}
              </h2>
              <div className="space-y-8 border-l-2 border-slate-100 pl-8 ml-4">
                 {resume.experience.map(exp => (
                   <div key={exp.id} className="relative">
                      <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm"></div>
                      <h3 className="font-bold text-lg">{exp.position}</h3>
                      <div className="text-blue-600 font-medium mb-1">{exp.company}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">{exp.startDate} — {exp.current ? t.labels.present : exp.endDate}</div>
                      <p className="text-slate-600 whitespace-pre-line">{exp.description}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="col-span-1 space-y-8">
              {resume.skills.length > 0 && (
                <div>
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded flex items-center justify-center"><Award size={18} /></span>
                     {t.headings.skills}
                   </h2>
                   <div className="flex flex-wrap gap-2">
                      {resume.skills.map(skill => (
                        <span key={skill.id} className="px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-md text-sm font-medium text-slate-700">
                           {skill.name}
                        </span>
                      ))}
                   </div>
                </div>
              )}
              
              {resume.education.length > 0 && (
                <div>
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center"><GraduationCap size={18} /></span>
                     {t.headings.education}
                   </h2>
                   <div className="space-y-4">
                     {resume.education.map(edu => (
                       <div key={edu.id} className="bg-slate-50 p-4 rounded-lg">
                          <div className="font-bold text-slate-800">{edu.school}</div>
                          <div className="text-sm text-slate-600">{edu.degree}</div>
                          <div className="text-xs text-slate-400 mt-1">{edu.endDate}</div>
                       </div>
                     ))}
                   </div>
                </div>
              )}
           </div>
        </div>
     </div>
  </div>
);

// --- TEMPLATE 6: EXECUTIVE ---
const ExecutiveTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-12 font-serif text-slate-800 border-t-8 border-slate-800">
     <div className="flex justify-between items-start mb-12">
        <div>
           <h1 className="text-4xl font-bold text-slate-900 mb-2 uppercase tracking-widest">{resume.personalInfo.fullName || t.labels.fullName}</h1>
           <p className="text-lg italic text-slate-600">{resume.personalInfo.title}</p>
        </div>
        <div className="text-right text-sm space-y-1 text-slate-500 font-sans">
           <div className="font-medium text-slate-900">{resume.personalInfo.email}</div>
           <div>{resume.personalInfo.phone}</div>
           <div>{resume.personalInfo.location}</div>
        </div>
     </div>

     {resume.personalInfo.summary && (
        <div className="mb-10 border-b border-slate-200 pb-6">
           <p className="text-lg leading-relaxed text-slate-700">{resume.personalInfo.summary}</p>
        </div>
     )}

     <div className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">{t.headings.experience}</h2>
        <div className="space-y-8">
           {resume.experience.map(exp => (
             <div key={exp.id} className="grid grid-cols-4 gap-6">
                <div className="col-span-1 text-right">
                   <div className="font-bold text-slate-900">{exp.startDate}</div>
                   <div className="text-sm text-slate-500">{exp.endDate}</div>
                </div>
                <div className="col-span-3">
                   <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.position}</h3>
                   <div className="text-slate-600 font-medium italic mb-3">{exp.company}</div>
                   <p className="text-slate-700 leading-relaxed font-sans text-sm">{exp.description}</p>
                </div>
             </div>
           ))}
        </div>
     </div>

     <div className="grid grid-cols-2 gap-12">
        {resume.education.length > 0 && (
           <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">{t.headings.education}</h2>
              <div className="space-y-4">
                 {resume.education.map(edu => (
                   <div key={edu.id}>
                      <div className="font-bold text-slate-900 text-lg">{edu.school}</div>
                      <div className="text-slate-600 italic">{edu.degree}</div>
                   </div>
                 ))}
              </div>
           </div>
        )}
        
        {resume.skills.length > 0 && (
           <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">{t.headings.skills}</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-slate-700 font-medium">
                 {resume.skills.map(skill => (
                   <span key={skill.id}>{skill.name}</span>
                 ))}
              </div>
           </div>
        )}
     </div>
  </div>
);

export const Preview: React.FC<PreviewProps> = ({ t, className }) => {
  const { resume } = useResumeStore();

  const TemplateComponent = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
  }[resume.templateId];

  return (
    <div id="resume-preview" className={clsx("a4-page bg-white shadow-lg mx-auto", className)}>
      <TemplateComponent resume={resume} t={t} />
    </div>
  );
};