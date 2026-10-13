"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import helvetikerFontData from "@/assets/fonts/helvetiker_regular.typeface.json";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

const TILT_X = 0.2;
const TILT_Y = 0.3;
const PUSH_Z = 1;
const DESKTOP_EMBELLISHMENT_STAGGER_DELAYS = [
  0.37, 0.09, 0.61, 0.22, 0.53, 0.14, 0.45, 0.29, 0.68, 0.17,
];

const DESKTOP_EMBELLISHMENTS = [
  {
    kind: "donut",
    position: [-6.0, 3.25, -2.6],
    rotation: [0.64, 0.18, 0.42],
    scale: 0.7,
    rise: 0.78,
  },
  {
    kind: "pill",
    position: [-5.5, -0.1, -2.0],
    rotation: [0.38, 0.82, 0.16],
    scale: 0.74,
    rise: 0.82,
  },
  {
    kind: "donut",
    position: [-4.45, 1.55, -2.35],
    rotation: [0.82, -0.26, 0.24],
    scale: 0.58,
    rise: 0.74,
  },
  {
    kind: "donut",
    position: [-3.9, -2.75, -2.25],
    rotation: [0.46, 0.64, -0.12],
    scale: 0.7,
    rise: 0.84,
  },
  {
    kind: "pill",
    position: [-1.65, 3.55, -2.75],
    rotation: [0.72, -0.42, 0.14],
    scale: 0.56,
    rise: 0.7,
  },
  {
    kind: "pill",
    position: [1.75, -3.7, -2.2],
    rotation: [0.5, -0.68, 0.18],
    scale: 0.67,
    rise: 0.77,
  },
  {
    kind: "donut",
    position: [3.95, 2.95, -2.65],
    rotation: [0.66, 0.48, -0.22],
    scale: 0.62,
    rise: 0.73,
  },
  {
    kind: "pill",
    position: [4.85, -3.2, -2.1],
    rotation: [0.42, 0.28, 0.64],
    scale: 0.78,
    rise: 0.9,
  },
  {
    kind: "donut",
    position: [4.0, -0.25, -2.35],
    rotation: [0.6, 0.56, -0.18],
    scale: 0.8,
    rise: 0.93,
  },
  {
    kind: "pill",
    position: [6.65, 2.25, -2.8],
    rotation: [0.54, 0.16, 0.58],
    scale: 0.71,
    rise: 0.79,
  },
] as const;

const MOBILE_EMBELLISHMENT_STAGGER_DELAYS = [
  0.16, 0.34, 0.22, 0.47, 0.29, 0.41, 0.12, 0.38, 0.25, 0.44,
];

const MOBILE_EMBELLISHMENTS = [
  {
    kind: "donut",
    position: [-1.35, 5.85, -2.4],
    rotation: [0.73, -0.31, 0.2],
    scale: 0.64,
    rise: 0.76,
  },
  {
    kind: "pill",
    position: [1.65, 4.1, -2.55],
    rotation: [0.54, 0.22, 0.66],
    scale: 0.62,
    rise: 0.72,
  },
  {
    kind: "pill",
    position: [0.05, 4.2, -2.2],
    rotation: [0.86, -0.18, 0.34],
    scale: 0.57,
    rise: 0.68,
  },
  {
    kind: "donut",
    position: [-1.9, -5.05, -2.35],
    rotation: [0.44, 0.59, -0.13],
    scale: 0.67,
    rise: 0.83,
  },
  {
    kind: "pill",
    position: [2.35, -4.35, -2.25],
    rotation: [0.46, -0.62, 0.12],
    scale: 0.68,
    rise: 0.79,
  },
  {
    kind: "donut",
    position: [0.2, -4.1, -2.5],
    rotation: [0.62, 0.43, -0.27],
    scale: 0.58,
    rise: 0.74,
  },
  {
    kind: "pill",
    position: [-2.85, 5.15, -2.35],
    rotation: [0.58, 0.14, 0.69],
    scale: 0.55,
    rise: 0.71,
  },
  {
    kind: "donut",
    position: [2.75, 5.45, -2.6],
    rotation: [0.74, -0.22, 0.11],
    scale: 0.52,
    rise: 0.75,
  },
  {
    kind: "pill",
    position: [-2.65, -5.25, -2.45],
    rotation: [0.4, 0.66, -0.19],
    scale: 0.61,
    rise: 0.82,
  },
  {
    kind: "donut",
    position: [2.9, -5.55, -2.3],
    rotation: [0.48, -0.57, 0.23],
    scale: 0.63,
    rise: 0.86,
  },
] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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

type NameExtrusionSceneProps = {
  progress: number;
};

export function NameExtrusionScene({ progress }: NameExtrusionSceneProps) {
  const layoutGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);
  const { viewport, size } = useThree();
  const isMobile = size.width < 768;
  const activeEmbellishments = isMobile
    ? MOBILE_EMBELLISHMENTS
    : DESKTOP_EMBELLISHMENTS;
  const activeStaggerDelays = isMobile
    ? MOBILE_EMBELLISHMENT_STAGGER_DELAYS
    : DESKTOP_EMBELLISHMENT_STAGGER_DELAYS;
  const embellishmentCount = Math.max(
    DESKTOP_EMBELLISHMENTS.length,
    MOBILE_EMBELLISHMENTS.length
  );

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
      Array.from(
        { length: embellishmentCount },
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
    [embellishmentCount]
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

    activeEmbellishments.forEach((item, index) => {
      const mesh = embellishmentRefs.current[index];
      if (!mesh) {
        return;
      }

      const delayed = clamp(
        (t - activeStaggerDelays[index]) / (1 - activeStaggerDelays[index]),
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
          {activeEmbellishments.map((item, index) => (
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
