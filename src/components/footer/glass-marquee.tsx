"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { Group } from "three";

// Simple shapes only
type ShapeType = "sphere" | "cube" | "disc";

const SHAPES: ShapeType[] = ["sphere", "cube", "disc"];

function GlassShape({ 
  shape, 
  index,
  totalCount,
  spacing,
}: { 
  shape: ShapeType; 
  index: number;
  totalCount: number;
  spacing: number;
}) {
  const ref = useRef<Group>(null);
  const { viewport } = useThree();
  const xPos = useRef(index * spacing - spacing * 2);
  const speed = 0.025; // Uniform speed for all

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Move left continuously - conveyor belt style
    xPos.current -= speed * delta * 60;
    
    // Reset position when off screen left - loop seamlessly
    const totalWidth = totalCount * spacing;
    if (xPos.current < -viewport.width / 2 - spacing) {
      xPos.current += totalWidth;
    }
    
    ref.current.position.x = xPos.current;
    
    // Gentle continuous rotation
    ref.current.rotation.y += delta * 0.3;
  });

  const s = 0.6; // Uniform size for all shapes

  const glassMaterial = (
    <MeshTransmissionMaterial
      backside
      samples={4}
      resolution={128}
      transmission={0.98}
      roughness={0.05}
      thickness={0.3}
      ior={1.4}
      chromaticAberration={0.2}
      distortion={0.1}
      distortionScale={0.2}
      temporalDistortion={0}
      color="#ffffff"
    />
  );

  const renderShape = () => {
    switch (shape) {
      case "sphere":
        return (
          <mesh>
            <sphereGeometry args={[s * 0.5, 24, 24]} />
            {glassMaterial}
          </mesh>
        );
      case "cube":
        return (
          <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
            <boxGeometry args={[s * 0.7, s * 0.7, s * 0.7]} />
            {glassMaterial}
          </mesh>
        );
      case "disc":
        return (
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[s * 0.5, s * 0.5, s * 0.12, 24]} />
            {glassMaterial}
          </mesh>
        );
      default:
        return (
          <mesh>
            <sphereGeometry args={[s * 0.5, 24, 24]} />
            {glassMaterial}
          </mesh>
        );
    }
  };

  return (
    <group ref={ref} position={[xPos.current, 0, 0]}>
      {renderShape()}
    </group>
  );
}

function GlassMarqueeScene() {
  const { viewport } = useThree();
  
  // Create evenly spaced glass objects - conveyor belt style
  const { objects, spacing } = useMemo(() => {
    const count = 10; // Number of objects
    const sp = 1.8; // Even spacing between objects
    const items: { shape: ShapeType; index: number }[] = [];
    
    for (let i = 0; i < count; i++) {
      items.push({
        shape: SHAPES[i % SHAPES.length],
        index: i,
      });
    }
    return { objects: items, spacing: sp };
  }, []);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Environment preset="city" />
      {objects.map((obj, i) => (
        <GlassShape
          key={i}
          shape={obj.shape}
          index={obj.index}
          totalCount={objects.length}
          spacing={spacing}
        />
      ))}
    </>
  );
}

export function GlassMarquee() {
  return (
    <div className="relative w-full" style={{ height: "200px" }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <GlassMarqueeScene />
      </Canvas>
    </div>
  );
}

