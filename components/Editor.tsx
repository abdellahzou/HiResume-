import React from 'react';
import { useResumeStore } from '../store';
import { Translation } from '../types';
import { Input, TextArea } from './ui/Input';
import { Plus, Trash2 } from 'lucide-react';

interface EditorProps {
  t: Translation;
}

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
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-bold text-gray-800">{t.steps.personal}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t.labels.fullName}
            value={resume.personalInfo.fullName}
            onChange={(e) => setPersonal({ fullName: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label={t.labels.jobTitle}
            value={resume.personalInfo.title}
            onChange={(e) => setPersonal({ title: e.target.value })}
            placeholder="Senior Developer"
          />
          <Input
            label={t.labels.email}
            type="email"
            value={resume.personalInfo.email}
            onChange={(e) => setPersonal({ email: e.target.value })}
            placeholder="john@example.com"
          />
          <Input
            label={t.labels.phone}
            type="tel"
            value={resume.personalInfo.phone}
            onChange={(e) => setPersonal({ phone: e.target.value })}
            placeholder="+1 234 567 890"
          />
          <Input
            label={t.labels.location}
            value={resume.personalInfo.location}
            onChange={(e) => setPersonal({ location: e.target.value })}
            placeholder="New York, NY"
          />
          <Input
            label={t.labels.website}
            value={resume.personalInfo.website}
            onChange={(e) => setPersonal({ website: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
          />
          <div className="md:col-span-2">
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{t.steps.experience}</h2>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} /> {t.actions.add}
          </button>
        </div>
        {resume.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-3 relative">
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              aria-label={t.actions.remove}
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
              <Input
                label={t.labels.position}
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
              />
              <Input
                label={t.labels.company}
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
              />
              <Input
                label={t.labels.startDate}
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label={t.labels.endDate}
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    disabled={exp.current}
                  />
                </div>
                <div className="mb-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
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
          </div>
        ))}
        {resume.experience.length === 0 && (
          <p className="text-center text-gray-500 py-8 italic">Add your work experience to get started.</p>
        )}
      </div>
    );
  }

  // Step 2: Projects
  if (currentStep === 2) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{t.steps.projects}</h2>
          <button
            onClick={addProject}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} /> {t.actions.add}
          </button>
        </div>
        {resume.projects.map((proj) => (
          <div key={proj.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-3 relative">
            <button
              onClick={() => removeProject(proj.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
              <Input
                label={t.labels.projectName}
                value={proj.name}
                onChange={(e) => updateProject(proj.id, { name: e.target.value })}
              />
              <Input
                label={t.labels.projectLink}
                value={proj.link}
                onChange={(e) => updateProject(proj.id, { link: e.target.value })}
              />
              <div className="md:col-span-2">
                <TextArea
                  label={t.labels.description}
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Step 3: Education
  if (currentStep === 3) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{t.steps.education}</h2>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} /> {t.actions.add}
          </button>
        </div>
        {resume.education.map((edu) => (
          <div key={edu.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-3 relative">
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
              <Input
                label={t.labels.school}
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
              />
              <Input
                label={t.labels.degree}
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
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
          </div>
        ))}
      </div>
    );
  }

  // Step 4: Certifications
  if (currentStep === 4) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{t.steps.certifications}</h2>
          <button
            onClick={addCertification}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} /> {t.actions.add}
          </button>
        </div>
        {resume.certifications.map((cert) => (
          <div key={cert.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-3 relative">
            <button
              onClick={() => removeCertification(cert.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
              <Input
                label={t.labels.certificationName}
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
              />
              <Input
                label={t.labels.certificationIssuer}
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
              />
              <Input
                label={t.labels.startDate} // Reusing label for general date
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Step 5: Skills
  if (currentStep === 5) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{t.steps.skills}</h2>
          <button
            onClick={addSkill}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} /> {t.actions.add}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {resume.skills.map((skill) => (
            <div key={skill.id} className="flex gap-2 items-center">
              <Input
                label=""
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                placeholder="Python, Project Management, etc."
                className="mb-0"
              />
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-gray-400 hover:text-red-500 mt-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};