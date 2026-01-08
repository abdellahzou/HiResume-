import { ResumeData, Translation } from './types';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export const generateLatex = (data: ResumeData, t: Translation): string => {
  const sanitize = (str: string) => str.replace(/([&%$#_{}])/g, '\\$1');

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

\\section{${t.headings.contact}}
${sanitize(data.personalInfo.summary)}

\\section{${t.headings.experience}}
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

\\section{${t.headings.education}}
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

\\section{${t.headings.skills}}
${data.skills.map((skill) => sanitize(skill.name)).join(', ')}

\\end{document}
  `;
};

export const generateDocx = async (data: ResumeData, t: Translation): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
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

          // Summary
          new Paragraph({
            text: t.labels.summary.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            border: {
              bottom: { color: "auto", space: 1, value: "single", size: 6 },
            },
          }),
          new Paragraph({ text: data.personalInfo.summary }),
          new Paragraph({ text: "" }),

          // Experience
          new Paragraph({
            text: t.headings.experience.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            border: {
              bottom: { color: "auto", space: 1, value: "single", size: 6 },
            },
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
          ]),

          // Education
          new Paragraph({
            text: t.headings.education.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            border: {
              bottom: { color: "auto", space: 1, value: "single", size: 6 },
            },
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
          ]),

          // Skills
          new Paragraph({
            text: t.headings.skills.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            border: {
              bottom: { color: "auto", space: 1, value: "single", size: 6 },
            },
          }),
          new Paragraph({
            text: data.skills.map((s) => s.name).join(", "),
          }),
        ],
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