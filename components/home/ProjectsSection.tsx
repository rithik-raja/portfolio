import { ArrowRight } from "lucide-react";

import type { Project } from "@/components/home/data";
import { SectionReveal } from "@/components/home/SectionReveal.client";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <SectionReveal className="content-block" ariaLabel="Projects" delayMs={240}>
      <h2>Projects</h2>
      {projects.map((project) => (
        <article key={project.name} className="entry-card">
          <div className="entry-top">
            <h3>{project.name}</h3>
          </div>
          <ul className="project-skills" aria-label={`${project.name} skills`}>
            {project.skills.map((skill) => (
              <li key={skill} className="project-skill-pill">
                {skill}
              </li>
            ))}
          </ul>
          <p>{project.summary}</p>
          <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
            <span>{project.link}</span>
            <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </article>
      ))}
    </SectionReveal>
  );
}
