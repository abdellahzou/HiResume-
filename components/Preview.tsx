import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useResumeStore } from '../store';
import { Translation, ResumeData } from '../types';
import clsx from 'clsx';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, FolderGit2, Star } from 'lucide-react';

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
  <h2 className={clsx("text-lg font-bold uppercase tracking-wider mb-[var(--item-spacing)] print:mb-2", className)}>
    {title}
  </h2>
);

const dynamicStyles = {
  section: { marginBottom: 'var(--section-spacing)' },
  item: { marginBottom: 'var(--item-spacing)' },
};

// --- TEMPLATE 1: MODERN ---
const ModernTemplate: React.FC<{ resume: ResumeData, t: Translation }> = ({ resume, t }) => (
  <div className="p-10 font-sans text-slate-800 print:p-8">
    <header className="border-b-2 border-slate-800 pb-6 mb-8 print:pb-3 print:mb-4">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 mb-2 print:mb-1">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <p className="text-xl text-slate-600 mb-4 font-light print:mb-2">
        {resume.personalInfo.title || t.labels.jobTitle}
      </p>
      <div className="flex flex-wrap gap-4 text-sm text-slate-600 print:gap-2">
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
          <p className="text-sm text-justify leading-relaxed text-slate-700 print:leading-tight">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader title={t.headings.experience} className="border-b border-gray-300 pb-1" />
          <div className="space-y-[var(--item-spacing)]">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1 print:mb-0.5">
                  <h3 className="font-bold text-base text-slate-900">{exp.position}</h3>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    {exp.startDate} – {exp.current ? t.labels.present : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-600 mb-2 print:mb-1">{exp.company}</div>
                <p className="text-sm whitespace-pre-line text-slate-700 leading-relaxed print:leading-tight">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- CUSTOM SECTION (MODERN) --- */}
      {resume.customItems && resume.customItems.length > 0 && (
        <section style={dynamicStyles.section}>
          <SectionHeader 
            title={resume.customSectionTitle || "Custom Section"} 
            className="border-b border-gray-300 pb-1" 
          />
          <div className="space-y-[var(--item-spacing)]">
            {resume.customItems.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline mb-1 print:mb-0.5">
                  <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    {item.startDate} – {item.current ? t.labels.present : item.endDate}
                  </span>
                </div>
                {item.city && <div className="text-sm font-semibold text-slate-600 mb-2 print:mb-1">{item.city}</div>}
                <p className="text-sm whitespace-pre-line text-slate-700 leading-relaxed print:leading-tight">{item.description}</p>
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
                <div className="flex justify-between items-baseline mb-1 print:mb-0.5">
                  <h3 className="font-bold text-base text-slate-900">{proj.name}</h3>
                  {proj.link && <span className="text-xs text-blue-600 underline">{proj.link}</span>}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed print:leading-tight">{proj.description}</p>
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
          <div className="space-y-2 print:space-y-1">
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
          <div className="flex flex-wrap gap-2 print:gap-1">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium print:px-2 print:py-0.5">
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
  <div className="p-12 font-serif text-slate-900 print:p-8">
    <header className="text-center mb-8 border-b-2 border-black pb-6 print:mb-4 print:pb-3">
      <h1 className="text-3xl font-bold uppercase mb-2 print:mb-1">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <div className="flex flex-wrap justify-center gap-3 text-sm mb-2 print:gap-2 print:mb-1">
         {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
         {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
         {resume.personalInfo.email && <span>• {resume.personalInfo.email}</span>}
         {resume.personalInfo.website && <span>• {resume.personalInfo.website}</span>}
      </div>
    </header>

    <div className="content-flow">
      {resume.personalInfo.summary && (
        <section style={dynamicStyles.section}>
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-3 pb-1 print:mb-2">{t.labels.summary}</h2>
          <p className="text-sm text-justify leading-normal print:leading-tight">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section style={dynamicStyles.section}>
           <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1 print:mb-2">{t.headings.experience}</h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.company}, {exp.position}</span>
                  <span>{exp.startDate} – {exp.current ? t.labels.present : exp.endDate}</span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-line print:leading-tight">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- CUSTOM SECTION (CLASSIC) --- */}
      {resume.customItems && resume.customItems.length > 0 && (
        <section style={dynamicStyles.section}>
           <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1 print:mb-2">
             {resume.customSectionTitle || "Custom Section"}
           </h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.customItems.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{item.name} {item.city ? `, ${item.city}` : ''}</span>
                  <span>{item.startDate} – {item.current ? t.labels.present : item.endDate}</span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-line print:leading-tight">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section style={dynamicStyles.section}>
           <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1 print:mb-2">{t.headings.projects}</h2>
          <div className="space-y-[var(--item-spacing)]">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{proj.name}</span>
                  {proj.link && <span className="font-normal italic">{proj.link}</span>}
                </div>
                <p className="text-sm mt-1 whitespace-pre-line print:leading-tight">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section style={dynamicStyles.section}>
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1 print:mb-2">{t.headings.education}</h2>
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
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-4 pb-1 print:mb-2">{t.headings.certifications}</h2>
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
          <h2 className="text-center font-bold uppercase text-sm border-b border-black mb-3 pb-1 print:mb-2">{t.headings.skills}</h2>
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
  <div className="p-12 font-sans text-gray-800 print:p-8">
    <header className="mb-10 print:mb-4">
      <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2 print:mb-1">
        {resume.personalInfo.fullName || t.labels.fullName}
      </h1>
      <p className="text-lg text-gray-500 mb-4 print:mb-2">{resume.personalInfo.title}</p>
      <div className="text-sm text-gray-500 space-y-1 print:space-y-0.5">
        {resume.personalInfo.email && <div>{resume.personalInfo.email}</div>}
        {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
        {resume.personalInfo.website && <div>{resume.personalInfo.website}</div>}
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 print:gap-4">
      <div className="md:col-span-1 space-y-[var(--section-spacing)]">
        {resume.education.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 print:mb-2">{t.headings.education}</h3>
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
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 print:mb-2">{t.headings.certifications}</h3>
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
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 print:mb-2">{t.headings.skills}</h3>
            <div className="flex flex-col gap-2 print:gap-1">
              {resume.skills.map((skill) => (
                <span key={skill.id} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="md:col-span-3 space-y-[var(--section-spacing)]">
        {resume.personalInfo.summary && (
          <section>
             <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 print:mb-2">{t.labels.summary}</h3>
             <p className="text-sm leading-relaxed text-gray-700 print:leading-tight">{resume.personalInfo.summary}</p>
          </section>
        )}
        
        {resume.experience.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6 print:mb-3">{t.headings.experience}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l border-gray-200">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <div className="text-sm text-gray-500 mb-2 print:mb-1">{exp.company} | {exp.startDate} - {exp.current ? t.labels.present : exp.endDate}</div>
                  <p className="text-sm text-gray-700 whitespace-pre-line print:leading-tight">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- CUSTOM SECTION (MINIMAL) --- */}
        {resume.customItems && resume.customItems.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6 print:mb-3">
              {resume.customSectionTitle || "Custom Section"}
            </h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.customItems.map((item) => (
                <div key={item.id} className="relative pl-6 border-l border-gray-200">
                   <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                   <h4 className="font-bold text-gray-900">{item.name}</h4>
                   <div className="text-sm text-gray-500 mb-2 print:mb-1">
                     {item.city ? `${item.city} | ` : ''}{item.startDate} - {item.current ? t.labels.present : item.endDate}
                   </div>
                   <p className="text-sm text-gray-700 whitespace-pre-line print:leading-tight">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.projects.length > 0 && (
          <section>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6 print:mb-3">{t.headings.projects}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="relative pl-6 border-l border-gray-200">
                   <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                   <h4 className="font-bold text-gray-900">{proj.name}</h4>
                   {proj.link && <div className="text-xs text-blue-500 mb-1">{proj.link}</div>}
                   <p className="text-sm text-gray-700 print:leading-tight">{proj.description}</p>
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
    <div className="w-1/3 bg-slate-100 p-8 border-r border-slate-200 print:p-6 flex flex-col gap-[var(--section-spacing)]">
      <div className="mb-8 print:mb-4">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2 break-words print:mb-1">
          {resume.personalInfo.fullName || t.labels.fullName}
        </h1>
        <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
          {resume.personalInfo.title}
        </p>
      </div>

      <div className="space-y-[var(--section-spacing)] text-sm">
        <div>
           <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs print:mb-1">{t.headings.contact}</h3>
           <div className="space-y-2 text-slate-600 print:space-y-1">
              {resume.personalInfo.email && <div className="break-all">{resume.personalInfo.email}</div>}
              {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
              {resume.personalInfo.location && <div>{resume.personalInfo.location}</div>}
              {resume.personalInfo.website && <div className="break-all">{resume.personalInfo.website}</div>}
           </div>
        </div>

        {resume.education.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs print:mb-1">{t.headings.education}</h3>
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
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs print:mb-1">{t.headings.certifications}</h3>
            <div className="space-y-2 text-slate-700 print:space-y-1">
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
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 uppercase text-xs print:mb-1">{t.headings.skills}</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700 print:space-y-0.5">
              {resume.skills.map(skill => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

    {/* Main Content */}
    <div className="w-2/3 p-8 print:p-6 content-flow">
       {resume.personalInfo.summary && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-3 print:mb-2">{t.labels.summary}</h3>
            <p className="text-sm text-slate-700 leading-relaxed print:leading-tight">{resume.personalInfo.summary}</p>
         </div>
       )}

       {resume.experience.length > 0 && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4 print:mb-2">{t.headings.experience}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.experience.map(exp => (
                <div key={exp.id}>
                   <div className="flex justify-between items-baseline mb-1 print:mb-0.5">
                      <h4 className="font-bold text-slate-900 text-md">{exp.position}</h4>
                      <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {exp.startDate} - {exp.current ? t.labels.present : exp.endDate}
                      </span>
                   </div>
                   <div className="text-sm font-medium text-slate-600 mb-2 print:mb-1">{exp.company}</div>
                   <p className="text-sm text-slate-700 whitespace-pre-line print:leading-tight">{exp.description}</p>
                </div>
              ))}
            </div>
         </div>
       )}

       {/* --- CUSTOM SECTION (PROFESSIONAL) --- */}
       {resume.customItems && resume.customItems.length > 0 && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4 print:mb-2">
              {resume.customSectionTitle || "Custom Section"}
            </h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.customItems.map(item => (
                <div key={item.id}>
                   <div className="flex justify-between items-baseline mb-1 print:mb-0.5">
                      <h4 className="font-bold text-slate-900 text-md">{item.name}</h4>
                      <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {item.startDate} - {item.current ? t.labels.present : item.endDate}
                      </span>
                   </div>
                   {item.city && <div className="text-sm font-medium text-slate-600 mb-2 print:mb-1">{item.city}</div>}
                   <p className="text-sm text-slate-700 whitespace-pre-line print:leading-tight">{item.description}</p>
                </div>
              ))}
            </div>
         </div>
       )}

       {resume.projects.length > 0 && (
         <div style={dynamicStyles.section}>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4 print:mb-2">{t.headings.projects}</h3>
            <div className="space-y-[var(--item-spacing)]">
              {resume.projects.map(proj => (
                <div key={proj.id}>
                   <h4 className="font-bold text-slate-900 text-md">{proj.name}</h4>
                   {proj.link && <a href={proj.link} className="text-xs text-blue-600 block mb-1">{proj.link}</a>}
                   <p className="text-sm text-slate-700 print:leading-tight">{proj.description}</p>
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
     <header className="bg-slate-900 text-white p-10 print:p-6">
        <h1 className="text-5xl font-bold mb-2 print:text-3xl print:mb-1">{resume.personalInfo.fullName || t.labels.fullName}</h1>
        <p className="text-xl text-blue-300 font-medium tracking-wide mb-6 print:text-base print:mb-3">{resume.personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-6 text-sm text-slate-300 print:gap-3">
          {resume.personalInfo.email && <div className="flex items-center gap-2"><Mail size={16}/> {resume.personalInfo.email}</div>}
          {resume.personalInfo.phone && <div className="flex items-center gap-2"><Phone size={16}/> {resume.personalInfo.phone}</div>}
          {resume.personalInfo.website && <div className="flex items-center gap-2"><Globe size={16}/> {resume.personalInfo.website}</div>}
        </div>
     </header>

     <div className="p-10 grid grid-cols-1 gap-[var(--section-spacing)] print:p-6">
        {resume.personalInfo.summary && (
          <section className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500 print:p-4">
             <p className="text-slate-700 text-lg leading-relaxed italic print:text-sm print:leading-tight">"{resume.personalInfo.summary}"</p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-10 print:gap-4">
           <div className="col-span-2 space-y-[var(--section-spacing)]">
              {resume.experience.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6 print:text-lg print:mb-3">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center print:w-6 print:h-6"><Briefcase size={18} className="print:w-4 print:h-4" /></span>
                    {t.headings.experience}
                  </h2>
                  <div className="space-y-[var(--item-spacing)] border-l-2 border-slate-100 pl-8 ml-4 print:pl-4 print:ml-2">
                     {resume.experience.map(exp => (
                       <div key={exp.id} className="relative">
                          <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm print:-left-[21px] print:w-3 print:h-3"></div>
                          <h3 className="font-bold text-lg print:text-base">{exp.position}</h3>
                          <div className="text-blue-600 font-medium mb-1">{exp.company}</div>
                          <div className="text-xs text-slate-400 uppercase tracking-widest mb-3 print:mb-1">{exp.startDate} — {exp.current ? t.labels.present : exp.endDate}</div>
                          <p className="text-slate-600 whitespace-pre-line print:leading-tight">{exp.description}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {/* --- CUSTOM SECTION (CREATIVE) --- */}
              {resume.customItems && resume.customItems.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6 print:text-lg print:mb-3">
                    <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded flex items-center justify-center print:w-6 print:h-6">
                       <Star size={18} className="print:w-4 print:h-4" />
                    </span>
                    {resume.customSectionTitle || "Custom Section"}
                  </h2>
                  <div className="space-y-[var(--item-spacing)] border-l-2 border-slate-100 pl-8 ml-4 print:pl-4 print:ml-2">
                     {resume.customItems.map(item => (
                       <div key={item.id} className="relative">
                          <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white bg-pink-500 shadow-sm print:-left-[21px] print:w-3 print:h-3"></div>
                          <h3 className="font-bold text-lg print:text-base">{item.name}</h3>
                          {item.city && <div className="text-pink-600 font-medium mb-1">{item.city}</div>}
                          <div className="text-xs text-slate-400 uppercase tracking-widest mb-3 print:mb-1">{item.startDate} — {item.current ? t.labels.present : item.endDate}</div>
                          <p className="text-slate-600 whitespace-pre-line print:leading-tight">{item.description}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {resume.projects.length > 0 && (
                 <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6 print:text-lg print:mb-3">
                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center print:w-6 print:h-6"><FolderGit2 size={18} className="print:w-4 print:h-4" /></span>
                    {t.headings.projects}
                  </h2>
                  <div className="space-y-[var(--item-spacing)] pl-2">
                     {resume.projects.map(proj => (
                       <div key={proj.id} className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm print:p-2">
                          <div className="flex justify-between items-start">
                             <h3 className="font-bold text-lg print:text-base">{proj.name}</h3>
                             {proj.link && <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Link</span>}
                          </div>
                          <p className="text-slate-600 mt-2 print:mt-1 print:leading-tight">{proj.description}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}
           </div>

           <div className="col-span-1 space-y-[var(--section-spacing)]">
              {resume.skills.length > 0 && (
                <div>
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 print:text-base print:mb-2">
                     <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded flex items-center justify-center print:w-6 print:h-6"><Award size={18} className="print:w-4 print:h-4" /></span>
                     {t.headings.skills}
                   </h2>
                   <div className="flex flex-wrap gap-2 print:gap-1">
                      {resume.skills.map(skill => (
                        <span key={skill.id} className="px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-md text-sm font-medium text-slate-700 print:px-2 print:py-0.5 print:text-xs">
                           {skill.name}
                        </span>
                      ))}
                   </div>
                </div>
              )}
              
              {resume.education.length > 0 && (
                <div>
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 print:text-base print:mb-2">
                     <span className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center print:w-6 print:h-6"><GraduationCap size={18} className="print:w-4 print:h-4" /></span>
                     {t.headings.education}
                   </h2>
                   <div className="space-y-[var(--item-spacing)]">
                     {resume.education.map(edu => (
                       <div key={edu.id} className="bg-slate-50 p-4 rounded-lg print:p-2">
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
                   <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 print:text-base print:mb-2">
                     <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded flex items-center justify-center print:w-6 print:h-6"><Award size={18} className="print:w-4 print:h-4" /></span>
                     {t.headings.certifications}
                   </h2>
                   <div className="space-y-3 print:space-y-1">
                     {resume.certifications.map(cert => (
                       <div key={cert.id} className="border-l-2 border-yellow-400 pl-3 print:pl-2">
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
  <div className="p-12 font-serif text-slate-800 border-t-8 border-slate-800 print:p-8 h-full">
     <div className="flex justify-between items-start mb-12 print:mb-6">
        <div>
           <h1 className="text-4xl font-bold text-slate-900 mb-2 uppercase tracking-widest print:text-3xl print:mb-1">{resume.personalInfo.fullName || t.labels.fullName}</h1>
           <p className="text-lg italic text-slate-600 print:text-base">{resume.personalInfo.title}</p>
        </div>
        <div className="text-right text-sm space-y-1 text-slate-500 font-sans print:space-y-0.5">
           <div className="font-medium text-slate-900">{resume.personalInfo.email}</div>
           <div>{resume.personalInfo.phone}</div>
           <div>{resume.personalInfo.location}</div>
        </div>
     </div>

     <div className="content-flow">
       {resume.personalInfo.summary && (
          <div style={dynamicStyles.section} className="border-b border-slate-200 pb-6 print:pb-3">
             <p className="text-lg leading-relaxed text-slate-700 print:text-base print:leading-tight">{resume.personalInfo.summary}</p>
          </div>
       )}

       {resume.experience.length > 0 && (
         <div style={dynamicStyles.section}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 print:mb-3">{t.headings.experience}</h2>
            <div className="space-y-[var(--item-spacing)]">
               {resume.experience.map(exp => (
                 <div key={exp.id} className="grid grid-cols-4 gap-6 print:gap-3">
                    <div className="col-span-1 text-right">
                       <div className="font-bold text-slate-900">{exp.startDate}</div>
                       <div className="text-sm text-slate-500">{exp.endDate}</div>
                    </div>
                    <div className="col-span-3">
                       <h3 className="text-xl font-bold text-slate-900 mb-1 print:text-base print:mb-0.5">{exp.position}</h3>
                       <div className="text-slate-600 font-medium italic mb-3 print:mb-1">{exp.company}</div>
                       <p className="text-slate-700 leading-relaxed font-sans text-sm print:leading-tight">{exp.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       )}

       {/* --- CUSTOM SECTION (EXECUTIVE) --- */}
       {resume.customItems && resume.customItems.length > 0 && (
         <div style={dynamicStyles.section}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 print:mb-3">
              {resume.customSectionTitle || "Custom Section"}
            </h2>
            <div className="space-y-[var(--item-spacing)]">
               {resume.customItems.map(item => (
                 <div key={item.id} className="grid grid-cols-4 gap-6 print:gap-3">
                    <div className="col-span-1 text-right">
                       <div className="font-bold text-slate-900">{item.startDate}</div>
                       <div className="text-sm text-slate-500">{item.endDate}</div>
                    </div>
                    <div className="col-span-3">
                       <h3 className="text-xl font-bold text-slate-900 mb-1 print:text-base print:mb-0.5">{item.name}</h3>
                       {item.city && <div className="text-slate-600 font-medium italic mb-3 print:mb-1">{item.city}</div>}
                       <p className="text-slate-700 leading-relaxed font-sans text-sm print:leading-tight">{item.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       )}

       {resume.projects.length > 0 && (
         <div style={dynamicStyles.section}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 print:mb-3">{t.headings.projects}</h2>
            <div className="space-y-[var(--item-spacing)]">
               {resume.projects.map(proj => (
                 <div key={proj.id} className="grid grid-cols-4 gap-6 print:gap-3">
                    <div className="col-span-1 text-right">
                       <div className="text-sm text-slate-500 italic">Project</div>
                    </div>
                    <div className="col-span-3">
                       <h3 className="text-lg font-bold text-slate-900 print:text-base">{proj.name}</h3>
                       {proj.link && <div className="text-xs text-blue-800 mb-1">{proj.link}</div>}
                       <p className="text-slate-700 leading-relaxed font-sans text-sm print:leading-tight">{proj.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       )}

       <div className="grid grid-cols-2 gap-12 print:gap-6">
          <div className="space-y-[var(--section-spacing)]">
            {resume.education.length > 0 && (
               <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 print:mb-2">{t.headings.education}</h2>
                  <div className="space-y-[var(--item-spacing)]">
                     {resume.education.map(edu => (
                       <div key={edu.id}>
                          <div className="font-bold text-slate-900 text-lg print:text-base">{edu.school}</div>
                          <div className="text-slate-600 italic">{edu.degree}</div>
                       </div>
                     ))}
                  </div>
               </div>
            )}
            
            {resume.certifications.length > 0 && (
               <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 print:mb-2">{t.headings.certifications}</h2>
                  <div className="space-y-3 print:space-y-1">
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
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 print:mb-2">{t.headings.skills}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-slate-700 font-medium print:gap-x-3 print:gap-y-1">
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
  
  // State for layout adjustments
  const [zoomScale, setZoomScale] = useState(1);
  const [spacingScale, setSpacingScale] = useState(1);

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
    // Helper function to sort general items (Experience, Education, Custom)
    const sortGeneral = (items: any[]) => {
      if (!items) return [];
      return [...items].sort((a, b) => {
        // 1. Current Always First
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;

        // 2. Sort by End Date (Descending)
        const dateA = new Date(a.endDate || 0).getTime();
        const dateB = new Date(b.endDate || 0).getTime();
        
        if (dateB !== dateA) return dateB - dateA;

        // 3. Tie-breaker: Start Date (Descending)
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

    // Cast resume as any to allow accessing customItems if they are not yet in the generic Type definition
    const safeResume = resume as any;

    return {
      ...resume,
      experience: sortGeneral(resume.experience),
      education: sortGeneral(resume.education),
      // Sort customItems if they exist, otherwise return empty array
      customItems: sortGeneral(safeResume.customItems || []),
      certifications: sortCertifications(resume.certifications)
    };
  }, [resume]);


  // --- AUTO-SIZING LOGIC ---
  useEffect(() => {
    if (!containerRef.current) return;

    // Use a safe A4 Height
    const TARGET_HEIGHT = 1123; 
    const isMobile = window.innerWidth < 800; 

    setZoomScale(1);
    setSpacingScale(1);

    setTimeout(() => {
      if (!containerRef.current) return;
      const contentHeight = containerRef.current.scrollHeight;

      // Mobile print prediction: 
      const perceivedPrintHeight = isMobile ? contentHeight * 0.85 : contentHeight;

      if (perceivedPrintHeight > TARGET_HEIGHT) {
        // Content too big: Shrink
        const newScale = TARGET_HEIGHT / perceivedPrintHeight;
        setZoomScale(Math.max(0.65, newScale));
        setSpacingScale(1); 
      } else {
        // Content too small: Expand Spacing
        const emptySpace = TARGET_HEIGHT - perceivedPrintHeight;
        const expansionFactor = 1 + (emptySpace / 600); 
        setSpacingScale(Math.min(2.4, expansionFactor));
        setZoomScale(1); 
      }
    }, 100);
  }, [sortedResume, t]); 

  const layoutStyles = {
    '--section-spacing': `${2 * spacingScale}rem`,
    '--item-spacing': `${0.75 * spacingScale}rem`,
    zoom: zoomScale,
  } as React.CSSProperties;

  return (
    <div 
      id="resume-preview" 
      ref={containerRef}
      style={layoutStyles}
      className={clsx("a4-page bg-white shadow-lg mx-auto overflow-hidden origin-top", className)}
    >
      <TemplateComponent resume={sortedResume} t={t} />
    </div>
  );
};
