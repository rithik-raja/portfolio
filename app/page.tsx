"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import helvetikerFontData from "three/examples/fonts/helvetiker_regular.typeface.json";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const TILT_X = 0.2;
const TILT_Y = 0.2;
const PUSH_Z = 1;

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
    () => createCenteredTextGeometry("Rithik", font, 1.55),
    [font]
  );
  const rajaGeometry = useMemo(
    () => createCenteredTextGeometry("Raja", font, -1.55),
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

  useEffect(() => {
    return () => {
      rithikGeometry.dispose();
      rajaGeometry.dispose();
      frontMaterial.dispose();
      sideMaterial.dispose();
      sideTexture?.dispose();
    };
  }, [frontMaterial, rajaGeometry, rithikGeometry, sideMaterial, sideTexture]);

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
      </group>
    </>
  );
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
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
        <div className="overlay">
          <p>Scroll to extrude</p>
        </div>
      </div>
      <div className="spacer" aria-hidden />
    </main>
  );
}
