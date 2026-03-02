"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import helvetikerFontData from "three/examples/fonts/helvetiker_regular.typeface.json";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const TILT_X = 0.2;
const TILT_Y = 0.3;
const PUSH_Z = 1;
const EXTRUSION_SCROLL_DISTANCE_RATIO = 0.65;
const EMBELLISHMENT_STAGGER_DELAYS = [
  0.37, 0.09, 0.61, 0.22, 0.53, 0.14, 0.45, 0.29, 0.68, 0.17,
];
const EMBELLISHMENTS = [
  { kind: "donut", position: [-6.0, 3.25, -2.6], rotation: [0.64, 0.18, 0.42], scale: 0.7, rise: 0.78 },
  { kind: "pill", position: [-5.5, -0.1, -2.0], rotation: [0.38, 0.82, 0.16], scale: 0.74, rise: 0.82 },
  { kind: "donut", position: [-4.45, 1.55, -2.35], rotation: [0.82, -0.26, 0.24], scale: 0.58, rise: 0.74 },
  { kind: "donut", position: [-3.9, -2.75, -2.25], rotation: [0.46, 0.64, -0.12], scale: 0.7, rise: 0.84 },
  { kind: "pill", position: [-1.65, 3.55, -2.75], rotation: [0.72, -0.42, 0.14], scale: 0.56, rise: 0.7 },
  { kind: "pill", position: [1.75, -3.7, -2.2], rotation: [0.5, -0.68, 0.18], scale: 0.67, rise: 0.77 },
  { kind: "donut", position: [3.95, 2.95, -2.65], rotation: [0.66, 0.48, -0.22], scale: 0.62, rise: 0.73 },
  { kind: "pill", position: [4.85, -3.2, -2.1], rotation: [0.42, 0.28, 0.64], scale: 0.78, rise: 0.9 },
  { kind: "donut", position: [4.0, -0.25, -2.35], rotation: [0.6, 0.56, -0.18], scale: 0.8, rise: 0.93 },
  { kind: "pill", position: [6.65, 2.25, -2.8], rotation: [0.54, 0.16, 0.58], scale: 0.71, rise: 0.79 },
] as const;

