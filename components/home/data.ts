export type Experience = {
  title: string;
  company: string;
  logoSrc: string;
  summary: string;
  patents?: string[];
};

export type Project = {
  name: string;
  skills: string[];
  summary: string;
  link?: string;
  linkLabel?: string;
};

export type Education = {
  school: string;
  degree: string;
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    title: "Data Scientist",
    company: "Humana",
    logoSrc: "/humana-logo.jpeg",
    summary:
      "At Humana, I build healthcare AI systems where quality and auditability matter as much as model performance. Through agentic optimization loops, I improved medical code extraction accuracy from 72% to 93%, reduced system cost by 40%, and raised citation-to-evidence accuracy from 50% to 99.8%, helping teams move faster while staying aligned with strict healthcare standards.",
    patents: [
      "Largest Common Subsequence and Fuzzy Window Matching for LLM Citation Alignment in Medical Records with OCR Artifacts",
      "System to Automate Medical Record Retrieval with AI Reconciliation for Health Information Management Systems",
    ],
  },
  {
    title: "Software Engineer",
    company: "Bank of America",
    logoSrc: "/bank-of-america-logo.jpeg",
    summary:
      "At Bank of America, I focused on making internal systems faster and safer for teams that support highly regulated financial workflows. I modernized React code, reconciled Node.js backend code with microservices owned by partner teams across the organization, and helped cut redundant SQL table footprint by over 50%, which made releases easier to validate in a compliance-heavy environment.",
  },
];

export const projects: Project[] = [
  {
    name: "Gathr",
    skills: ["React Native", "Google Cloud", "Next.js"],
    summary:
      "Launched a cross-platform campus involvement app serving 7,000+ users and 200+ student organizations. Features social media–style feed, native calendar integration, Instagram sync, and push notification reminders. 5 stars across 50+ reviews on the App Store.",
    link: "https://getgathr.app",
  },
  {
    name: "PushStart CRM",
    skills: ["Next.js", "Express.js", "Stripe", "SQLite"],
    summary:
      "Built an all-in-one CRM for auto detailing businesses with online booking and scheduling, team management, sales pipelines, and a revenue dashboard. Features mobile PWA for field work, text and email reminders, recurring services, deposits/payments with Stripe, and more.",
    linkLabel: "Coming Soon",
  },
  {
    name: "PdfGator",
    skills: ["React.js", "Django REST", "AWS"],
    summary:
      "Built a RAG-based research platform for large academic PDFs with vector retrieval and a chat interface with inline citations. Features citation and bibliography generation in all academic formats.",
    link: "https://github.com/rithik-raja/pdfgator-frontend",
  },
];

export const education: Education = {
  school: "University of Florida",
  degree: "B.S., Data Science",
  highlights: [
    "Undergraduate Research Assistant: Human Neuromechanics Lab",
    "Teaching Assistant: Intro to Statistics",
  ],
};
