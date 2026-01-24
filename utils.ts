import { ResumeData, Translation, AtsResult } from './types';
import {
  Packer,
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip
} from "docx";
// @ts-ignore
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';

export const printResume = (contentScale: number = 1) => {
  const content = document.getElementById('resume-preview-content');
  if (!content) {
    console.error("Resume content not found");
    return;
  }

  // Detect mobile vs desktop
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // Keep original logic for mobile - works perfectly there
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write('<!DOCTYPE html><html><head><title>Resume</title>');

    const styles = document.querySelectorAll('link[rel="stylesheet"], style');
    styles.forEach((styleNode) => {
      doc.write(styleNode.outerHTML);
    });

    doc.write(`
      <style>
        @page { size: A4; margin: 0; }
        html, body { 
          width: 210mm;
          height: 297mm;
          margin: 0; 
          padding: 0; 
          overflow: hidden; 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
          background-color: white;
        }
        #resume-preview-content {
          width: 210mm !important;
          height: 297mm !important;
          box-shadow: none !important;
          margin: 0 !important;
          transform: none !important; 
        }
      </style>
    `);

    doc.write('</head><body>');
    doc.write(content.outerHTML);
    doc.write('</body></html>');
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    };
  } else {
    // New logic for desktop - Use html2pdf for perfect scaling
    const opt = {
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Use a temporary clone to avoid any interaction issues or side effects on the UI
    const clone = content.cloneNode(true) as HTMLElement;
    clone.style.width = '210mm';
    clone.style.height = '297mm';
    clone.style.boxShadow = 'none';
    clone.style.margin = '0';
    clone.style.transform = 'none';

    // Ensure all styles are computed and applied
    // We add it to the body temporarily (invisible) to ensure correct rendering
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    document.body.appendChild(clone);

    html2pdf().set(opt).from(clone).save().then(() => {
      document.body.removeChild(clone);
    });
  }
};

// ... [Keep existing DOCX/LaTeX/ATS code below unchanged] ...
// ... [Only showing top part for brevity as requested, rest is identical] ...

