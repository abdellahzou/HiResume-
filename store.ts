import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, Experience, Education, Skill, Project, Certification, TemplateId } from './types';
import { INITIAL_RESUME_STATE } from './constants';
import { v4 as uuidv4 } from 'uuid';

interface ResumeStore {
  resume: ResumeData;
  currentStep: number;
  setTemplateId: (id: TemplateId) => void;
  setPersonal: (data: Partial<ResumeData['personalInfo']>) => void;
  
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  setStep: (step: number) => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: INITIAL_RESUME_STATE,
      currentStep: 0,
      setTemplateId: (id) =>
        set((state) => ({ resume: { ...state.resume, templateId: id } })),
      setPersonal: (data) =>
        set((state) => ({
          resume: { ...state.resume, personalInfo: { ...state.resume.personalInfo, ...data } },
        })),
      addExperience: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [
              ...state.resume.experience,
              {
                id: uuidv4(),
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
              },
            ],
          },
        })),
      updateExperience: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp
            ),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((exp) => exp.id !== id),
          },
        })),
      
      // Projects
      addProject: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [
              ...state.resume.projects,
              {
                id: uuidv4(),
                name: '',
                link: '',
                description: '',
              },
            ],
          },
        })),
      updateProject: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((proj) =>
              proj.id === id ? { ...proj, ...data } : proj
            ),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((proj) => proj.id !== id),
          },
        })),

      addEducation: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [
              ...state.resume.education,
              {
                id: uuidv4(),
                school: '',
                degree: '',
                startDate: '',
                endDate: '',
                current: false,
              },
            ],
          },
        })),
      updateEducation: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu
            ),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((edu) => edu.id !== id),
          },
        })),

      // Certifications
      addCertification: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: [
              ...state.resume.certifications,
              {
                id: uuidv4(),
                name: '',
                issuer: '',
                date: '',
              },
            ],
          },
        })),
      updateCertification: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.map((cert) =>
              cert.id === id ? { ...cert, ...data } : cert
            ),
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.filter((cert) => cert.id !== id),
          },
        })),

      addSkill: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...state.resume.skills, { id: uuidv4(), name: '', level: 3 }],
          },
        })),
      updateSkill: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.map((skill) =>
              skill.id === id ? { ...skill, ...data } : skill
            ),
          },
        })),
      removeSkill: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((skill) => skill.id !== id),
          },
        })),
      setStep: (step) => set({ currentStep: step }),
      resetResume: () => set({ resume: INITIAL_RESUME_STATE, currentStep: 0 }),
    }),
    {
      name: 'resume-storage',
    }
  )
);