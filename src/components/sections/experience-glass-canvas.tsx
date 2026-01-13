"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox, Environment } from "@react-three/drei";
import { ExtrudeGeometry, Group } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

export type ShapeType = "laptop" | "cap" | "star" | "logo";

interface GlassObjectProps {
  shapeType: ShapeType;
}

function ApperiumLogo({ material, s }: { material: React.ReactNode; s: number }) {
  const svg = useLoader(SVGLoader, "/Apperium-group-standalone-black.svg");

  // Build a single extruded mesh from the SVG paths (accurate logo).
  const geom = useMemo(() => {
    const shapes = svg.paths.flatMap((p) => SVGLoader.createShapes(p));
    const g = new ExtrudeGeometry(shapes, {
      depth: s * 0.08,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: s * 0.03,
      bevelSize: s * 0.03,
      bevelSegments: 4,
    });
    g.center();
    return g;
  }, [svg, s]);

  return (
    <mesh geometry={geom} rotation={[0, 0, 0]} scale={[s * 0.06, s * 0.06, 1]}>
      {material}
    </mesh>
  );
}

function GlassObject({ shapeType }: GlassObjectProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow continuous rotation
      groupRef.current.rotation.y += 0.006;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  // Optimized glass material with colorful reflections
  const glassMaterial = (
    <MeshTransmissionMaterial
      transmission={0.92}
      roughness={0.03}
      thickness={0.3}
      ior={1.5}
      chromaticAberration={0.2}
      distortion={0.03}
      distortionScale={0.15}
      temporalDistortion={0}
      samples={4}
      resolution={256}
      color="#ffffff"
      envMapIntensity={2}
      clearcoat={1}
      clearcoatRoughness={0.02}
      iridescence={0.8}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[100, 400]}
    />
  );

  const s = 1.8; // Base size - larger for visibility

  const renderShape = () => {
    switch (shapeType) {
      // MacBook - sleek laptop for Independent (iOS freelance work)
      case "laptop":
        return (
          <group rotation={[0.3, 0.2, 0]}>
            {/* Base - keyboard deck at bottom */}
            <RoundedBox args={[s * 1.0, s * 0.65, s * 0.025]} radius={s * 0.02} smoothness={2} position={[0, -s * 0.25, s * 0.15]}>
              {glassMaterial}
            </RoundedBox>
            {/* Screen - angled back from the hinge */}
            <group position={[0, s * 0.08, -s * 0.15]} rotation={[-0.5, 0, 0]}>
              <RoundedBox args={[s * 1.0, s * 0.7, s * 0.018]} radius={s * 0.02} smoothness={2}>
                {glassMaterial}
              </RoundedBox>
              {/* Display bezel */}
              <RoundedBox args={[s * 0.92, s * 0.6, s * 0.02]} radius={s * 0.01} smoothness={1} position={[0, 0, s * 0.006]}>
                {glassMaterial}
              </RoundedBox>
            </group>
          </group>
        );

      // Graduation cap - academic/student
      case "cap":
        return (
          <group rotation={[0.15, 0.1, 0]}>
            {/* Cap board (mortarboard) */}
            <RoundedBox args={[s * 0.9, s * 0.06, s * 0.9]} radius={s * 0.02} smoothness={1} rotation={[0, Math.PI / 4, 0]}>
              {glassMaterial}
            </RoundedBox>
            {/* Cap dome */}
            <mesh position={[0, -s * 0.12, 0]}>
              <sphereGeometry args={[s * 0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              {glassMaterial}
            </mesh>
            {/* Button on top */}
            <mesh position={[0, s * 0.05, 0]}>
              <cylinderGeometry args={[s * 0.06, s * 0.06, s * 0.04, 12]} />
              {glassMaterial}
            </mesh>
            {/* Tassel string */}
            <mesh position={[s * 0.35, -s * 0.05, 0]}>
              <sphereGeometry args={[s * 0.05, 12, 12]} />
              {glassMaterial}
            </mesh>
          </group>
        );

      // App icon - Stellar Lab (iOS app icon shape)
      case "star":
        return (
          <group rotation={[0.1, 0.1, 0]}>
            {/* App icon base - iOS squircle shape */}
            <RoundedBox args={[s * 0.85, s * 0.85, s * 0.12]} radius={s * 0.18} smoothness={4}>
              {glassMaterial}
            </RoundedBox>
            {/* Star/sparkle icon inside - representing astrology app */}
            <mesh position={[0, 0, s * 0.08]}>
              <octahedronGeometry args={[s * 0.22, 0]} />
              {glassMaterial}
            </mesh>
            {/* Orbital ring around star */}
            <mesh position={[0, 0, s * 0.08]} rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[s * 0.32, s * 0.03, 8, 24]} />
              {glassMaterial}
            </mesh>
            {/* Small stars/dots around */}
            <mesh position={[s * 0.25, s * 0.25, s * 0.1]}>
              <sphereGeometry args={[s * 0.05, 8, 8]} />
              {glassMaterial}
            </mesh>
            <mesh position={[-s * 0.28, s * 0.18, s * 0.1]}>
              <sphereGeometry args={[s * 0.04, 8, 8]} />
              {glassMaterial}
            </mesh>
            <mesh position={[s * 0.2, -s * 0.28, s * 0.1]}>
              <sphereGeometry args={[s * 0.045, 8, 8]} />
              {glassMaterial}
            </mesh>
          </group>
        );

      // Apperium - 2x2 grid with wave curves (like the actual logo)
      case "logo":
        return (
          <group rotation={[0.1, 0.1, 0]}>
            <ApperiumLogo material={glassMaterial} s={s} />
          </group>
        );

      default:
        return (
          <RoundedBox args={[s, s, s * 0.2]} radius={s * 0.15} smoothness={2}>
            {glassMaterial}
          </RoundedBox>
        );
    }
  };

  return (
    <group ref={groupRef} scale={1}>
      {renderShape()}
    </group>
  );
}

function GlassScene({ shapeType }: { shapeType: ShapeType }) {
  return (
    <>
      {/* Colored environment for beautiful reflections */}
      <Environment frames={1} resolution={128}>
        {/* Purple/Magenta */}
        <mesh position={[-5, 3, -5]}>
          <sphereGeometry args={[3, 8, 8]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
        {/* Cyan */}
        <mesh position={[5, -2, -5]}>
          <sphereGeometry args={[3, 8, 8]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        {/* Orange */}
        <mesh position={[0, 5, -5]}>
          <sphereGeometry args={[3, 8, 8]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
        {/* Pink */}
        <mesh position={[-4, -4, -5]}>
          <sphereGeometry args={[3, 8, 8]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
        {/* Blue */}
        <mesh position={[4, 2, -5]}>
          <sphereGeometry args={[3, 8, 8]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
      </Environment>

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      <GlassObject shapeType={shapeType} />
    </>
  );
}

interface ExperienceGlassItemProps {
  shapeType: ShapeType;
}

export function ExperienceGlassItem({ shapeType }: ExperienceGlassItemProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <GlassScene shapeType={shapeType} />
      </Canvas>
    </div>
  );
}
