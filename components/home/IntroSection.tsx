import Image from "next/image";

import { SectionReveal } from "@/components/home/SectionReveal.client";

export function IntroSection() {
  return (
    <SectionReveal
      className="intro-block"
      ariaLabel="Personal introduction"
      delayMs={0}
    >
      <div className="intro-copy">
        <h1>I build software that just works</h1>
        <p>
          I design and ship production systems with a bias for reliability,
          clarity, and measurable impact. Across healthcare, fintech, and
          product engineering, I focus on turning complex requirements into
          maintainable software that teams can trust every day.
        </p>
      </div>

      <div className="intro-photo-wrap" aria-hidden="true">
        <div className="intro-photo-outline" />
        <Image
          src="https://picsum.photos/440/560?grayscale"
          alt="Portrait placeholder"
          width={440}
          height={560}
          sizes="(max-width: 768px) 230px, 280px"
          className="intro-photo"
        />
      </div>
    </SectionReveal>
  );
}
