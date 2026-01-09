import React from 'react';
import { useResumeStore } from '../store';
import { Translation } from '../types';
import { Input, TextArea } from './ui/Input';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface EditorProps {
  t: Translation;
}

// Helper components moved outside to ensure they are treated as valid React components with key props support

const SectionTitle: React.FC<{ title: string; subTitle?: string }> = ({ title, subTitle }) => (
  <div className="mb-6 px-1">
    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
    {subTitle && <p className="text-slate-500 text-sm mt-1">{subTitle}</p>}
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
    <p className="text-slate-500 font-medium">{message}</p>
  </div>
);

const AddButton: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="w-full py-4 mt-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
  >
    <div className="bg-blue-100 p-1 rounded-full"><Plus size={18} strokeWidth={3} /></div>
    {label}
  </button>
);

const CardItem: React.FC<{ children: React.ReactNode; onRemove: () => void }> = ({ children, onRemove }) => (
  <div className="p-5 bg-white rounded-2xl shadow-[0_2px_12px_-3px_rgba(0,0,0,0.08)] border border-slate-100 relative group animate-in slide-in-from-bottom-2 duration-300">
    <button
      onClick={onRemove}
      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      aria-label="Remove item"
    >
      <Trash2 size={18} />
    </button>
    {children}
  </div>
);

