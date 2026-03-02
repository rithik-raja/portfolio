export type Experience = {
  title: string;
  company: string;
  logoSrc: string;
  summary: string;
};

export type Project = {
  name: string;
  skills: string[];
  summary: string;
  link: string;
};

export const experiences: Experience[] = [
  {
    title: "Data Scientist",
    company: "Humana",
    logoSrc: "/humana-logo.jpeg",
    summary:
      "At Humana, I build healthcare AI systems where quality and auditability matter as much as model performance. I improved medical code extraction from 72% to 93%, reduced system cost by 40%, and raised citation-to-evidence accuracy from 50% to 99.8%, helping teams move faster while staying aligned with strict healthcare standards.",
  },
  {
    title: "Software Engineer",
    company: "Bank of America",
    logoSrc: "/bank-of-america-logo.jpeg",
    summary:
      "At Bank of America, I focused on making internal systems faster and safer for teams that support highly regulated financial workflows. I modernized React code, shipped backend automation with ASP.NET, and helped cut redundant SQL table footprint by over 50%, which made releases easier to validate in a compliance-heavy environment.",
  },
];

export const projects: Project[] = [
  {
    name: "Gathr",
    skills: ["React Native", "GCP"],
    summary:
      "Launched a cross-platform campus involvement app serving 5,000+ users and 200+ student organizations.",
    link: "https://getgathr.app",
  },
  {
    name: "PdfGator",
    skills: ["React.js", "Django REST", "AWS"],
    summary:
      "Built a citation-aware research platform for large academic PDFs with vector retrieval and secure auth.",
    link: "https://github.com/rithik-raja/pdfgator-frontend",
  },
];