const sanitize = (str: string) => str ? str.replace(/([&%$#_{}])/g, '\\$1') : '';

const latexColors = `
\\usepackage{xcolor}
\\definecolor{primary}{RGB}{37, 99, 235}   % Blue-600
\\definecolor{darktext}{RGB}{15, 23, 42}   % Slate-900
\\definecolor{subtext}{RGB}{71, 85, 105}   % Slate-600
\\definecolor{lightgray}{RGB}{241, 245, 249} % Slate-100
`;

const latexIcons = `
% Fallback for icons if fontawesome is missing
\\newcommand{\\iconEmail}{$\\otimes$}
\\newcommand{\\iconPhone}{$\\circ$}
\\newcommand{\\iconMap}{$\\diamond$}
\\newcommand{\\iconLink}{$\\rightarrow$}
`;

const latexModern = (data: ResumeData, t: Translation) => `
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
${latexColors}
${latexIcons}

\\renewcommand{\\familydefault}{\\sfdefault} % Sans-serif

% Header Style
\\newcommand{\\resumeHeader}[4]{
  \\begin{center}
    {\\Huge \\bfseries \\color{darktext} #1} \\\\[4pt]
    {\\Large \\color{primary} #2} \\\\[4pt]
    \\small \\color{subtext} #3 \\quad #4
  \\end{center}
}

% Section Style
\\titleformat{\\section}{\\large\\bfseries\\color{darktext}\\uppercase}{}{0em}{}[{\\color{gray}\\titlerule}]

\\begin{document}

\\resumeHeader{${sanitize(data.personalInfo.fullName)}}{${sanitize(data.personalInfo.title)}}{${sanitize(data.personalInfo.email)} | ${sanitize(data.personalInfo.phone)}}{${sanitize(data.personalInfo.location)}}

${data.personalInfo.summary ? `\\section{${t.labels.summary}}\n${sanitize(data.personalInfo.summary)}` : ''}

${data.experience.length > 0 ? `\\section{${t.headings.experience}}
\\begin{itemize}[leftmargin=0in, label={}]
${data.experience.map(exp => `
    \\item
    \\textbf{${sanitize(exp.position)}} | ${sanitize(exp.company)} \\hfill \\textit{${sanitize(exp.startDate)} -- ${exp.current ? t.labels.present : sanitize(exp.endDate)}}
    \\begin{itemize}[leftmargin=0.15in]
        \\item ${sanitize(exp.description).replace(/\n/g, '\n        \\item ')}
    \\end{itemize}
`).join('')}
\\end{itemize}` : ''}

${data.projects.length > 0 ? `\\section{${t.headings.projects}}
\\begin{itemize}[leftmargin=0in, label={}]
${data.projects.map(proj => `
    \\item
    \\textbf{${sanitize(proj.name)}} ${proj.link ? `| \\href{${proj.link}}{Link}` : ''} \\\\
    ${sanitize(proj.description)}
`).join('')}
\\end{itemize}` : ''}

${data.education.length > 0 ? `\\section{${t.headings.education}}
\\begin{itemize}[leftmargin=0in, label={}]
${data.education.map(edu => `
    \\item
    \\textbf{${sanitize(edu.school)}} \\hfill ${sanitize(edu.startDate)} -- ${edu.current ? t.labels.present : sanitize(edu.endDate)} \\\\
    ${sanitize(edu.degree)}
`).join('')}
\\end{itemize}` : ''}

${data.skills.length > 0 ? `\\section{${t.headings.skills}}
${data.skills.map(s => `\\colorbox{lightgray}{\\strut ${sanitize(s.name)}}`).join(' ')}` : ''}

\\end{document}
`;

const latexClassic = (data: ResumeData, t: Translation) => `
\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{times} % Times New Roman
${latexColors}

% Section Style (Centered, Serif)
\\titleformat{\\section}{\\large\\bfseries\\uppercase\\centering}{}{0em}{}[\\titlerule]

\\begin{document}

\\begin{center}
    {\\Huge \\textsc{${sanitize(data.personalInfo.fullName)}}} \\\\
    \\vspace{5pt}
    ${sanitize(data.personalInfo.location)} $\\bullet$ ${sanitize(data.personalInfo.phone)} $\\bullet$ ${sanitize(data.personalInfo.email)}
    ${data.personalInfo.website ? `\\\\ ${sanitize(data.personalInfo.website)}` : ''}
\\end{center}

\\vspace{10pt}

${data.personalInfo.summary ? `\\section{${t.labels.summary}}\n${sanitize(data.personalInfo.summary)}` : ''}

${data.experience.length > 0 ? `\\section{${t.headings.experience}}
${data.experience.map(exp => `
\\noindent \\textbf{${sanitize(exp.company)}} \\hfill ${sanitize(exp.startDate)} -- ${exp.current ? t.labels.present : sanitize(exp.endDate)} \\\\
\\textit{${sanitize(exp.position)}} \\\\
${sanitize(exp.description)}
\\vspace{5pt}
`).join('')}` : ''}

${data.education.length > 0 ? `\\section{${t.headings.education}}
${data.education.map(edu => `
\\noindent \\textbf{${sanitize(edu.school)}} \\hfill ${sanitize(edu.startDate)} -- ${edu.current ? t.labels.present : sanitize(edu.endDate)} \\\\
${sanitize(edu.degree)}
\\vspace{5pt}
`).join('')}` : ''}

${data.skills.length > 0 ? `\\section{${t.headings.skills}}
\\begin{center}
${data.skills.map(s => sanitize(s.name)).join(' $\\bullet$ ')}
\\end{center}` : ''}

\\end{document}
`;

const latexSidebar = (data: ResumeData, t: Translation, isMinimal = false) => `
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{multicol}
\\usepackage{parskip}

\\definecolor{sidebargray}{RGB}{248, 250, 252}
\\definecolor{darktext}{RGB}{15, 23, 42}
\\definecolor{primary}{RGB}{37, 99, 235}

\\renewcommand{\\familydefault}{\\sfdefault}

\\begin{document}

${!isMinimal ? `
% PROFESSIONAL TEMPLATE (Sidebar Left)
\\noindent
\\begin{minipage}[t]{0.32\\textwidth}
    \\vspace{0pt} 
    {\\Large \\textbf{${sanitize(data.personalInfo.fullName)}}} \\\\
    \\textcolor{primary}{\\textbf{${sanitize(data.personalInfo.title)}}} \\\\
    \\vspace{10pt}
    
    \\section*{${t.headings.contact}}
    \\small
    ${sanitize(data.personalInfo.email)} \\\\
    ${sanitize(data.personalInfo.phone)} \\\\
    ${sanitize(data.personalInfo.location)} \\\\
    
    \\vspace{10pt}
    ${data.skills.length > 0 ? `
    \\section*{${t.headings.skills}}
    \\small
    ${data.skills.map(s => sanitize(s.name)).join('\\\\ ')}
    \\vspace{10pt}
    ` : ''}
    
    ${data.education.length > 0 ? `
    \\section*{${t.headings.education}}
    \\small
    ${data.education.map(edu => `
        \\textbf{${sanitize(edu.school)}} \\\\
        ${sanitize(edu.degree)} \\\\
        \\color{gray} ${sanitize(edu.startDate)} - ${edu.current ? t.labels.present : sanitize(edu.endDate)} \\\\
    `).join('\\vspace{4pt}')}
    ` : ''}
\\end{minipage}
\\hfill
\\vline % Vertical Line
\\hfill
\\begin{minipage}[t]{0.64\\textwidth}
    \\vspace{0pt}
    ${data.personalInfo.summary ? `\\section*{${t.labels.summary}} ${sanitize(data.personalInfo.summary)}` : ''}

    ${data.experience.length > 0 ? `
    \\section*{${t.headings.experience}}
    ${data.experience.map(exp => `
        \\textbf{${sanitize(exp.position)}} \\hfill ${sanitize(exp.startDate)} -- ${exp.current ? t.labels.present : sanitize(exp.endDate)} \\\\
        \\textit{${sanitize(exp.company)}} \\\\
        \\small ${sanitize(exp.description)} \\\\
        \\vspace{5pt}
    `).join('')}
    ` : ''}
    
    ${data.projects.length > 0 ? `
    \\section*{${t.headings.projects}}
    ${data.projects.map(proj => `
        \\textbf{${sanitize(proj.name)}} \\\\
        \\small ${sanitize(proj.description)} \\\\
        \\vspace{5pt}
    `).join('')}
    ` : ''}
\\end{minipage}
` : `
% MINIMAL TEMPLATE (Clean Grid)
\\noindent
\\begin{minipage}[t]{0.30\\textwidth}
    ${data.education.length > 0 ? `
    \\textbf{${t.headings.education}} \\\\
    ${data.education.map(edu => `
        \\textbf{${sanitize(edu.school)}} \\\\
        ${sanitize(edu.degree)} \\\\
        \\small ${sanitize(edu.startDate)} \\\\
        \\vspace{4pt}
    `).join('')}
    \\vspace{10pt}
    ` : ''}
    
    ${data.skills.length > 0 ? `
    \\textbf{${t.headings.skills}} \\\\
    ${data.skills.map(s => sanitize(s.name)).join('\\\\ ')}
    ` : ''}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.65\\textwidth}
    {\\Huge ${sanitize(data.personalInfo.fullName)}} \\\\
    ${sanitize(data.personalInfo.title)} \\\\
    \\vspace{10pt}
    
    ${data.personalInfo.summary ? `\\textbf{${t.labels.summary}} \\\\ ${sanitize(data.personalInfo.summary)} \\vspace{10pt}` : ''}
    
    ${data.experience.length > 0 ? `
    \\textbf{${t.headings.experience}} \\\\
    ${data.experience.map(exp => `
        \\textbf{${sanitize(exp.position)}} | ${sanitize(exp.company)} \\\\
        \\small ${sanitize(exp.description)} \\\\
        \\vspace{5pt}
    `).join('')}
    ` : ''}
\\end{minipage}
`}
\\end{document}
`;

const createStyledDoc = (children: any[], templateId: string) => {
  const isSerif = ['classic', 'executive'].includes(templateId);
  const mainFont = isSerif ? "Times New Roman" : "Arial";
  const headerFont = isSerif ? "Times New Roman" : "Arial";

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: mainFont,
            size: 22, // 11pt
            color: "333333",
          },
        },
        heading1: {
          run: {
            font: headerFont,
            size: 28, // 14pt
            bold: true,
            color: "000000",
            allCaps: true,
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
          },
        },
        heading2: {
          run: {
            font: headerFont,
            size: 24, // 12pt
            bold: true,
            color: "444444",
          },
          paragraph: {
            spacing: { before: 120, after: 120 },
          },
        },
        heading3: { // Used for sidebars
          run: {
            font: headerFont,
            size: 20, // 10pt
            bold: true,
            color: "666666",
            allCaps: true,
          },
          paragraph: {
            spacing: { before: 100, after: 60 },
          }
        },
        title: {
          run: {
            font: headerFont,
            size: 48, // 24pt
            bold: true,
            color: "000000",
          },
          paragraph: {
            spacing: { after: 120 },
          },
        },
      },
    },
    sections: [{
      properties: {},
      children: children,
    }],
  });
};

