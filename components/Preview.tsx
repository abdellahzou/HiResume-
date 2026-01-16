import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useResumeStore } from '../store';
import { Translation, ResumeData } from '../types';
import clsx from 'clsx';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, FolderGit2, Star } from 'lucide-react';

interface PreviewProps {
  t: Translation;
  className?: string;
}

// A4 Dimensions in Pixels (96 DPI)
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// Reusable Components
const ContactItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-1.5">
    <Icon size={14} className="opacity-70" />
    <span>{text}</span>
  </div>
);

const SectionHeader = ({ title, className }: { title: string, className?: string }) => (
  <h2 className={clsx("text-lg font-bold uppercase tracking-wider mb-[var(--item-spacing)] print:mb-2", className)}>
    {title}
  </h2>
);

// Dynamic spacing styles injected via CSS variables
const dynamicStyles = {
  section: { marginBottom: 'var(--section-spacing)' },
  item: { marginBottom: 'var(--item-spacing)' },
};

// --- TEMPLATE 1: MODERN ---
const ModernTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-10 font-sans text-slate-800 h-full">
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

    <div className="content-flow">
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

      {resume.customItems && resume.customItems.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader 
            title={resume.customSectionTitle || "Custom Section"} 
            className="border-b border-gray-300 pb-1" 
          />
          <div className="space-y-[var(--item-spacing)]">
            {resume.customItems.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
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
                  {proj.link && <span className="text-xs text-blue-600 underline">{proj.link}</span>}
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

      {resume.certifications.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader title={t.headings.certifications} className="border-b border-gray-300 pb-1" />
          <div className="space-y-2">
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-sm">
                <div>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  {cert.issuer && <span className="text-slate-600"> - {cert.issuer}</span>}
                </div>
                <span className="text-xs text-slate-500">{cert.date}</span>
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
  <div className="p-12 font-serif text-slate-900 h-full">
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

    <div className="content-flow">
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
                <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
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
                <p className="text-sm mt-1 whitespace-pre-line">{item.description}</p>
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
                  {proj.link && <span className="font-normal italic">{proj.link}</span>}
                </div>
                <p className="text-sm mt-1 whitespace-pre-line">{proj.description}</p>
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
                <div>
                  <span className="font-bold">{edu.school}</span>, {edu.degree}
                </div>
                <span className="italic">{edu.startDate} – {edu.current ? t.labels.present : edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section style={dynamicStyles.section}>
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1">{t.headings.certifications}</h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between text-sm">
                <div><span className="font-bold">{cert.name}</span>{cert.issuer && `, ${cert.issuer}`}</div>
                <span className="italic">{cert.date}</span>
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
  </div>
);

// --- TEMPLATE 3: MINIMAL ---
const MinimalTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-12 font-sans text-gray-800 h-full">
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

    <div className="grid grid-cols-4 gap-8">
      <div className="col-span-1 space-y-[var(--section-spacing)]">
        {resume.education.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{t.headings.education}</h3>
            <div className="space-y-[var(--item-spacing)]">
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
        
        {resume.certifications.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{t.headings.certifications}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.certifications.map((cert) => (
                <div key={cert.id}>
                  <div className="font-medium text-sm">{cert.name}</div>
                  <div className="text-xs text-gray-500">{cert.issuer}</div>
                  <div className="text-xs text-gray-400 mt-1">{cert.date}</div>
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
        {resume.personalInfo.summary && (
          <section>
             <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{t.labels.summary}</h3>
             <p className="text-sm leading-relaxed text-gray-700">{resume.personalInfo.summary}</p>
          </section>
        )}
        
        {resume.experience.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">{t.headings.experience}</h3>
            <div className="space-y-[var(--item-spacing)]">
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

        {resume.customItems && resume.customItems.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">
              {resume.customSectionTitle || "Custom Section"}
            </h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.customItems.map((item) => (
                <div key={item.id} className="relative pl-6 border-l border-gray-200">
                   <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                   <h4 className="font-bold text-gray-900">{item.name}</h4>
                   <div className="text-sm text-gray-500 mb-2">
                     {item.city ? `${item.city} | ` : ''}{item.startDate} - {item.current ? t.labels.present : item.endDate}
                   </div>
                   <p className="text-sm text-gray-700 whitespace-pre-line">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.projects.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">{t.headings.projects}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="relative pl-6 border-l border-gray-200">
                   <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                   <h4 className="font-bold text-gray-900">{proj.name}</h4>
                   {proj.link && <div className="text-xs text-blue-500 mb-1">{proj.link}</div>}
                   <p className="text-sm text-gray-700">{proj.description}</p>
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
  <div className="flex h-full min-h-[1123px]">
    {/* Sidebar */}
    <div className="w-1/3 bg-slate-100 p-8 border-r border-slate-200 flex flex-col gap-[var(--section-spacing)]">
      <div className="mb-8">
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
              {resume.personalInfo.website && <div className="break-all">{resume.personalInfo.website}</div>}
           </div>
        </div>

        {resume.education.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.education}</h3>
            <div className="space-y-[var(--item-spacing)]">
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

        {resume.certifications.length > 0 && (
           <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs">{t.headings.certifications}</h3>
            <div className="space-y-2 text-slate-700">
              {resume.certifications.map(cert => (
                <div key={cert.id}>
                  <div className="font-medium">{cert.name}</div>
                  <div className="text-xs text-slate-500">{cert.issuer} • {cert.date}</div>
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
    <div className="w-2/3 p-8 content-flow">
       {resume.personalInfo.summary && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-3">{t.labels.summary}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{resume.personalInfo.summary}</p>
         </div>
       )}

       {resume.experience.length > 0 && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">{t.headings.experience}</h3>
            <div className="space-y-[var(--item-spacing)]">
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

       {resume.customItems && resume.customItems.length > 0 && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">
              {resume.customSectionTitle || "Custom Section"}
            </h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.customItems.map(item => (
                <div key={item.id}>
                   <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 text-md">{item.name}</h4>
                      <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {item.startDate} - {item.current ? t.labels.present : item.endDate}
                      </span>
                   </div>
                   {item.city && <div className="text-sm font-medium text-slate-600 mb-2">{item.city}</div>}
                   <p className="text-sm text-slate-700 whitespace-pre-line">{item.description}</p>
                </div>
              ))}
            </div>
         </div>
       )}

       {resume.projects.length > 0 && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">{t.headings.projects}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.projects.map(proj => (
                <div key={proj.id}>
                   <h4 className="font-bold text-slate-900 text-md">{proj.name}</h4>
                   {proj.link && <a href={proj.link} className="text-xs text-blue-600 block mb-1">{proj.link}</a>}
                   <p className="text-sm text-slate-700">{proj.description}</p>
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

     <div className="p-10 grid grid-cols-1 gap-[var(--section-spacing)]">
        {resume.personalInfo.summary && (
          <section className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500">
             <p className="text-slate-700 text-lg leading-relaxed italic">"{resume.personalInfo.summary}"</p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-10">
           <div className="col-span-2 space-y-[var(--section-spacing)]">
              {resume.experience.length > 0 && (
                <div>
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
                          <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">{exp.startDate} — {exp.current ? t.labels.present : exp.endDate}</div>
                          <p className="text-slate-600 whitespace-pre-line">{exp.description}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {resume.customItems && resume.customItems.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded flex items-center justify-center">
                       <Star size={18} />
                    </span>
                    {resume.customSectionTitle || "Custom Section"}
                  </h2>
                  <div className="space-y-[var(--item-spacing)] border-l-2 border-slate-100 pl-8 ml-4">
                     {resume.customItems.map(item => (
                       <div key={item.id} className="relative">
                          <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white bg-pink-500 shadow-sm"></div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          {item.city && <div className="text-pink-600 font-medium mb-1">{item.city}</div>}
                          <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">{item.startDate} — {item.current ? t.labels.present : item.endDate}</div>
                          <p className="text-slate-600 whitespace-pre-line">{item.description}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {resume.projects.length > 0 && (
                 <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center"><FolderGit2 size={18} /></span>
                    {t.headings.projects}
                  </h2>
                  <div className="space-y-[var(--item-spacing)] pl-2">
                     {resume.projects.map(proj => (
                       <div key={proj.id} className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start">
                             <h3 className="font-bold text-lg">{proj.name}</h3>
                             {proj.link && <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Link</span>}
                          </div>
                          <p className="text-slate-600 mt-2">{proj.description}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}
           </div>

           <div className="col-span-1 space-y-[var(--section-spacing)]">
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
                   <div className="space-y-[var(--item-spacing)]">
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

              {resume.certifications.length > 0 && (
                 <div>
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded flex items-center justify-center"><Award size={18} /></span>
                     {t.headings.certifications}
                   </h2>
                   <div className="space-y-3">
                     {resume.certifications.map(cert => (
                       <div key={cert.id} className="border-l-2 border-yellow-400 pl-3">
                          <div className="font-bold text-sm text-slate-800">{cert.name}</div>
                          <div className="text-xs text-slate-500">{cert.issuer}</div>
                          <div className="text-xs text-slate-400">{cert.date}</div>
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
  <div className="p-12 font-serif text-slate-800 border-t-8 border-slate-800 h-full">
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

     <div className="content-flow">
       {resume.personalInfo.summary && (
          <div style={dynamicStyles.section} className="border-b border-slate-200 pb-6">
             <p className="text-lg leading-relaxed text-slate-700">{resume.personalInfo.summary}</p>
          </div>
       )}

       {resume.experience.length > 0 && (
         <div style={dynamicStyles.section}>
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
                       <div className="text-slate-600 font-medium italic mb-3">{exp.company}</div>
                       <p className="text-slate-700 leading-relaxed font-sans text-sm">{exp.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       )}

       {resume.customItems && resume.customItems.length > 0 && (
         <div style={dynamicStyles.section}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
              {resume.customSectionTitle || "Custom Section"}
            </h2>
            <div className="space-y-[var(--item-spacing)]">
               {resume.customItems.map(item => (
                 <div key={item.id} className="grid grid-cols-4 gap-6">
                    <div className="col-span-1 text-right">
                       <div className="font-bold text-slate-900">{item.startDate}</div>
                       <div className="text-sm text-slate-500">{item.endDate}</div>
                    </div>
                    <div className="col-span-3">
                       <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                       {item.city && <div className="text-slate-600 font-medium italic mb-3">{item.city}</div>}
                       <p className="text-slate-700 leading-relaxed font-sans text-sm">{item.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       )}

       {resume.projects.length > 0 && (
         <div style={dynamicStyles.section}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">{t.headings.projects}</h2>
            <div className="space-y-[var(--item-spacing)]">
               {resume.projects.map(proj => (
                 <div key={proj.id} className="grid grid-cols-4 gap-6">
                    <div className="col-span-1 text-right">
                       <div className="text-sm text-slate-500 italic">Project</div>
                    </div>
                    <div className="col-span-3">
                       <h3 className="text-lg font-bold text-slate-900">{proj.name}</h3>
                       {proj.link && <div className="text-xs text-blue-800 mb-1">{proj.link}</div>}
                       <p className="text-slate-700 leading-relaxed font-sans text-sm">{proj.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       )}

       <div className="grid grid-cols-2 gap-12">
          <div className="space-y-[var(--section-spacing)]">
            {resume.education.length > 0 && (
               <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">{t.headings.education}</h2>
                  <div className="space-y-[var(--item-spacing)]">
                     {resume.education.map(edu => (
                       <div key={edu.id}>
                          <div className="font-bold text-slate-900 text-lg">{edu.school}</div>
                          <div className="text-slate-600 italic">{edu.degree}</div>
                       </div>
                     ))}
                  </div>
               </div>
            )}
            
            {resume.certifications.length > 0 && (
               <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">{t.headings.certifications}</h2>
                  <div className="space-y-3">
                     {resume.certifications.map(cert => (
                       <div key={cert.id}>
                          <div className="font-bold text-slate-900">{cert.name}</div>
                          <div className="text-sm text-slate-500">{cert.issuer} • {cert.date}</div>
                       </div>
                     ))}
                  </div>
               </div>
            )}
          </div>
          
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
  </div>
);

export const Preview: React.FC<PreviewProps> = ({ t, className }) => {
  const { resume } = useResumeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State for layout adjustments
  const [displayScale, setDisplayScale] = useState(1);
  const [spacingScale, setSpacingScale] = useState(1);
  const [contentScale, setContentScale] = useState(1);

  const TemplateComponent = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
  }[resume.templateId];

  // --- AUTOMATIC SORTING LOGIC ---
  const sortedResume = useMemo(() => {
    const sortGeneral = (items: any[]) => {
      if (!items) return [];
      return [...items].sort((a, b) => {
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        const dateA = new Date(a.endDate || 0).getTime();
        const dateB = new Date(b.endDate || 0).getTime();
        if (dateB !== dateA) return dateB - dateA;
        const startA = new Date(a.startDate || 0).getTime();
        const startB = new Date(b.startDate || 0).getTime();
        return startB - startA;
      });
    };

    const sortCertifications = (items: any[]) => {
      if (!items) return [];
      return [...items].sort((a, b) => {
         const dateA = new Date(a.date || 0).getTime();
         const dateB = new Date(b.date || 0).getTime();
         return dateB - dateA;
      });
    };

    const safeResume = resume as any;

    return {
      ...resume,
      experience: sortGeneral(resume.experience),
      education: sortGeneral(resume.education),
      customItems: sortGeneral(safeResume.customItems || []),
      certifications: sortCertifications(resume.certifications)
    };
  }, [resume]);


  // --- 1. DISPLAY SCALING LOGIC (Fit A4 to Screen) ---
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const availableWidth = Math.max(width - 10, 0); 
        const newScale = Math.min(availableWidth / A4_WIDTH_PX, 1);
        setDisplayScale(Math.max(0.1, newScale));
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- 2. CONTENT SPACING & SCALING LOGIC (Fix Overflow) ---
  useEffect(() => {
    // Reset to initial state
    setSpacingScale(1);
    setContentScale(1);

    const fitContent = () => {
      if (!contentRef.current) return;
      const contentHeight = contentRef.current.scrollHeight;
      const MAX_HEIGHT = A4_HEIGHT_PX - 40; 

      if (contentHeight > MAX_HEIGHT) {
        // Content Overflowing
        let newSpacing = 1;
        const overflowRatio = contentHeight / MAX_HEIGHT;
        
        if (overflowRatio < 1.15) {
            newSpacing = Math.max(0.4, 1.4 - (overflowRatio - 1) * 4);
            setSpacingScale(newSpacing);
        } else {
            newSpacing = 0.4;
            setSpacingScale(0.4);
            
            const approximatedHeight = contentHeight * 0.90; 
            if (approximatedHeight > MAX_HEIGHT) {
                const zoom = MAX_HEIGHT / approximatedHeight;
                setContentScale(Math.max(0.65, zoom)); 
            }
        }
      } else {
        // Content Fits
        const emptySpace = MAX_HEIGHT - contentHeight;
        if (emptySpace > 100) {
             const expansionFactor = 1 + (emptySpace / 1500);
             setSpacingScale(Math.min(2.0, expansionFactor));
        }
      }
    };

    const timer = setTimeout(fitContent, 50);
    return () => clearTimeout(timer);
  }, [sortedResume, t, resume.templateId]); 

  // Variables injected into the A4 container
  const contentStyles = {
    '--section-spacing': `${2 * spacingScale}rem`,
    '--item-spacing': `${0.75 * spacingScale}rem`,
    '--content-scale': contentScale,
  } as React.CSSProperties;

  return (
    <div 
      id="preview-wrapper"
      ref={containerRef}
      className={clsx("w-full h-full flex justify-center bg-gray-100/50 overflow-hidden", className)}
    >
      <div 
        id="resume-preview-wrapper"
        className="relative"
        style={{
          transform: `scale(${displayScale})`,
          transformOrigin: 'top center',
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
          flexShrink: 0,
        }}
      >
        <div
          id="resume-preview-content"
          ref={contentRef}
          className="bg-white shadow-2xl w-full h-full overflow-hidden mx-auto"
          style={contentStyles}
        >
            {/* 
                CONTENT ZOOM WRAPPER:
                - transformOrigin: 'top left' ensures it anchors to the left (Fixing the empty left margin).
                - width: increases to compensate for scale, filling the page width.
            */}
            <div style={{ 
                transform: `scale(var(--content-scale))`, 
                transformOrigin: 'top left',
                width: 'calc(100% / var(--content-scale))',
                height: '100%'
            }}>
                <TemplateComponent resume={sortedResume} t={t} />
            </div>
        </div>
      </div>
      
      {/* Phantom Spacer for scrolling */}
      <div 
         className="print:hidden"
         style={{ 
             height: `${A4_HEIGHT_PX * displayScale + 20}px`, 
             width: '1px', 
             position: 'absolute',
             pointerEvents: 'none'
         }} 
      />
    </div>
  );
};
