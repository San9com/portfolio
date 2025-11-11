"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { Group, MathUtils, Texture } from "three";

export const CUBE_SIZE = 2.6;

type GlassCubeMeshProps = {
  position?: [number, number, number];
  scale?: number;
  portraitTexture?: Texture;
};

export function GlassCubeMesh({
  position = [0, 0, 0],
  scale = 1,
  portraitTexture,
}: GlassCubeMeshProps) {
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

    scrollCurrent.current = MathUtils.lerp(
      scrollCurrent.current,
      scrollTarget.current,
      0.14
    );

    const pointerRotationX = MathUtils.lerp(
      group.rotation.x,
      -state.pointer.y * Math.PI * 0.15,
      0.12
    );
    const pointerRotationY = MathUtils.lerp(
      group.rotation.y,
      state.pointer.x * Math.PI * 0.2,
      0.12
    );

    group.rotation.x = pointerRotationX + scrollCurrent.current * 0.22;
    group.rotation.y = pointerRotationY + scrollCurrent.current * 0.32;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Perfect sharp-edged cube */}
      <mesh>
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.015}
          thickness={0.4}
          ior={1.52}
          envMapIntensity={3.2}         // brighter reflections
          clearcoat={1}
          clearcoatRoughness={0.015}
          attenuationColor="#e7f1ff"    // subtle cool white tint
          attenuationDistance={2.2}
          anisotropy={0.12}

          // dispersion / subtle “rainbow” glints
          chromaticAberration={0.08}
          distortion={0.04}
          distortionScale={0.3}
          temporalDistortion={0.05}

          // iridescence layer
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[120, 420]}
        />
      </mesh>
      {portraitTexture ? (
        <mesh position={[0, 0, CUBE_SIZE / 2 - 0.04]}>
          <planeGeometry args={[CUBE_SIZE * 0.9, CUBE_SIZE * 0.9]} />
          <meshBasicMaterial
            map={portraitTexture}
            toneMapped={false}
            transparent
            polygonOffset
            polygonOffsetFactor={-0.5}
            polygonOffsetUnits={-0.5}
          />
        </mesh>
      ) : null}
    </group>
  );
}