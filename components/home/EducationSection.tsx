import type { Education } from "@/components/home/data";
import { SectionReveal } from "@/components/home/SectionReveal.client";

type EducationSectionProps = {
  education: Education;
};

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <SectionReveal className="content-block" ariaLabel="Education" delayMs={360}>
      <h2>Education</h2>
      <div className="education-entry">
        <h3 className="education-heading">
          {education.school} - {education.degree}
        </h3>
        <ul className="education-highlights">
          {education.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    </SectionReveal>
  );
}
