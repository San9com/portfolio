"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { Group, Vector3 } from "three";

type GlassLensProps = {
  position?: [number, number, number];
  speed?: number;
  startOffset?: number;
  radius?: number;
  travelWidth?: number;
  scale?: number;
  isMobile?: boolean;
};

export function GlassLens({
  position = [0, 0, 0],
  speed = 0.5,
  startOffset = 0,
  radius = 0.4,
  travelWidth = 8,
  scale = 1,
  isMobile = false,
}: GlassLensProps) {
  const ref = useRef<Group>(null);
  const lensRef = useRef<Group>(null);
  const { size, viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) {
      // On mobile, don't listen to mouse
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse coordinates to normalized device coordinates (-1 to +1)
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size, isMobile]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    if (isMobile) {
      // On mobile, continuously loop from left to right
      const time = state.clock.getElapsedTime();
      const slowSpeed = 0.15; // Movement speed
      // Calculate full travel width (from left edge to right edge of viewport)
      const fullTravelWidth = viewport.width;
      // Linear progression that loops (0 to 1, then wraps)
      const progress = (time * slowSpeed) % 1;
      // Position from left edge (-viewport.width/2) to right edge (+viewport.width/2)
      const x = -viewport.width / 2 + progress * fullTravelWidth;
      const y = position[1];
      const worldPosition = new Vector3(x, y, position[2]);
      ref.current.position.copy(worldPosition);
    } else {
      // Desktop: follow cursor
      const worldPosition = new Vector3(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2, position[2]);
      ref.current.position.copy(worldPosition);
    }
  });

  return (
    <group ref={ref} position={position} scale={scale * 0.9}>
      <group ref={lensRef}>
        {/* Uniform glass blob - perfectly circular sphere */}
        <mesh>
          <sphereGeometry args={[radius, 64, 64]} />
          <MeshTransmissionMaterial
            transmission={1}
            roughness={0.01}
            thickness={0.3}
            ior={1.5}
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.01}
            chromaticAberration={0.15}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[100, 400]}
          />
        </mesh>
      </group>
    </group>
  );
}

