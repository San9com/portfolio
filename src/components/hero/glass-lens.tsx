"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { Group, MathUtils, Mesh } from "three";

type GlassLensProps = {
  position?: [number, number, number];
  speed?: number;
  startOffset?: number;
  radius?: number;
  travelWidth?: number;
  scale?: number;
  isMobile?: boolean;
};

// Shape types - includes nav-specific shapes
type ShapeType = 
  | "appIcon" | "button" | "card" | "toggle" | "badge" | "window"
  | "cv" | "work" | "experience" | "contact";

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
  const meshRef = useRef<Mesh>(null);
  const { size, viewport } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollCurrent = useRef(0);
  const scrollTarget = useRef(0);
  const mouseLerp = useRef({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<ShapeType>("appIcon");
  const [navHoverShape, setNavHoverShape] = useState<string | null>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });

  // Determine shape based on screen position - 6 zones
  const getShapeFromPosition = (x: number, y: number): ShapeType => {
    const normalizedX = x / (viewport.width / 2);
    const normalizedY = y / (viewport.height / 2);
    
    // Center zone: App Icon (iOS style rounded square)
    if (Math.abs(normalizedX) < 0.25 && Math.abs(normalizedY) < 0.25) {
      return "appIcon";
    }
    // Left: Button (pill)
    if (normalizedX < -0.3) {
      return "button";
    }
    // Right: Card
    if (normalizedX > 0.3) {
      return "card";
    }
    // Top: Window/Modal
    if (normalizedY > 0.2) {
      return "window";
    }
    // Bottom: Toggle switch
    if (normalizedY < -0.2) {
      return "toggle";
    }
    // Default fallback: Badge
    return "badge";
  };

  // Listen for nav hover events
  useEffect(() => {
    const handleNavHover = (event: CustomEvent<string | null>) => {
      setNavHoverShape(event.detail);
    };
    window.addEventListener("nav-hover" as any, handleNavHover);
    return () => window.removeEventListener("nav-hover" as any, handleNavHover);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const onScroll = () => {
        const scrollProgress = window.scrollY / (window.innerHeight * 2);
        scrollTarget.current = scrollProgress % 1;
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    } else {
      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
        mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
      };
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [size, isMobile]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    let currentX = 0;
    let currentY = 0;

    // Calculate safe bounds to keep glass visible
    const glassSize = radius * scale * 1.5;
    const maxX = viewport.width / 2 - glassSize;
    const maxY = viewport.height / 2 - glassSize;

    if (isMobile) {
      scrollCurrent.current = MathUtils.lerp(scrollCurrent.current, scrollTarget.current, 0.08);
      const fullTravelWidth = viewport.width * 1.8;
      const progress = scrollCurrent.current % 1;
      currentX = -viewport.width / 2 + progress * fullTravelWidth;
      currentY = position[1];
      // Clamp to visible area
      currentX = MathUtils.clamp(currentX, -maxX, maxX);
      ref.current.position.set(currentX, currentY, position[2]);
    } else {
      // When hovering over nav, position glass in center-right of visible area
      if (navHoverShape) {
        const targetX = Math.min(viewport.width * 0.25, maxX); // Right side, but clamped
        const targetY = -viewport.height * 0.1;
        mouseLerp.current.x = MathUtils.lerp(mouseLerp.current.x, targetX, 0.06);
        mouseLerp.current.y = MathUtils.lerp(mouseLerp.current.y, targetY, 0.06);
      } else {
        const targetX = MathUtils.clamp(mouseRef.current.x * viewport.width / 2, -maxX, maxX);
        const targetY = MathUtils.clamp(mouseRef.current.y * viewport.height / 2, -maxY, maxY);
        mouseLerp.current.x = MathUtils.lerp(mouseLerp.current.x, targetX, 0.08);
        mouseLerp.current.y = MathUtils.lerp(mouseLerp.current.y, targetY, 0.08);
      }
      currentX = mouseLerp.current.x;
      currentY = mouseLerp.current.y;
      ref.current.position.set(currentX, currentY, position[2]);
    }

    // Determine shape: nav hover takes priority, otherwise use position
    const newShape: ShapeType = navHoverShape 
      ? (navHoverShape as ShapeType) 
      : getShapeFromPosition(currentX, currentY);
    
    if (newShape !== currentShape) {
      setCurrentShape(newShape);
      
      // Set target rotation based on shape
      switch (newShape) {
        case "appIcon":
          targetRotation.current = { x: 0.1, y: 0.1, z: 0 };
          break;
        case "button":
          targetRotation.current = { x: 0, y: 0, z: 0 };
          break;
        case "card":
          targetRotation.current = { x: 0.05, y: -0.15, z: 0 };
          break;
        case "window":
          targetRotation.current = { x: 0.1, y: 0, z: 0 };
          break;
        case "toggle":
          targetRotation.current = { x: 0, y: 0, z: 0 };
          break;
        case "badge":
          targetRotation.current = { x: 0, y: 0, z: 0 };
          break;
        // Nav-specific shapes with Apple-style rotations
        case "cv":
          targetRotation.current = { x: 0.15, y: -0.1, z: 0.02 }; // Document tilt
          break;
        case "work":
          targetRotation.current = { x: 0.1, y: 0.1, z: 0 }; // Grid presentation
          break;
        case "experience":
          targetRotation.current = { x: 0.2, y: 0, z: 0 }; // Stacked layers perspective
          break;
        case "contact":
          targetRotation.current = { x: 0.05, y: 0.15, z: -0.05 }; // Message bubble tilt
          break;
      }
    }

    // Smoothly interpolate rotation
    rotationRef.current.x = MathUtils.lerp(rotationRef.current.x, targetRotation.current.x, 0.05);
    rotationRef.current.y = MathUtils.lerp(rotationRef.current.y, targetRotation.current.y, 0.05);
    rotationRef.current.z = MathUtils.lerp(rotationRef.current.z, targetRotation.current.z, 0.05);

    // Add gentle continuous rotation
    if (meshRef.current) {
      meshRef.current.rotation.x = rotationRef.current.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      meshRef.current.rotation.y = rotationRef.current.y + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = rotationRef.current.z;
    }
  });

  // Optimized glass material - reduced samples and resolution for performance
  const glassMaterial = (
    <MeshTransmissionMaterial
      transmission={0.97}
      roughness={0.03}
      thickness={0.3}
      ior={1.4}
      chromaticAberration={0.3}
      distortion={0.01}
      distortionScale={0.05}
      temporalDistortion={0}
      samples={4}
      resolution={256}
      backside={false}
    />
  );

  const renderShape = () => {
    const s = radius * 1.8;
    
    switch (currentShape) {
      // App Icon: Simple rounded square (reduced smoothness)
      case "appIcon":
        return (
          <RoundedBox ref={meshRef} args={[s, s, s * 0.2]} radius={s * 0.22} smoothness={3}>
            {glassMaterial}
          </RoundedBox>
        );
      
      // Pill/Button shape (reduced segments)
      case "button":
        return (
          <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[s * 0.28, s * 0.7, 6, 12]} />
            {glassMaterial}
          </mesh>
        );
      
      // Circle/Disc (reduced segments)
      case "card":
        return (
          <mesh ref={meshRef}>
            <cylinderGeometry args={[s * 0.5, s * 0.5, s * 0.15, 16]} />
            {glassMaterial}
          </mesh>
        );
      
      // Sphere (reduced segments)
      case "window":
        return (
          <mesh ref={meshRef}>
            <sphereGeometry args={[s * 0.5, 16, 16]} />
            {glassMaterial}
          </mesh>
        );
      
      // Cube (rhombus orientation)
      case "toggle":
        return (
          <mesh ref={meshRef} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <boxGeometry args={[s * 0.7, s * 0.7, s * 0.7]} />
            {glassMaterial}
          </mesh>
        );
      
      // Torus/Ring (reduced segments)
      case "badge":
        return (
          <mesh ref={meshRef}>
            <torusGeometry args={[s * 0.4, s * 0.15, 8, 16]} />
            {glassMaterial}
          </mesh>
        );
      
      // ======= NAV-SPECIFIC SHAPES =======
      
      // CV: Document with lines (like a resume)
      case "cv":
        return (
          <group ref={meshRef}>
            {/* Main document */}
            <RoundedBox args={[s * 0.85, s * 1.15, s * 0.08]} radius={s * 0.04} smoothness={2}>
              {glassMaterial}
            </RoundedBox>
            {/* Text lines */}
            <RoundedBox args={[s * 0.5, s * 0.06, s * 0.09]} radius={s * 0.02} smoothness={1} position={[0, s * 0.35, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 0.6, s * 0.05, s * 0.09]} radius={s * 0.02} smoothness={1} position={[0, s * 0.18, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 0.55, s * 0.05, s * 0.09]} radius={s * 0.02} smoothness={1} position={[0, s * 0.02, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 0.45, s * 0.05, s * 0.09]} radius={s * 0.02} smoothness={1} position={[0, -s * 0.14, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
          </group>
        );
      
      // WORK: Grid of 4 project thumbnails (portfolio)
      case "work":
        return (
          <group ref={meshRef}>
            {/* Grid container */}
            <RoundedBox args={[s * 1.2, s * 1.0, s * 0.06]} radius={s * 0.06} smoothness={2}>
              {glassMaterial}
            </RoundedBox>
            {/* 4 thumbnail squares */}
            <RoundedBox args={[s * 0.4, s * 0.32, s * 0.08]} radius={s * 0.03} smoothness={1} position={[-s * 0.28, s * 0.22, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 0.4, s * 0.32, s * 0.08]} radius={s * 0.03} smoothness={1} position={[s * 0.28, s * 0.22, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 0.4, s * 0.32, s * 0.08]} radius={s * 0.03} smoothness={1} position={[-s * 0.28, -s * 0.22, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 0.4, s * 0.32, s * 0.08]} radius={s * 0.03} smoothness={1} position={[s * 0.28, -s * 0.22, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
          </group>
        );
      
      // EXPERIENCE: Timeline with stacked layers
      case "experience":
        return (
          <group ref={meshRef}>
            {/* Stacked experience cards (back to front) */}
            <RoundedBox args={[s * 1.0, s * 0.65, s * 0.05]} radius={s * 0.05} smoothness={2} position={[s * 0.08, -s * 0.12, -s * 0.12]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 1.0, s * 0.65, s * 0.05]} radius={s * 0.05} smoothness={2} position={[s * 0.04, -s * 0.06, -s * 0.04]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 1.0, s * 0.65, s * 0.05]} radius={s * 0.05} smoothness={2} position={[0, 0, s * 0.04]}>
              {glassMaterial}
            </RoundedBox>
            {/* Timeline dot */}
            <mesh position={[-s * 0.55, 0, s * 0.06]}>
              <sphereGeometry args={[s * 0.08, 12, 12]} />
              {glassMaterial}
            </mesh>
          </group>
        );
      
      // CONTACT: Message bubble
      case "contact":
        return (
          <group ref={meshRef}>
            {/* Main bubble body - rounded rectangle */}
            <RoundedBox args={[s * 1.1, s * 0.7, s * 0.15]} radius={s * 0.18} smoothness={3}>
              {glassMaterial}
            </RoundedBox>
            {/* Bubble tail/pointer */}
            <mesh position={[-s * 0.45, -s * 0.32, 0]} rotation={[0, 0, -0.3]}>
              <coneGeometry args={[s * 0.12, s * 0.22, 3]} />
              {glassMaterial}
            </mesh>
            {/* Text line indicators inside bubble */}
            <RoundedBox args={[s * 0.6, s * 0.06, s * 0.16]} radius={s * 0.02} smoothness={1} position={[0, s * 0.12, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
            <RoundedBox args={[s * 0.45, s * 0.06, s * 0.16]} radius={s * 0.02} smoothness={1} position={[-s * 0.08, -s * 0.05, s * 0.02]}>
              {glassMaterial}
            </RoundedBox>
          </group>
        );
      
      default:
        return (
          <RoundedBox ref={meshRef} args={[s, s, s * 0.25]} radius={s * 0.22} smoothness={3}>
            {glassMaterial}
          </RoundedBox>
        );
    }
  };

  return (
    <group ref={ref} position={position} scale={scale * 0.9}>
      {renderShape()}
    </group>
  );
}

