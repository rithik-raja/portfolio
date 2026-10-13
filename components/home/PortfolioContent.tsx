import { EducationSection } from "@/components/home/EducationSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { IntroSection } from "@/components/home/IntroSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import type { Education, Experience, Project } from "@/components/home/data";

type PortfolioContentProps = {
  experiences: Experience[];
  projects: Project[];
  education: Education;
};

export function PortfolioContent({
  experiences,
  projects,
  education,
}: PortfolioContentProps) {
  return (
    <section className="content-shell" aria-label="Experience and projects">
      <div className="content-inner">
        <IntroSection />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
        <EducationSection education={education} />
      </div>
    </section>
  );
}
