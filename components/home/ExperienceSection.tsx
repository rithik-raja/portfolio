import Image from "next/image";
import { Fragment } from "react";

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
        {experiences.map((item, index) => (
          <Fragment key={`${item.company}-${item.title}`}>
            <article
              className={
                index === experiences.length - 1
                  ? "experience-marker"
                  : "experience-marker experience-marker--linked"
              }
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
            <div className="experience-summary">
              <p className="experience-paragraph">{item.summary}</p>
              {item.patents && item.patents.length > 0 ? (
                <div className="experience-patents">
                  <p className="patents-label">Pending Patents</p>
                  <ul>
                    {item.patents.map((patent) => (
                      <li key={patent}>{patent}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
    </SectionReveal>
  );
}