const docxStandard = (data: ResumeData, t: Translation, templateId: string) => {
  const centered = templateId === 'classic' || templateId === 'executive';
  const alignment = centered ? AlignmentType.CENTER : AlignmentType.LEFT;

  const nameColor = templateId === 'creative' ? "2563EB" : "000000";
  const titleColor = "555555";
  const sectionBorder = templateId !== 'minimal';

  const children: any[] = [
    new Paragraph({
      alignment: alignment,
      children: [
        new TextRun({
          text: data.personalInfo.fullName,
          bold: true,
          size: 48, // 24pt
          color: nameColor
        })
      ],
    }),
    new Paragraph({
      alignment: alignment,
      children: [
        new TextRun({
          text: data.personalInfo.title,
          size: 28,
          color: titleColor
        })
      ],
      spacing: { after: 200 }
    }),
    new Paragraph({
      alignment: alignment,
      children: [
        new TextRun({ text: "✉ " + data.personalInfo.email + "   " }),
        new TextRun({ text: "☎ " + data.personalInfo.phone + "   " }),
        new TextRun({ text: "📍 " + data.personalInfo.location }),
      ],
      spacing: { after: 400 }
    }),
  ];

  const addSection = (title: string, content: any[]) => {
    children.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        border: sectionBorder ? { bottom: { color: "CCCCCC", space: 1, value: "single", size: 6 } } : undefined,
      }),
      ...content
    );
  };

  if (data.personalInfo.summary) {
    addSection(t.labels.summary.toUpperCase(), [
      new Paragraph({ text: data.personalInfo.summary, spacing: { after: 300 } })
    ]);
  }

  if (data.experience.length > 0) {
    addSection(t.headings.experience.toUpperCase(), data.experience.flatMap((exp) => [
      new Paragraph({
        children: [
          new TextRun({ text: exp.position, bold: true, size: 24 }),
          new TextRun({ text: ` | ${exp.company}`, size: 24, color: "444444" }),
          new TextRun({
            text: `\t${exp.startDate} - ${exp.current ? t.labels.present : exp.endDate}`,
            italics: true,
            size: 20
          }),
        ],
        tabStops: [{ type: "right", position: convertInchesToTwip(6.5) }]
      }),
      new Paragraph({ text: exp.description, spacing: { after: 200 } }),
    ]));
  }

  if (data.projects.length > 0) {
    addSection(t.headings.projects.toUpperCase(), data.projects.flatMap((proj) => [
      new Paragraph({
        children: [
          new TextRun({ text: proj.name, bold: true }),
          ...(proj.link ? [new TextRun({ text: ` | ${proj.link}`, italics: true, color: "2563EB" })] : []),
        ],
      }),
      new Paragraph({ text: proj.description, spacing: { after: 200 } }),
    ]));
  }

  if (data.education.length > 0) {
    addSection(t.headings.education.toUpperCase(), data.education.flatMap((edu) => [
      new Paragraph({
        children: [
          new TextRun({ text: edu.school, bold: true }),
          new TextRun({
            text: `\t${edu.startDate} - ${edu.current ? t.labels.present : edu.endDate}`,
            italics: true,
          }),
        ],
        tabStops: [{ type: "right", position: convertInchesToTwip(6.5) }]
      }),
      new Paragraph({ text: edu.degree, spacing: { after: 200 } }),
    ]));
  }

  if (data.skills.length > 0) {
    addSection(t.headings.skills.toUpperCase(), [
      new Paragraph({
        text: data.skills.map((s) => s.name).join("  •  "),
        alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT
      })
    ]);
  }

  return children;
};

