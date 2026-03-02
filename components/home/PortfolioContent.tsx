import { ExperienceSection } from "@/components/home/ExperienceSection";
import { IntroSection } from "@/components/home/IntroSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import type { Experience, Project } from "@/components/home/data";

type PortfolioContentProps = {
  experiences: Experience[];
  projects: Project[];
};

export function PortfolioContent({
  experiences,
  projects,
}: PortfolioContentProps) {
  return (
    <section className="content-shell" aria-label="Experience and projects">
      <div className="content-inner">
        <IntroSection />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
      </div>
    </section>
  );
}
