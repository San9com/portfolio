"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SRGBColorSpace, CanvasTexture } from "three";
import { GlassCubeMesh } from "./glass-cube";
import { GlassLens } from "./glass-lens";

type HeroCanvasProps = {
  headlineLines: string[];
  description: string;
  portraitSrc: string;
  introScript?: string;
};

function HeroScene({ portraitSrc }: HeroCanvasProps) {
  const { viewport, size } = useThree();

  // Load SVG title texture
  const titleTexture = useTexture("/title.svg", (texture) => {
    texture.colorSpace = SRGBColorSpace;
  });

  // Load portrait texture (not grayscale, original)
  const basePortraitTexture = useTexture(portraitSrc, (texture) => {
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = true;
  });

  // Portrait texture for the main image - adjusted masking for larger size
  const portraitTexture = useMemo(() => {
    const texture = basePortraitTexture.clone();
    // Show more of the image - start from 30% down, show 60% of height
    texture.offset.set(0, 0.3); // Start from 30% down
    texture.repeat.set(1, 0.6); // Show 60% of height (more visible area)
    return texture;
  }, [basePortraitTexture]);

  // Grayscale portrait texture for glass cubes
  const portraitGrayscaleTexture = useMemo(() => {
    const sourceImage = basePortraitTexture.image as
      | HTMLImageElement
      | HTMLCanvasElement
      | undefined;

    if (
      !sourceImage ||
      !("width" in sourceImage) ||
      !("height" in sourceImage) ||
      sourceImage.width === 0
    ) {
      return basePortraitTexture;
    }

    const canvas = document.createElement("canvas");
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;

    const context = canvas.getContext("2d");
    if (!context) return basePortraitTexture;

    context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = r * 0.299 + g * 0.587 + b * 0.114;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    context.putImageData(imageData, 0, 0);

    const grayscaleTexture = new CanvasTexture(canvas);
    grayscaleTexture.anisotropy = basePortraitTexture.anisotropy;
    grayscaleTexture.colorSpace = basePortraitTexture.colorSpace;
    grayscaleTexture.flipY = true;
    grayscaleTexture.needsUpdate = true;

    return grayscaleTexture;
  }, [basePortraitTexture]);

  // Clean centered layout: Text and image side by side, centered, smaller
  const layout = useMemo(() => {
    const isMobile = size.width < 768; // Use actual pixel width
    const margin = viewport.width * 0.1; // Generous clean margins
    const gap = viewport.width * 0.04; // Clean gap between elements
    
    // Calculate sizes - make both smaller
    const svgAspect = 1072 / 427; // title.svg aspect ratio
    const portraitAspect = 1;
    
    if (isMobile) {
      // Mobile: Stack vertically, full width
      const svgWidth = viewport.width * 0.85;
      const svgHeight = svgWidth / svgAspect;
      
      const portraitWidth = viewport.width * 0.6;
      const portraitHeight = (portraitWidth / portraitAspect) * 0.6;
      
      // Center horizontally
      const svgX = 0;
      const portraitX = 0;
      
      // Stack vertically with gap
      const svgY = -viewport.height * 0.15;
      const portraitY = svgY + svgHeight / 2 + (viewport.height * 0.04) + portraitHeight / 2;
      
      return {
        svgPosition: [svgX, svgY, -0.2] as [number, number, number],
        svgSize: [svgWidth, svgHeight] as [number, number],
        portraitPosition: [portraitX, portraitY, -0.2] as [number, number, number],
        portraitSize: [portraitWidth, portraitHeight] as [number, number],
        glassPositions: [] as [number, number, number][],
      };
    }
    
    // Desktop: Side by side (original layout)
    const portraitWidth = viewport.width * 0.31;
    const portraitHeight = (portraitWidth / portraitAspect) * 0.6; // 60% height to match mask
    
    // Text: scaled to match image height, smaller
    const svgHeight = portraitHeight; // Match the image height
    const svgWidth = svgHeight * svgAspect; // Calculate width from height and aspect ratio
    
    // Center both elements horizontally
    const totalWidth = svgWidth + gap + portraitWidth;
    const svgX = -totalWidth / 2 + svgWidth / 2;
    const portraitX = svgX + svgWidth / 2 + gap + portraitWidth / 2;
    
    // Center vertically in viewport, then move 10% higher
    const centerY = viewport.height * 0.1; // 10% higher than center
    const svgY = centerY;
    const portraitY = centerY;

    // Glass elements positions removed for clean layout
    const glassPositions: [number, number, number][] = [];

    return {
      svgPosition: [svgX, svgY, -0.2] as [number, number, number],
      svgSize: [svgWidth, svgHeight] as [number, number],
      portraitPosition: [portraitX, portraitY, -0.2] as [number, number, number],
      portraitSize: [portraitWidth, portraitHeight] as [number, number],
      glassPositions,
    };
  }, [viewport.width, viewport.height, size.width]);

  return (
    <>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.4} />
      
      <spotLight
        position={[0, 10, 8]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow={false}
      />

      {/* SVG Title on the left */}
      <mesh position={layout.svgPosition}>
        <planeGeometry args={layout.svgSize} />
        <meshBasicMaterial map={titleTexture} toneMapped={false} transparent />
      </mesh>

      {/* Portrait on the right */}
      <mesh position={layout.portraitPosition}>
        <planeGeometry args={layout.portraitSize} />
        <meshBasicMaterial map={portraitTexture} toneMapped={false} transparent />
      </mesh>

      {/* Single magnifying glass lens following cursor over text */}
      <GlassLens
        position={[layout.svgPosition[0], layout.svgPosition[1], 0.3]}
        speed={0.15}
        startOffset={0}
        radius={0.84}
        scale={1.4}
        travelWidth={layout.svgSize[0]}
      />

      <Environment resolution={256}>
        <group>
          <Lightformer
            intensity={4}
            color="#ffffff"
            position={[10, 5, 8]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={[8, 8, 1]}
          />
          <Lightformer
            intensity={3}
            color="#ffffff"
            position={[-10, 5, 8]}
            rotation={[0, Math.PI / 3, 0]}
            scale={[8, 8, 1]}
          />
        </group>
      </Environment>

      <EffectComposer enableNormalPass={false}>
        <Bloom
          mipmapBlur
          intensity={0.2}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.7}
        />
      </EffectComposer>
    </>
  );
}

export function HeroCanvas(props: HeroCanvasProps) {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <HeroScene {...props} />
      </Suspense>
    </Canvas>
  );
}