export const Editor: React.FC<EditorProps> = ({ t }) => {
  const {
    resume,
    currentStep,
    setPersonal,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    addEducation,
    updateEducation,
    removeEducation,
    addCertification,
    updateCertification,
    removeCertification,
    addSkill,
    updateSkill,
    removeSkill,
  } = useResumeStore();

  // Step 0: Personal Info
  if (currentStep === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <SectionTitle title={t.steps.personal} subTitle="Start with your contact details and a brief summary." />
        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_-3px_rgba(0,0,0,0.08)] border border-slate-100 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label={t.labels.fullName}
              value={resume.personalInfo.fullName}
              onChange={(e) => setPersonal({ fullName: e.target.value })}
              placeholder="e.g. John Doe"
            />
            <Input
              label={t.labels.jobTitle}
              value={resume.personalInfo.title}
              onChange={(e) => setPersonal({ title: e.target.value })}
              placeholder="e.g. Senior Product Designer"
            />
            <Input
              label={t.labels.email}
              type="email"
              value={resume.personalInfo.email}
              onChange={(e) => setPersonal({ email: e.target.value })}
              placeholder="e.g. john@example.com"
            />
            <Input
              label={t.labels.phone}
              type="tel"
              value={resume.personalInfo.phone}
              onChange={(e) => setPersonal({ phone: e.target.value })}
              placeholder="e.g. +1 234 567 890"
            />
            <Input
              label={t.labels.location}
              value={resume.personalInfo.location}
              onChange={(e) => setPersonal({ location: e.target.value })}
              placeholder="e.g. New York, NY"
            />
            <Input
              label={t.labels.website}
              value={resume.personalInfo.website}
              onChange={(e) => setPersonal({ website: e.target.value })}
              placeholder="e.g. linkedin.com/in/johndoe"
            />
          </div>
          <div className="pt-2">
            <TextArea
              label={t.labels.summary}
              value={resume.personalInfo.summary}
              onChange={(e) => setPersonal({ summary: e.target.value })}
              placeholder={t.placeholders.summary}
            />
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Experience
  if (currentStep === 1) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <SectionTitle title={t.steps.experience} subTitle="List your work history, starting with the most recent." />
        
        <div className="space-y-4">
          {resume.experience.map((exp) => (
            <CardItem key={exp.id} onRemove={() => removeExperience(exp.id)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <Input
                  label={t.labels.position}
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  placeholder="e.g. Software Engineer"
                />
                <Input
                  label={t.labels.company}
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="e.g. Tech Corp"
                />
                <Input
                  label={t.labels.startDate}
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                />
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      label={t.labels.endDate}
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      disabled={exp.current}
                      className={exp.current ? 'opacity-50' : ''}
                    />
                  </div>
                  <div className="mb-3 h-[46px] flex items-center bg-slate-50 px-3 rounded-xl ring-1 ring-slate-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      {t.labels.present}
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label={t.labels.description}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    placeholder={t.placeholders.description}
                  />
                </div>
              </div>
            </CardItem>
          ))}
        </div>

        {resume.experience.length === 0 && <EmptyState message="No experience added yet." />}
        <AddButton onClick={addExperience} label={t.actions.add} />
      </div>
    );
  }

  // Step 2: Projects
  if (currentStep === 2) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <SectionTitle title={t.steps.projects} subTitle="Highlight key projects to demonstrate your skills." />
        
        <div className="space-y-4">
          {resume.projects.map((proj) => (
            <CardItem key={proj.id} onRemove={() => removeProject(proj.id)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <Input
                  label={t.labels.projectName}
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                  placeholder="e.g. E-commerce Platform"
                />
                <Input
                  label={t.labels.projectLink}
                  value={proj.link}
                  onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                  placeholder="e.g. github.com/project"
                />
                <div className="md:col-span-2">
                  <TextArea
                    label={t.labels.description}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    placeholder="Describe what you built and the technologies used..."
                  />
                </div>
              </div>
            </CardItem>
          ))}
        </div>

        {resume.projects.length === 0 && <EmptyState message="No projects added yet." />}
        <AddButton onClick={addProject} label={t.actions.add} />
      </div>
    );
  }

  // Step 3: Education
  if (currentStep === 3) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <SectionTitle title={t.steps.education} subTitle="Add your academic background." />
        
        <div className="space-y-4">
          {resume.education.map((edu) => (
            <CardItem key={edu.id} onRemove={() => removeEducation(edu.id)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <Input
                  label={t.labels.school}
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                  placeholder="e.g. University of Technology"
                />
                <Input
                  label={t.labels.degree}
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder="e.g. BSc Computer Science"
                />
                <Input
                  label={t.labels.startDate}
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                />
                <Input
                  label={t.labels.endDate}
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                />
              </div>
            </CardItem>
          ))}
        </div>

        {resume.education.length === 0 && <EmptyState message="No education added yet." />}
        <AddButton onClick={addEducation} label={t.actions.add} />
      </div>
    );
  }

  // Step 4: Certifications
  if (currentStep === 4) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <SectionTitle title={t.steps.certifications} subTitle="Certificates, awards, or other achievements." />
        
        <div className="space-y-4">
          {resume.certifications.map((cert) => (
            <CardItem key={cert.id} onRemove={() => removeCertification(cert.id)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <Input
                  label={t.labels.certificationName}
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
                <Input
                  label={t.labels.certificationIssuer}
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                />
                <Input
                  label={t.labels.startDate}
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                />
              </div>
            </CardItem>
          ))}
        </div>

        {resume.certifications.length === 0 && <EmptyState message="No certifications added yet." />}
        <AddButton onClick={addCertification} label={t.actions.add} />
      </div>
    );
  }

  // Step 5: Skills
  if (currentStep === 5) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <SectionTitle title={t.steps.skills} subTitle="List your technical and soft skills." />
        
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.08)] border border-slate-100">
          <div className="space-y-3">
            {resume.skills.map((skill) => (
              <div key={skill.id} className="flex gap-3 items-center group">
                <div className="flex items-center text-slate-400 cursor-grab active:cursor-grabbing">
                  <GripVertical size={16} />
                </div>
                <div className="flex-1">
                  <Input
                    label=""
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="e.g. Python, Leadership, etc."
                    className="mb-0"
                    autoFocus={!skill.name}
                  />
                </div>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <AddButton onClick={addSkill} label={t.actions.add} />
        </div>
      </div>
    );
  }

  return null;
};
