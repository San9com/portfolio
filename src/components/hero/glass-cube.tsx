"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { Group, MathUtils } from "three";

const CUBE_SIZE = 2.6;

type GlassCubeMeshProps = {
  position?: [number, number, number];
  scale?: number;
};

export function GlassCubeMesh({ position = [0, 0, 0], scale = 1 }: GlassCubeMeshProps) {
  const ref = useRef<Group>(null);
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollTarget.current = window.scrollY * 0.0012;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;

    scrollCurrent.current = MathUtils.lerp(scrollCurrent.current, scrollTarget.current, 0.14);

    const pointerRotationX = MathUtils.lerp(group.rotation.x, -state.pointer.y * Math.PI * 0.15, 0.12);
    const pointerRotationY = MathUtils.lerp(group.rotation.y, state.pointer.x * Math.PI * 0.2, 0.12);

    group.rotation.x = pointerRotationX + scrollCurrent.current * 0.22;
    group.rotation.y = pointerRotationY + scrollCurrent.current * 0.32;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <RoundedBox args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE * 0.4]} radius={0.72} smoothness={16}>
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.02}
          thickness={0.35}
          ior={1.52}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          attenuationColor="#cde2ff"
          attenuationDistance={1.5}
          envMapIntensity={2.5}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </RoundedBox>
    </group>
  );
}

