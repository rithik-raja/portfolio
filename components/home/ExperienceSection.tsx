import Image from "next/image";

import { SectionReveal } from "@/components/home/SectionReveal.client";
import type { Experience } from "@/components/home/data";

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <SectionReveal className="content-block" ariaLabel="Experience" delayMs={120}>
      <h2>Experience</h2>
      <div className="experience-journey">
        <div className="experience-timeline">
          {experiences.map((item) => (
            <article
              key={`${item.company}-${item.title}`}
              className="experience-marker"
            >
              <div className="logo-frame">
                <Image
                  src={item.logoSrc}
                  alt={`${item.company} logo`}
                  width={66}
                  height={66}
                  className="company-logo"
                />
              </div>
              <p className="marker-role">{item.title}</p>
              <p className="marker-company">{item.company}</p>
            </article>
          ))}
        </div>
        <div className="experience-text-column">
          {experiences.map((item) => (
            <p key={`${item.company}-summary`} className="experience-paragraph">
              {item.summary}
            </p>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
