export type Language = 'en' | 'fr' | 'es';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  title: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'professional' | 'creative' | 'executive';

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  templateId: TemplateId;
}

export interface AtsResult {
  score: number;
  breakdown: {
    sections: number; // /20
    keywords: number; // /30
    formatting: number; // /15
    skills: number; // /15
    clarity: number; // /20
  };
  strengths: string[];
  improvements: string[];
  details: {
    wordCount: number;
    foundSections: string[];
    missingSections: string[];
    contactInfoFound: boolean;
    fileType: string;
  };
}

export interface Translation {
  metaTitle: string;
  metaDesc: string;
  metaKeywords: string;
  nav: {
    brand: string;
    create: string;
    preview: string;
    features: string;
    builder: string;
    ats: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    cta: string;
    ctaSecondary: string;
    trustedBy: string;
    stats: { users: string; downloads: string; cost: string };
    howItWorksTitle: string;
    howItWorksSteps: { title: string; desc: string }[];
    templatesTitle: string;
    templatesDesc: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    seoTitle: string;
    seoContent: string;
    faqTitle: string;
    faqItems: { q: string; a: string }[];
  };
  ats: {
    heroTitle: string;
    heroSubtitle: string;
    uploadTitle: string;
    uploadDesc: string;
    analyzing: string;
    scoreTitle: string;
    scoreSubtitle: string;
    strengths: string;
    improvements: string;
    breakdown: string;
    privacy: string;
    reupload: string;
    categories: {
      sections: string;
      keywords: string;
      formatting: string;
      skills: string;
      clarity: string;
    };
    landing: {
      whyMatters: string;
      whyMattersDesc: string;
      howWorks: string;
      howWorksDesc: string;
      privacyTitle: string;
      privacyDesc: string;
      faq: { q: string; a: string }[];
    }
  };
  footer: {
    copyright: string;
    privacy: string;
    terms: string;
    contact: string;
    faq: string;
    disclaimer: string;
  };
  legal: {
    privacyTitle: string;
    privacyContent: string[];
    termsTitle: string;
    termsContent: string[];
    faqTitle: string;
    faqContent: {q: string, a: string}[];
    contactTitle: string;
    contactDesc: string;
  };
  steps: {
    personal: string;
    experience: string;
    projects: string;
    education: string;
    certifications: string;
    skills: string;
    preview: string;
  };
  actions: {
    next: string;
    back: string;
    add: string;
    remove: string;
    downloadPdf: string;
    downloadLatex: string;
    downloadJson: string;
    reset: string;
    changeTemplate: string;
  };
  labels: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    jobTitle: string;
    summary: string;
    company: string;
    position: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    present: string;
    description: string;
    skillName: string;
    projectName: string;
    projectLink: string;
    certificationName: string;
    certificationIssuer: string;
  };
  placeholders: {
    summary: string;
    description: string;
  };
  headings: {
    experience: string;
    projects: string;
    education: string;
    certifications: string;
    skills: string;
    contact: string;
  };
}