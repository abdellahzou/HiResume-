import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useResumeStore } from '../store';
import { Translation, ResumeData } from '../types';
import clsx from 'clsx';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, FolderGit2, Star } from 'lucide-react';

interface PreviewProps {
  t: Translation;
  className?: string;
}

// A4 Constants at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// Reusable Components
const ContactItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-1.5 min-w-0">
    <Icon size={14} className="opacity-70 flex-shrink-0" />
    <span className="truncate">{text}</span>
  </div>
);

const SectionHeader = ({ title, className }: { title: string, className?: string }) => (
  <h2 className={clsx("text-lg font-bold uppercase tracking-wider mb-[var(--item-spacing)]", className)}>
    {title}
  </h2>
);

const dynamicStyles = {
  section: { marginBottom: 'var(--section-spacing)' },
  item: { marginBottom: 'var(--item-spacing)' },
};

// --- TEMPLATE 1: MODERN ---
const ModernTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-10 font-sans text-slate-800 h-full flex flex-col">
    <header className="border-b-2 border-slate-800 pb-6 mb-8 flex-shrink-0">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 mb-2 leading-none">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <p className="text-xl text-slate-600 mb-4 font-light">
        {resume.personalInfo.title || t.labels.jobTitle}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
        {resume.personalInfo.email && <ContactItem icon={Mail} text={resume.personalInfo.email} />}
        {resume.personalInfo.phone && <ContactItem icon={Phone} text={resume.personalInfo.phone} />}
        {resume.personalInfo.location && <ContactItem icon={MapPin} text={resume.personalInfo.location} />}
        {resume.personalInfo.website && <ContactItem icon={Globe} text={resume.personalInfo.website} />}
      </div>
    </header>

    <div className="flex-1 overflow-hidden">
      {resume.personalInfo.summary && (
        <section style={dynamicStyles.section}>
          <SectionHeader title={t.labels.summary} className="border-b border-gray-300 pb-1" />
          <p className="text-sm text-justify leading-relaxed text-slate-700">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader title={t.headings.experience} className="border-b border-gray-300 pb-1" />
          <div className="space-y-[var(--item-spacing)]">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base text-slate-900">{exp.position}</h3>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-4">
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

      {resume.customItems && resume.customItems.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader title={resume.customSectionTitle || "Custom Section"} className="border-b border-gray-300 pb-1" />
          <div className="space-y-[var(--item-spacing)]">
            {resume.customItems.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-4">
                    {item.startDate} – {item.current ? t.labels.present : item.endDate}
                  </span>
                </div>
                {item.city && <div className="text-sm font-semibold text-slate-600 mb-2">{item.city}</div>}
                <p className="text-sm whitespace-pre-line text-slate-700 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader title={t.headings.projects} className="border-b border-gray-300 pb-1" />
          <div className="space-y-[var(--item-spacing)]">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base text-slate-900">{proj.name}</h3>
                  {proj.link && <span className="text-xs text-blue-600 underline ml-4 break-all">{proj.link}</span>}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader title={t.headings.education} className="border-b border-gray-300 pb-1" />
          <div className="space-y-[var(--item-spacing)]">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base text-slate-900">{edu.school}</h3>
                  <span className="text-xs font-medium text-slate-500 ml-4">
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
  </div>
);

// --- TEMPLATE 2: CLASSIC ---
const ClassicTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-12 font-serif text-slate-900 h-full flex flex-col">
    <header className="text-center mb-8 border-b-2 border-black pb-6 flex-shrink-0">
      <h1 className="text-3xl font-bold uppercase mb-2">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <div className="flex flex-wrap justify-center gap-3 text-sm">
         {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
         {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
         {resume.personalInfo.email && <span>• {resume.personalInfo.email}</span>}
         {resume.personalInfo.website && <span>• {resume.personalInfo.website}</span>}
      </div>
    </header>

    <div className="flex-1 overflow-hidden">
      {resume.personalInfo.summary && (
        <section style={dynamicStyles.section}>
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-3 pb-1">{t.labels.summary}</h2>
          <p className="text-sm text-justify leading-normal">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section style={dynamicStyles.section}>
           <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1">{t.headings.experience}</h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.company}, {exp.position}</span>
                  <span>{exp.startDate} – {exp.current ? t.labels.present : exp.endDate}</span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-line leading-snug">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.customItems && resume.customItems.length > 0 && (
        <section style={dynamicStyles.section}>
           <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1">
             {resume.customSectionTitle || "Custom Section"}
           </h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.customItems.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{item.name} {item.city ? `, ${item.city}` : ''}</span>
                  <span>{item.startDate} – {item.current ? t.labels.present : item.endDate}</span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-line leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section style={dynamicStyles.section}>
           <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1">{t.headings.projects}</h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{proj.name}</span>
                  {proj.link && <span className="font-normal italic break-all ml-4">{proj.link}</span>}
                </div>
                <p className="text-sm mt-1 whitespace-pre-line leading-snug">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section style={dynamicStyles.section}>
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1">{t.headings.education}</h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-sm">
                <div><span className="font-bold">{edu.school}</span>, {edu.degree}</div>
                <span className="italic">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-3 pb-1">{t.headings.skills}</h2>
          <p className="text-center text-sm">{resume.skills.map(s => s.name).join(' • ')}</p>
        </section>
      )}
    </div>
  </div>
);

// --- TEMPLATE 3: MINIMAL ---
const MinimalTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-12 font-sans text-gray-800 h-full flex flex-col">
    <header className="mb-10 flex-shrink-0">
      <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <p className="text-lg text-gray-500 mb-4">{resume.personalInfo.title}</p>
      <div className="text-sm text-gray-500 flex gap-4">
        {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
        {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
      </div>
    </header>

    <div className="grid grid-cols-4 gap-12 flex-1 overflow-hidden">
      <div className="col-span-1 space-y-[var(--section-spacing)]">
        {resume.education.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{t.headings.education}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-medium text-sm">{edu.school}</div>
                  <div className="text-xs text-gray-400 mt-1">{edu.endDate}</div>
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

      <div className="col-span-3 space-y-[var(--section-spacing)]">
        {resume.experience.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">{t.headings.experience}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l border-gray-200">
                  <div className="absolute -left-[5.5px] top-1.5 w-[10px] h-[10px] rounded-full bg-gray-200"></div>
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <div className="text-sm text-gray-500 mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {resume.customItems && resume.customItems.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">{resume.customSectionTitle || "Custom"}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.customItems.map((item) => (
                <div key={item.id} className="relative pl-6 border-l border-gray-200">
                  <div className="absolute -left-[5.5px] top-1.5 w-[10px] h-[10px] rounded-full bg-gray-200"></div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <div className="text-sm text-gray-500 mb-2">{item.startDate} - {item.endDate}</div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{item.description}</p>
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
  <div className="flex h-full w-full overflow-hidden">
    <div className="w-1/3 bg-slate-100 p-8 border-r border-slate-200 flex flex-col gap-[var(--section-spacing)] flex-shrink-0">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2 break-words">
          {resume.personalInfo.fullName || t.labels.fullName}
        </h1>
        <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
          {resume.personalInfo.title}
        </p>
      </div>

      <div className="space-y-[var(--section-spacing)] text-sm">
        <div>
           <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.contact}</h3>
           <div className="space-y-2 text-slate-600">
              {resume.personalInfo.email && <div className="break-all">{resume.personalInfo.email}</div>}
              {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
              {resume.personalInfo.location && <div>{resume.personalInfo.location}</div>}
           </div>
        </div>

        {resume.education.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.education}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-semibold text-slate-800">{edu.school}</div>
                  <div className="text-xs text-slate-500">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.skills.length > 0 && (
           <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.skills}</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {resume.skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>

    <div className="w-2/3 p-8 flex flex-col overflow-hidden">
       {resume.personalInfo.summary && (
         <section style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-3">{t.labels.summary}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{resume.personalInfo.summary}</p>
         </section>
       )}

       {resume.experience.length > 0 && (
         <section style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">{t.headings.experience}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.experience.map(exp => (
                <div key={exp.id}>
                   <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 text-md">{exp.position}</h4>
                      <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {exp.startDate} - {exp.endDate}
                      </span>
                   </div>
                   <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
                   <p className="text-sm text-slate-700 whitespace-pre-line leading-snug">{exp.description}</p>
                </div>
              ))}
            </div>
         </section>
       )}

       {resume.projects.length > 0 && (
         <section style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">{t.headings.projects}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.projects.map(proj => (
                <div key={proj.id}>
                   <h4 className="font-bold text-slate-900 text-md">{proj.name}</h4>
                   {proj.link && <span className="text-xs text-blue-600 block mb-1 break-all">{proj.link}</span>}
                   <p className="text-sm text-slate-700 leading-snug">{proj.description}</p>
                </div>
              ))}
            </div>
         </section>
       )}
    </div>
  </div>
);

// --- TEMPLATE 5: CREATIVE ---
const CreativeTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="font-sans h-full flex flex-col overflow-hidden">
     <header className="bg-slate-900 text-white p-10 flex-shrink-0">
        <h1 className="text-5xl font-bold mb-2">{resume.personalInfo.fullName || t.labels.fullName}</h1>
        <p className="text-xl text-blue-300 font-medium tracking-wide mb-6">{resume.personalInfo.title}</p>
        <div className="flex flex-wrap gap-6 text-sm text-slate-300">
          {resume.personalInfo.email && <div className="flex items-center gap-2"><Mail size={16}/> {resume.personalInfo.email}</div>}
          {resume.personalInfo.phone && <div className="flex items-center gap-2"><Phone size={16}/> {resume.personalInfo.phone}</div>}
        </div>
     </header>

     <div className="p-10 flex-1 overflow-hidden">
        <div className="grid grid-cols-3 gap-10 h-full">
           <div className="col-span-2 space-y-[var(--section-spacing)]">
              {resume.experience.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center"><Briefcase size={18} /></span>
                    {t.headings.experience}
                  </h2>
                  <div className="space-y-[var(--item-spacing)] border-l-2 border-slate-100 pl-8 ml-4">
                     {resume.experience.map(exp => (
                       <div key={exp.id} className="relative">
                          <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm"></div>
                          <h3 className="font-bold text-lg">{exp.position}</h3>
                          <div className="text-blue-600 font-medium mb-1">{exp.company}</div>
                          <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">{exp.startDate} — {exp.endDate}</div>
                          <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                       </div>
                     ))}
                  </div>
                </section>
              )}
           </div>

           <div className="col-span-1 space-y-[var(--section-spacing)]">
              {resume.skills.length > 0 && (
                <section>
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded flex items-center justify-center"><Award size={18} /></span>
                     {t.headings.skills}
                   </h2>
                   <div className="flex flex-wrap gap-2">
                      {resume.skills.map(skill => (
                        <span key={skill.id} className="px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-md text-xs font-medium text-slate-700">
                           {skill.name}
                        </span>
                      ))}
                   </div>
                </section>
              )}
              {resume.education.length > 0 && (
                <section>
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center"><GraduationCap size={18} /></span>
                     {t.headings.education}
                   </h2>
                   <div className="space-y-4">
                     {resume.education.map(edu => (
                       <div key={edu.id} className="bg-slate-50 p-4 rounded-lg">
                          <div className="font-bold text-sm text-slate-800">{edu.school}</div>
                          <div className="text-xs text-slate-600">{edu.degree}</div>
                          <div className="text-xs text-slate-400 mt-1">{edu.endDate}</div>
                       </div>
                     ))}
                   </div>
                </section>
              )}
           </div>
        </div>
     </div>
  </div>
);

// --- TEMPLATE 6: EXECUTIVE ---
const ExecutiveTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-12 font-serif text-slate-800 border-t-8 border-slate-800 h-full flex flex-col overflow-hidden">
     <div className="flex justify-between items-start mb-12 flex-shrink-0">
        <div>
           <h1 className="text-4xl font-bold text-slate-900 mb-2 uppercase tracking-widest">{resume.personalInfo.fullName || t.labels.fullName}</h1>
           <p className="text-lg italic text-slate-600">{resume.personalInfo.title}</p>
        </div>
        <div className="text-right text-sm space-y-1 text-slate-500 font-sans">
           <div className="font-medium text-slate-900 break-all">{resume.personalInfo.email}</div>
           <div>{resume.personalInfo.phone}</div>
           <div>{resume.personalInfo.location}</div>
        </div>
     </div>

     <div className="flex-1 overflow-hidden">
       {resume.personalInfo.summary && (
          <section style={dynamicStyles.section} className="border-b border-slate-200 pb-6">
             <p className="text-lg leading-relaxed text-slate-700">{resume.personalInfo.summary}</p>
          </section>
       )}

       {resume.experience.length > 0 && (
         <section style={dynamicStyles.section}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">{t.headings.experience}</h2>
            <div className="space-y-[var(--item-spacing)]">
               {resume.experience.map(exp => (
                 <div key={exp.id} className="grid grid-cols-4 gap-6">
                    <div className="col-span-1 text-right">
                       <div className="font-bold text-slate-900">{exp.startDate}</div>
                       <div className="text-sm text-slate-500">{exp.endDate}</div>
                    </div>
                    <div className="col-span-3">
                       <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.position}</h3>
                       <div className="text-slate-600 font-medium italic mb-2">{exp.company}</div>
                       <p className="text-slate-700 leading-relaxed font-sans text-sm">{exp.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </section>
       )}

       <div className="grid grid-cols-2 gap-12">
          {resume.education.length > 0 && (
             <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">{t.headings.education}</h2>
                <div className="space-y-4">
                   {resume.education.map(edu => (
                     <div key={edu.id}>
                        <div className="font-bold text-slate-900 text-base">{edu.school}</div>
                        <div className="text-slate-600 italic text-sm">{edu.degree}</div>
                     </div>
                   ))}
                </div>
             </section>
          )}
          {resume.skills.length > 0 && (
             <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">{t.headings.skills}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm text-slate-700">
                   {resume.skills.map(skill => <span key={skill.id}>{skill.name}</span>)}
                </div>
             </section>
          )}
       </div>
    </div>
  </div>
);

export const Preview: React.FC<PreviewProps> = ({ t, className }) => {
  const { resume } = useResumeStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [displayScale, setDisplayScale] = useState(1);
  const [spacingScale, setSpacingScale] = useState(1);

  // Selector for templates
  const TemplateComponent = useMemo(() => {
    const map = {
      modern: ModernTemplate,
      classic: ClassicTemplate,
      minimal: MinimalTemplate,
      professional: ProfessionalTemplate,
      creative: CreativeTemplate,
      executive: ExecutiveTemplate,
    };
    return map[resume.templateId as keyof typeof map] || ModernTemplate;
  }, [resume.templateId]);

  // Sort logic (Current first, then by date)
  const sortedResume = useMemo(() => {
    const sortGeneral = (items: any[]) => {
      if (!items) return [];
      return [...items].sort((a, b) => {
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        const dateA = new Date(a.endDate || 0).getTime();
        const dateB = new Date(b.endDate || 0).getTime();
        return dateB - dateA;
      });
    };

    return {
      ...resume,
      experience: sortGeneral(resume.experience),
      education: sortGeneral(resume.education),
      customItems: sortGeneral((resume as any).customItems || []),
      certifications: sortGeneral(resume.certifications),
    };
  }, [resume]);

  // 1. DISPLAY SCALING (WYSIWYG Fitting)
  // This effect calculates how to scale the 794px container to fit its parent viewport
  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;
      const parentWidth = wrapperRef.current.parentElement?.clientWidth || A4_WIDTH;
      // We scale the A4_WIDTH to fit the parent width with 32px padding
      const newScale = (parentWidth - 32) / A4_WIDTH; 
      setDisplayScale(newScale);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (wrapperRef.current?.parentElement) {
      resizeObserver.observe(wrapperRef.current.parentElement);
    }
    
    handleResize();
    return () => resizeObserver.disconnect();
  }, []);

  // 2. CONTENT AUTO-FITTING (Single Page Logic)
  // This measures the scrollHeight of the fixed-width content and adjusts spacing CSS variables
  useEffect(() => {
    setSpacingScale(1); // Reset for measurement

    const fitContent = () => {
      if (!contentRef.current) return;
      
      const currentHeight = contentRef.current.scrollHeight;
      const targetHeight = A4_HEIGHT;

      // If content overflows A4 height, reduce spacing variables
      if (currentHeight > targetHeight) {
        const ratio = targetHeight / currentHeight;
        setSpacingScale(Math.max(0.4, ratio)); // Don't go below 40% spacing
      } else {
        // If content is short, slightly expand spacing to fill the page
        const expansionFactor = 1 + ((targetHeight - currentHeight) / 1200);
        setSpacingScale(Math.min(1.8, expansionFactor)); // Max 1.8x expansion
      }
    };

    // Use a small delay to ensure DOM has painted after state changes
    const timer = setTimeout(fitContent, 60);
    return () => clearTimeout(timer);
  }, [sortedResume, resume.templateId, t]);

  const layoutStyles = {
    '--section-spacing': `${1.5 * spacingScale}rem`,
    '--item-spacing': `${0.6 * spacingScale}rem`,
  } as React.CSSProperties;

  return (
    <div 
      ref={wrapperRef}
      className={clsx("relative w-full flex justify-center bg-slate-100/50 py-10 print:p-0 print:bg-white", className)}
      style={{ height: `${A4_HEIGHT * displayScale + 80}px` }}
    >
      <div 
        id="resume-preview"
        ref={contentRef}
        style={{
          ...layoutStyles,
          width: `${A4_WIDTH}px`,
          height: `${A4_HEIGHT}px`,
          transform: `scale(${displayScale})`,
          transformOrigin: 'top center',
        }}
        className="bg-white shadow-2xl origin-top print:shadow-none print:transform-none print:m-0 overflow-hidden absolute top-10 print:top-0"
      >
        <TemplateComponent resume={sortedResume} t={t} />
      </div>
    </div>
  );
};
