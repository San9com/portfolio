"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { Group, Vector2, Vector3, Texture, ShaderMaterial, Mesh } from "three";

type GlassLensProps = {
  position?: [number, number, number];
  speed?: number;
  startOffset?: number;
  radius?: number;
  travelWidth?: number;
  scale?: number;
  titlePosition?: [number, number, number];
  titleSize?: [number, number];
  portraitTexture?: Texture;
  portraitPosition?: [number, number, number];
  portraitSize?: [number, number];
};

export function GlassLens({
  position = [0, 0, 0],
  speed = 0.5,
  startOffset = 0,
  radius = 0.4,
  travelWidth = 8,
  scale = 1,
  titlePosition = [0, 0, 0],
  titleSize = [1, 1],
  portraitTexture,
  portraitPosition = [0, 0, 0],
  portraitSize = [1, 1],
}: GlassLensProps) {
  const ref = useRef<Group>(null);
  const lensRef = useRef<Group>(null);
  const revealMeshRef = useRef<Mesh>(null);
  const shaderMaterialRef = useRef<ShaderMaterial>(null);
  const { camera, size, viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isOverTitle, setIsOverTitle] = useState(false);
  const lensWorldPos = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse coordinates to normalized device coordinates (-1 to +1)
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      setMouse({ x, y });

      // Check if mouse is over title area
      const titleLeft = titlePosition[0] - titleSize[0] / 2;
      const titleRight = titlePosition[0] + titleSize[0] / 2;
      const titleTop = titlePosition[1] + titleSize[1] / 2;
      const titleBottom = titlePosition[1] - titleSize[1] / 2;

      const worldX = x * viewport.width / 2;
      const worldY = y * viewport.height / 2;

      const overTitle = 
        worldX >= titleLeft && 
        worldX <= titleRight && 
        worldY >= titleBottom && 
        worldY <= titleTop;

      setIsOverTitle(overTitle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size, viewport, titlePosition, titleSize]);

  useFrame(() => {
    if (!ref.current) return;

    // Convert normalized mouse coordinates to world position
    const worldPosition = new Vector3(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2, position[2]);
    
    // Constrain to title area when over title
    if (isOverTitle) {
      const titleLeft = titlePosition[0] - titleSize[0] / 2;
      const titleRight = titlePosition[0] + titleSize[0] / 2;
      const titleTop = titlePosition[1] + titleSize[1] / 2;
      const titleBottom = titlePosition[1] - titleSize[1] / 2;

      worldPosition.x = Math.max(titleLeft, Math.min(titleRight, worldPosition.x));
      worldPosition.y = Math.max(titleBottom, Math.min(titleTop, worldPosition.y));
    }
    
    ref.current.position.copy(worldPosition);
    lensWorldPos.current.copy(worldPosition);

    // Update reveal mesh position to match lens (slightly in front)
    if (revealMeshRef.current) {
      revealMeshRef.current.position.set(worldPosition.x, worldPosition.y, position[2] + 0.1);
    }

    // Update shader uniform with current lens position
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.lensWorldPos.value.copy(worldPosition);
    }
  });

  return (
    <>
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

      {/* Reveal plane - shows portrait image through the lens */}
      {isOverTitle && portraitTexture && (
        <mesh ref={revealMeshRef} position={position}>
          <planeGeometry args={[radius * 2.2, radius * 2.2, 32, 32]} />
          <shaderMaterial
            ref={shaderMaterialRef}
            transparent
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform sampler2D portraitTexture;
              uniform vec3 lensWorldPos;
              uniform vec3 titleWorldPos;
              uniform vec2 titleWorldSize;
              uniform vec3 portraitWorldPos;
              uniform vec2 portraitWorldSize;
              uniform float magnification;
              varying vec2 vUv;
              
              void main() {
                vec2 center = vec2(0.5, 0.5);
                vec2 fromCenter = vUv - center;
                float dist = length(fromCenter);
                
                // Circular mask
                if (dist > 0.5) {
                  discard;
                }
                
                // Calculate relative position within title area (0-1 range)
                vec2 titleRelative = (lensWorldPos.xy - titleWorldPos.xy) / titleWorldSize;
                titleRelative = titleRelative + vec2(0.5, 0.5); // Center at 0.5
                
                // Map to portrait texture coordinates
                // Portrait uses offset (0, 0.3) and repeat (1, 0.6)
                // So visible area is from y=0.3 to y=0.9
                vec2 portraitBaseUV = vec2(0.5, 0.6); // Center of visible portrait area (0.3 + 0.6/2)
                
                // Apply magnification and offset based on lens position
                vec2 portraitUV = portraitBaseUV + (fromCenter / magnification) + (titleRelative - vec2(0.5, 0.5)) * 0.5;
                
                // Clamp to visible portrait area
                portraitUV.x = clamp(portraitUV.x, 0.0, 1.0);
                portraitUV.y = clamp(portraitUV.y, 0.3, 0.9);
                
                vec4 portraitColor = texture2D(portraitTexture, portraitUV);
                
                // Fade at edges for smooth blend
                float edgeFade = 1.0 - smoothstep(0.35, 0.5, dist);
                
                gl_FragColor = vec4(portraitColor.rgb, portraitColor.a * edgeFade * 0.98);
              }
            `}
            uniforms={{
              portraitTexture: { value: portraitTexture },
              lensWorldPos: { value: new Vector3(0, 0, 0) },
              titleWorldPos: { value: new Vector3(...titlePosition) },
              titleWorldSize: { value: new Vector2(...titleSize) },
              portraitWorldPos: { value: new Vector3(...portraitPosition) },
              portraitWorldSize: { value: new Vector2(...portraitSize) },
              magnification: { value: 2.2 },
            }}
          />
        </mesh>
      )}
    </>
  );
}

