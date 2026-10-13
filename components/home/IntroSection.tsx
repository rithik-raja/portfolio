import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

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
          I design and ship production systems that prioritize reliability,
          clarity, and measurable impact. Across healthcare, fintech, and
          product engineering, I focus on turning complex requirements into
          maintainable software that teams can trust every day.
        </p>
        <div className="intro-links">
          <a
            className="project-link"
            href="https://github.com/rithik-raja"
            target="_blank"
            rel="noreferrer"
          >
            <span>github.com/rithik-raja</span>
            <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <a className="project-link" href="mailto:rithik.raja@marchforth.us">
            <span>rithik.raja@marchforth.us</span>
            <Mail size={14} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="intro-photo-wrap" aria-hidden="true">
        <div className="intro-photo-outline" />
        <Image
          src="/headshot.jpeg"
          alt=""
          width={1080}
          height={1616}
          sizes="(max-width: 768px) 230px, 280px"
          className="intro-photo"
        />
      </div>
    </SectionReveal>
  );
}
