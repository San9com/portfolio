"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
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
  const rotationTarget = useRef({ x: 0, y: 0 });
  const rotationCurrent = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragPointerId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      scrollTarget.current = window.scrollY * 0.0012;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    () => () => {
      if (typeof document !== "undefined") {
        document.body.style.cursor = "";
      }
    },
    []
  );

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;

    scrollCurrent.current = MathUtils.lerp(
      scrollCurrent.current,
      scrollTarget.current,
      0.14
    );

    if (!isDragging.current) {
      const pointerTargetX = -state.pointer.y * Math.PI * 0.15;
      const pointerTargetY = state.pointer.x * Math.PI * 0.2;
      rotationTarget.current.x = MathUtils.lerp(
        rotationTarget.current.x,
        pointerTargetX,
        0.08
      );
      rotationTarget.current.y = MathUtils.lerp(
        rotationTarget.current.y,
        pointerTargetY,
        0.08
      );
    }

    rotationCurrent.current.x = MathUtils.lerp(
      rotationCurrent.current.x,
      rotationTarget.current.x,
      0.16
    );
    rotationCurrent.current.y = MathUtils.lerp(
      rotationCurrent.current.y,
      rotationTarget.current.y,
      0.16
    );

    group.rotation.x = rotationCurrent.current.x + scrollCurrent.current * 0.22;
    group.rotation.y = rotationCurrent.current.y + scrollCurrent.current * 0.32;
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const group = ref.current;
    if (!group) return;

    dragPointerId.current = event.pointerId;
    isDragging.current = true;
    rotationTarget.current.x = rotationCurrent.current.x;
    rotationTarget.current.y = rotationCurrent.current.y;
    event.target.setPointerCapture?.(event.pointerId);

    if (typeof document !== "undefined") {
      document.body.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current || dragPointerId.current !== event.pointerId) return;
    event.stopPropagation();

    const movementX = event.nativeEvent.movementX ?? 0;
    const movementY = event.nativeEvent.movementY ?? 0;
    const ROTATION_SPEED = 0.0065;

    rotationTarget.current.y += movementX * ROTATION_SPEED;
    rotationTarget.current.x += movementY * ROTATION_SPEED;
    rotationTarget.current.x = MathUtils.clamp(
      rotationTarget.current.x,
      -Math.PI / 2,
      Math.PI / 2
    );
  };

  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    if (dragPointerId.current !== event.pointerId) return;
    event.stopPropagation();

    event.target.releasePointerCapture?.(event.pointerId);
    dragPointerId.current = null;
    isDragging.current = false;

    if (typeof document !== "undefined") {
      document.body.style.cursor = "";
    }
  };

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
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