const docxSidebar = (data: ResumeData, t: Translation) => {
  const sidebarContent = [
    new Paragraph({
      text: t.headings.contact.toUpperCase(),
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: "✉ ", size: 16 }), new TextRun(data.personalInfo.email)] }),
    new Paragraph({ children: [new TextRun({ text: "☎ ", size: 16 }), new TextRun(data.personalInfo.phone)] }),
    new Paragraph({ children: [new TextRun({ text: "📍 ", size: 16 }), new TextRun(data.personalInfo.location)] }),
    new Paragraph({ text: "" }),
  ];

  if (data.skills.length > 0) {
    sidebarContent.push(
      new Paragraph({ text: t.headings.skills.toUpperCase(), heading: HeadingLevel.HEADING_3 }),
      ...data.skills.map(s => new Paragraph({
        text: s.name,
        bullet: { level: 0 }
      })),
      new Paragraph({ text: "" })
    );
  }

  if (data.education.length > 0) {
    sidebarContent.push(
      new Paragraph({ text: t.headings.education.toUpperCase(), heading: HeadingLevel.HEADING_3 }),
      ...data.education.map(edu => new Paragraph({
        children: [
          new TextRun({ text: edu.school, bold: true }),
          new TextRun({ text: `\n${edu.degree}` }),
          new TextRun({ text: `\n${edu.startDate} - ${edu.endDate}`, italics: true, color: "555555", size: 18 }),
        ],
        spacing: { after: 120 }
      }))
    );
  }

  const mainContent = [
    new Paragraph({
      text: data.personalInfo.fullName,
      heading: HeadingLevel.TITLE,
      spacing: { after: 0 }
    }),
    new Paragraph({
      children: [new TextRun({ text: data.personalInfo.title, color: "2563EB", size: 28, bold: true })],
      spacing: { after: 200 }
    }),
    new Paragraph({
      border: { bottom: { color: "CCCCCC", space: 1, value: "single", size: 6 } },
      spacing: { after: 200 }
    })
  ];

  if (data.personalInfo.summary) {
    mainContent.push(
      new Paragraph({ text: t.labels.summary.toUpperCase(), heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: data.personalInfo.summary, spacing: { after: 200 } })
    );
  }

  if (data.experience.length > 0) {
    mainContent.push(
      new Paragraph({ text: t.headings.experience.toUpperCase(), heading: HeadingLevel.HEADING_2 }),
      ...data.experience.flatMap(exp => [
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 24 }),
            new TextRun({ text: ` | ${exp.company}`, size: 24, color: "444444" }),
          ]
        }),
        new Paragraph({
          text: `${exp.startDate} - ${exp.current ? t.labels.present : exp.endDate}`,
          italics: true,
          color: "666666",
          spacing: { after: 100 }
        }),
        new Paragraph({ text: exp.description, spacing: { after: 240 } })
      ])
    );
  }

  if (data.projects.length > 0) {
    mainContent.push(
      new Paragraph({ text: t.headings.projects.toUpperCase(), heading: HeadingLevel.HEADING_2 }),
      ...data.projects.flatMap(proj => [
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true }),
            ...(proj.link ? [new TextRun({ text: ` | ${proj.link}`, color: "2563EB" })] : []),
          ],
        }),
        new Paragraph({ text: proj.description, spacing: { after: 200 } })
      ])
    );
  }

  const table = new Table({
    columnWidths: [3200, 6400],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            children: sidebarContent,
            shading: { fill: "F8FAFC", type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 200, bottom: 200, left: 150, right: 150 },
            verticalAlign: "top"
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            children: mainContent,
            margins: { top: 200, bottom: 200, left: 400, right: 100 },
            verticalAlign: "top"
          }),
        ],
      }),
    ],
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
    },
  });

  return [table];
};

