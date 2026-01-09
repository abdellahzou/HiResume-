import { ResumeData, Translation, AtsResult } from './types';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

// --- EXISTING EXPORTS (generateLatex, generateDocx, downloadFile) ---

export const generateLatex = (data: ResumeData, t: Translation): string => {
  const sanitize = (str: string) => str.replace(/([&%$#_{}])/g, '\\$1');

  // Helper for conditional sections
  const renderSection = (title: string, content: string) => 
    content.trim() ? `\\section{${title}}\n${content}` : '';

  const projectsContent = data.projects.length > 0 ? `
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.projects
  .map(
    (proj) => `
    \\item
    \\textbf{${sanitize(proj.name)}} ${proj.link ? ` | \\href{${proj.link}}{Link}` : ''} \\\\
    ${sanitize(proj.description)}
`
  )
  .join('')}
\\end{itemize}
` : '';

  const certificationsContent = data.certifications.length > 0 ? `
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.certifications
  .map(
    (cert) => `
    \\item
    \\textbf{${sanitize(cert.name)}} | ${sanitize(cert.issuer)} \\hfill ${sanitize(cert.date)}
`
  )
  .join('')}
\\end{itemize}
` : '';

  return `
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{${sanitize(data.personalInfo.fullName)}}} \\\\
    ${sanitize(data.personalInfo.location)} | ${sanitize(data.personalInfo.phone)} | ${sanitize(data.personalInfo.email)} \\\\
    ${sanitize(data.personalInfo.website)}
\\end{center}

${renderSection(t.headings.contact, sanitize(data.personalInfo.summary))}

${renderSection(t.headings.experience, `
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.experience
  .map(
    (exp) => `
    \\item
    \\textbf{${sanitize(exp.position)}} | ${sanitize(exp.company)} \\hfill ${sanitize(exp.startDate)} -- ${exp.current ? t.labels.present : sanitize(exp.endDate)}
    \\begin{itemize}
        \\item ${sanitize(exp.description).replace(/\n/g, '\n        \\item ')}
    \\end{itemize}
`
  )
  .join('')}
\\end{itemize}
`)}

${renderSection(t.headings.projects, projectsContent)}

${renderSection(t.headings.education, `
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.education
  .map(
    (edu) => `
    \\item
    \\textbf{${sanitize(edu.school)}} \\hfill ${sanitize(edu.startDate)} -- ${edu.current ? t.labels.present : sanitize(edu.endDate)} \\\\
    ${sanitize(edu.degree)}
`
  )
  .join('')}
\\end{itemize}
`)}

${renderSection(t.headings.certifications, certificationsContent)}

${data.skills.length > 0 ? `\\section{${t.headings.skills}}
${data.skills.map((skill) => sanitize(skill.name)).join(', ')}` : ''}

\\end{document}
  `;
};

export const generateDocx = async (data: ResumeData, t: Translation): Promise<Blob> => {
  const children: any[] = [
    // Header
    new Paragraph({
      text: data.personalInfo.fullName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${data.personalInfo.location} | ` }),
        new TextRun({ text: `${data.personalInfo.phone} | ` }),
        new TextRun({ text: data.personalInfo.email }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: data.personalInfo.website,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: "" }), // Spacer
  ];

  // Summary
  if (data.personalInfo.summary) {
    children.push(
      new Paragraph({
        text: t.labels.summary.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
      }),
      new Paragraph({ text: data.personalInfo.summary }),
      new Paragraph({ text: "" })
    );
  }

  // Experience
  if (data.experience.length > 0) {
    children.push(
      new Paragraph({
        text: t.headings.experience.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
      }),
      ...data.experience.flatMap((exp) => [
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 24 }),
            new TextRun({ text: ` | ${exp.company}`, size: 24 }),
            new TextRun({
              text: `   ${exp.startDate} - ${exp.current ? t.labels.present : exp.endDate}`,
              italics: true,
            }),
          ],
        }),
        new Paragraph({ text: exp.description }),
        new Paragraph({ text: "" }),
      ])
    );
  }

  // Projects
  if (data.projects.length > 0) {
    children.push(
      new Paragraph({
        text: t.headings.projects.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
      }),
      ...data.projects.flatMap((proj) => [
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: 24 }),
            ...(proj.link ? [new TextRun({ text: ` (${proj.link})`, italics: true })] : []),
          ],
        }),
        new Paragraph({ text: proj.description }),
        new Paragraph({ text: "" }),
      ])
    );
  }

  // Education
  if (data.education.length > 0) {
    children.push(
      new Paragraph({
        text: t.headings.education.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
      }),
      ...data.education.flatMap((edu) => [
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: true }),
            new TextRun({
              text: `   ${edu.startDate} - ${edu.current ? t.labels.present : edu.endDate}`,
              italics: true,
            }),
          ],
        }),
        new Paragraph({ text: edu.degree }),
        new Paragraph({ text: "" }),
      ])
    );
  }

  // Certifications
  if (data.certifications.length > 0) {
    children.push(
      new Paragraph({
        text: t.headings.certifications.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
      }),
      ...data.certifications.flatMap((cert) => [
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            new TextRun({ text: ` | ${cert.issuer}` }),
            new TextRun({ text: `   ${cert.date}`, italics: true }),
          ],
        }),
      ])
    );
    children.push(new Paragraph({ text: "" }));
  }

  // Skills
  if (data.skills.length > 0) {
    children.push(
      new Paragraph({
        text: t.headings.skills.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
      }),
      new Paragraph({
        text: data.skills.map((s) => s.name).join(", "),
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export const downloadFile = (content: string | Blob, filename: string, type: string) => {
  const url = content instanceof Blob ? URL.createObjectURL(content) : URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// --- NEW ATS RESUME CHECKER LOGIC ---

// Globals for PDF.js and Mammoth (loaded via CDN)
declare global {
  interface Window {
    pdfjsLib: any;
    mammoth: any;
  }
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + ' ';
  }
  
  return fullText;
};

export const extractTextFromDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const analyzeResume = (text: string, fileName: string): AtsResult => {
  const lowerText = text.toLowerCase();
  
  // 1. Check for standard sections
  const sections = {
    experience: /experience|employment|history|work/i.test(lowerText),
    education: /education|university|college|degree/i.test(lowerText),
    skills: /skills|competencies|technologies|proficiencies/i.test(lowerText),
    projects: /projects|portfolio/i.test(lowerText),
    summary: /summary|objective|about/i.test(lowerText)
  };

  const foundSections = Object.entries(sections).filter(([, found]) => found).map(([key]) => key);
  const missingSections = Object.entries(sections).filter(([, found]) => !found).map(([key]) => key);

  // 2. Check for contact info
  const hasEmail = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(text);
  const hasPhone = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(text) || /\d{10}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text);

  // 3. Keywords / Action Verbs (Simple list)
  const actionVerbs = [
    'led', 'managed', 'developed', 'created', 'implemented', 'designed', 'improved', 
    'increased', 'reduced', 'saved', 'achieved', 'launched', 'mentored', 'analyzed'
  ];
  const foundKeywords = actionVerbs.filter(verb => lowerText.includes(verb));
  const keywordDensity = foundKeywords.length;

  // 4. Scoring Logic (Deterministic)
  let score = 0;
  const breakdown = {
    sections: 0, // max 20
    keywords: 0, // max 30
    formatting: 0, // max 15
    skills: 0, // max 15
    clarity: 0   // max 20
  };

  // Sections (20 pts)
  breakdown.sections = (foundSections.length / 5) * 20;
  score += breakdown.sections;

  // Keywords (30 pts)
  // Cap at 15 words for full points
  breakdown.keywords = Math.min((keywordDensity / 10) * 30, 30);
  score += breakdown.keywords;

  // Formatting (15 pts)
  // If we extracted text successfully, that's a good sign.
  // Check file type
  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const isDocx = fileName.toLowerCase().endsWith('.docx');
  let formattingScore = 15;
  if (!text || text.length < 100) formattingScore = 0; // Likely image based or empty
  breakdown.formatting = formattingScore;
  score += breakdown.formatting;

  // Skills (15 pts)
  // Rudimentary check: if "Skills" section exists and text is long enough
  if (sections.skills) {
      breakdown.skills = 15;
  } else {
      breakdown.skills = 5;
  }
  score += breakdown.skills;

  // Clarity/Contact (20 pts)
  let clarityScore = 0;
  if (hasEmail) clarityScore += 10;
  if (hasPhone) clarityScore += 5;
  if (hasLinkedIn) clarityScore += 5;
  breakdown.clarity = clarityScore;
  score += breakdown.clarity;

  // Feedback Generation
  const strengths = [];
  const improvements = [];

  if (hasEmail) strengths.push('Contact information (Email) detected.');
  else improvements.push('Missing email address.');
  
  if (sections.experience) strengths.push('Work Experience section detected.');
  else improvements.push('Add a clear "Work Experience" section.');

  if (sections.education) strengths.push('Education section detected.');
  else improvements.push('Add a clear "Education" section.');

  if (sections.skills) strengths.push('Skills section detected.');
  else improvements.push('Add a dedicated "Skills" section.');

  if (keywordDensity > 5) strengths.push('Good use of action verbs.');
  else improvements.push('Use more action verbs (e.g., Led, Developed, Analyzed).');

  if (text.length < 500) improvements.push('Resume content seems too short. Aim for at least 300-500 words.');

  return {
    score: Math.round(score),
    breakdown,
    strengths,
    improvements,
    details: {
      wordCount: text.split(/\s+/).length,
      foundSections,
      missingSections,
      contactInfoFound: hasEmail || hasPhone,
      fileType: isPdf ? 'PDF' : (isDocx ? 'DOCX' : 'Unknown')
    }
  };
};