const experiences = [
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

const projects = [
  {
    name: "Gathr",
    period: "April 2024 - April 2025",
    stack: "React Native, GCP",
    summary:
      "Launched a cross-platform campus involvement app serving 5,000+ users and 200+ student organizations.",
    link: "https://getgathr.app",
  },
  {
    name: "PdfGator",
    period: "June 2023 - September 2023",
    stack: "React.js, Django REST, AWS",
    summary:
      "Built a citation-aware research platform for large academic PDFs with vector retrieval and secure auth.",
    link: "https://github.com/rithik-raja/pdfgator-frontend",
  },
];

function createCenteredTextGeometry(
  text: string,
  font: ReturnType<FontLoader["parse"]>,
  yOffset: number
) {
  const geometry = new TextGeometry(text, {
    font,
    size: 1.85,
    depth: 0.525,
    curveSegments: 22,
    bevelEnabled: true,
    bevelThickness: 0.028,
    bevelSize: 0.013,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry.computeBoundingBox();

  const box = geometry.boundingBox;
  if (box) {
    const centerX = (box.max.x + box.min.x) * 0.5;
    const centerY = (box.max.y + box.min.y) * 0.5;
    geometry.translate(-centerX, yOffset - centerY, 0);
  }

  return geometry;
}

function NameExtrusionScene({ progress }: { progress: number }) {
  const layoutGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);
  const { viewport } = useThree();

  const font = useMemo(() => {
    const loader = new FontLoader();
    return loader.parse(helvetikerFontData);
  }, []);

  const sideTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;

    for (let x = -256; x < 512; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 256, 256);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.2, 1.4);
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const rithikGeometry = useMemo(
    () => createCenteredTextGeometry("rithik", font, 1.55),
    [font]
  );
  const rajaGeometry = useMemo(
    () => createCenteredTextGeometry("raja", font, -1.55),
    [font]
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#090909",
        metalness: 0.36,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
    []
  );

  const sideMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#101010",
        map: sideTexture,
        metalness: 0.32,
        roughness: 0.3,
        clearcoat: 0.72,
        clearcoatRoughness: 0.22,
      }),
    [sideTexture]
  );

  const embellishmentMaterials = useMemo(
    () =>
      EMBELLISHMENTS.map(
        () =>
          new THREE.MeshPhysicalMaterial({
            color: "#090909",
            metalness: 0.36,
            roughness: 0.22,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
            transparent: true,
            opacity: 0,
            reflectivity: 1,
          })
      ),
    []
  );

  const embellishmentGeometries = useMemo(
    () => ({
      donut: new THREE.TorusGeometry(0.55, 0.16, 32, 64),
      pill: new THREE.CapsuleGeometry(0.22, 0.75, 10, 20),
    }),
    []
  );

  const embellishmentRefs = useRef<Array<THREE.Mesh | null>>([]);

  useEffect(() => {
    return () => {
      rithikGeometry.dispose();
      rajaGeometry.dispose();
      frontMaterial.dispose();
      sideMaterial.dispose();
      embellishmentMaterials.forEach((material) => material.dispose());
      embellishmentGeometries.donut.dispose();
      embellishmentGeometries.pill.dispose();
      sideTexture?.dispose();
    };
  }, [
    embellishmentGeometries.donut,
    embellishmentGeometries.pill,
    embellishmentMaterials,
    frontMaterial,
    rajaGeometry,
    rithikGeometry,
    sideMaterial,
    sideTexture,
  ]);

  useFrame((_, delta) => {
    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      progress,
      6.5,
      delta
    );
    const t = Math.pow(smoothProgress.current, 0.85);
    const baseScale = THREE.MathUtils.clamp(viewport.width / 16.5, 0.45, 0.7);

    if (layoutGroupRef.current) {
      layoutGroupRef.current.scale.setScalar(baseScale);
    }

    if (groupRef.current) {
      groupRef.current.scale.z = t;
      groupRef.current.rotation.x = t * TILT_X;
      groupRef.current.rotation.y = -t * TILT_Y;
      groupRef.current.position.z = -t * PUSH_Z;
    }

    EMBELLISHMENTS.forEach((item, index) => {
      const mesh = embellishmentRefs.current[index];
      if (!mesh) {
        return;
      }

      const delayed = clamp(
        (t - EMBELLISHMENT_STAGGER_DELAYS[index]) /
          (1 - EMBELLISHMENT_STAGGER_DELAYS[index]),
        0,
        1
      );
      const eased = THREE.MathUtils.smootherstep(delayed, 0, 1);
      mesh.position.y = item.position[1] - item.rise * (1 - eased);
      mesh.position.z = item.position[2] - (1 - eased) * 0.35;
      mesh.rotation.x = item.rotation[0] + (1 - eased) * 0.28;
      mesh.rotation.y = item.rotation[1] + (1 - eased) * 0.2;
      mesh.rotation.z = item.rotation[2] + (1 - eased) * 0.16;

      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.opacity = eased * 0.88;
    });
  });

  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#ffffff", "#e7e7e7", 0.65]} />
      <directionalLight
        position={[-6, 7, 8]}
        intensity={1.25}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[9, -4, 6]} intensity={0.88} color="#f0f0f0" />
      <directionalLight position={[0, 5, -8]} intensity={0.38} color="#fafafa" />

      <group ref={layoutGroupRef}>
        <group ref={groupRef}>
          <mesh
            geometry={rithikGeometry}
            material={[frontMaterial, sideMaterial]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={rajaGeometry}
            material={[frontMaterial, sideMaterial]}
            castShadow
            receiveShadow
          />
        </group>

        <group>
          {EMBELLISHMENTS.map((item, index) => (
            <mesh
              key={`${item.kind}-${index}`}
              ref={(node) => {
                embellishmentRefs.current[index] = node;
              }}
              geometry={
                item.kind === "donut"
                  ? embellishmentGeometries.donut
                  : embellishmentGeometries.pill
              }
              material={embellishmentMaterials[index]}
              position={item.position}
              rotation={
                new THREE.Euler(item.rotation[0], item.rotation[1], item.rotation[2])
              }
              scale={item.scale}
              castShadow
              receiveShadow
            />
          ))}
        </group>
      </group>
    </>
  );
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const targetDistance = window.innerHeight * EXTRUSION_SCROLL_DISTANCE_RATIO;
      const current = targetDistance > 0 ? window.scrollY / targetDistance : 0;
      setScrollProgress(clamp(current, 0, 1));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className="extrusion-page">
      <div className="stage">
        <Canvas
          camera={{ position: [0, 0.1, 10.5], fov: 34 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true }}
          shadows
        >
          <NameExtrusionScene progress={scrollProgress} />
        </Canvas>
      </div>

      <section
        className="content-shell"
        aria-label="Experience and projects"
      >
        <div className="content-inner">
          <header className="content-header">
            <p>Resume</p>
            <h1>Experience + Projects</h1>
          </header>

          <section className="content-block" aria-label="Experience">
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
                  <p
                    key={`${item.company}-summary`}
                    className="experience-paragraph"
                  >
                    {item.summary}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="content-block" aria-label="Projects">
            <h2>Projects</h2>
            {projects.map((project) => (
              <article key={project.name} className="entry-card">
                <div className="entry-top">
                  <h3>{project.name}</h3>
                  <span>{project.period}</span>
                </div>
                <p>{project.stack}</p>
                <p>{project.summary}</p>
                <a href={project.link} target="_blank" rel="noreferrer">
                  {project.link}
                </a>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