export const generateLatex = (data: ResumeData, t: Translation): string => {
  switch (data.templateId) {
    case 'classic': return latexClassic(data, t);
    case 'professional': return latexSidebar(data, t, false);
    case 'minimal': return latexSidebar(data, t, true);
    case 'executive': return latexClassic(data, t);
    case 'creative': return latexModern(data, t);
    case 'modern':
    default: return latexModern(data, t);
  }
};

export const generateDocx = async (data: ResumeData, t: Translation): Promise<Blob> => {
  let children;

  switch (data.templateId) {
    case 'professional':
    case 'minimal':
      children = docxSidebar(data, t);
      break;
    default:
      children = docxStandard(data, t, data.templateId);
  }

  const doc = createStyledDoc(children, data.templateId);
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

  const sections = {
    experience: /experience|employment|history|work/i.test(lowerText),
    education: /education|university|college|degree/i.test(lowerText),
    skills: /skills|competencies|technologies|proficiencies/i.test(lowerText),
    projects: /projects|portfolio/i.test(lowerText),
    summary: /summary|objective|about/i.test(lowerText)
  };

  const foundSections = Object.entries(sections).filter(([, found]) => found).map(([key]) => key);
  const missingSections = Object.entries(sections).filter(([, found]) => !found).map(([key]) => key);

  const hasEmail = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(text);
  const hasPhone = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(text) || /\d{10}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text);

  const actionVerbs = [
    'led', 'managed', 'developed', 'created', 'implemented', 'designed', 'improved',
    'increased', 'reduced', 'saved', 'achieved', 'launched', 'mentored', 'analyzed'
  ];
  const foundKeywords = actionVerbs.filter(verb => lowerText.includes(verb));
  const keywordDensity = foundKeywords.length;

  let score = 0;
  const breakdown = {
    sections: 0,
    keywords: 0,
    formatting: 0,
    skills: 0,
    clarity: 0
  };

  breakdown.sections = (foundSections.length / 5) * 20;
  score += breakdown.sections;

  breakdown.keywords = Math.min((keywordDensity / 10) * 30, 30);
  score += breakdown.keywords;

  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const isDocx = fileName.toLowerCase().endsWith('.docx');
  let formattingScore = 15;
  if (!text || text.length < 100) formattingScore = 0;
  breakdown.formatting = formattingScore;
  score += breakdown.formatting;

  if (sections.skills) {
    breakdown.skills = 15;
  } else {
    breakdown.skills = 5;
  }
  score += breakdown.skills;

  let clarityScore = 0;
  if (hasEmail) clarityScore += 10;
  if (hasPhone) clarityScore += 5;
  if (hasLinkedIn) clarityScore += 5;
  breakdown.clarity = clarityScore;
  score += breakdown.clarity;

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
