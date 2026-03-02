"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

import { NameExtrusionScene } from "@/components/home/NameExtrusionScene.client";

const EXTRUSION_SCROLL_DISTANCE_RATIO = 0.65;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ExtrusionStage() {
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
  );
}
