import { ResumeData, Translation } from './types';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

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