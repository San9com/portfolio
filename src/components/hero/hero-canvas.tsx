"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CanvasTexture, SRGBColorSpace } from "three";
import { CUBE_SIZE, GlassCubeMesh } from "./glass-cube";

type HeroCanvasProps = {
  headlineLines: string[];
  description: string;
  portraitSrc: string;
  introScript?: string;
};

function HeroScene({ headlineLines: _headlineLines, portraitSrc }: HeroCanvasProps) {
  const { viewport, size } = useThree();
  void _headlineLines;

  const basePortraitTexture = useTexture(portraitSrc, (texture) => {
    texture.anisotropy = 4; // a bit lower for perf
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
  });

  const titleTexture = useTexture("/hero-title-2.svg", (texture) => {
    texture.anisotropy = 2;
    texture.colorSpace = SRGBColorSpace;
  });

  const portraitTexture = useMemo(() => {
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
    grayscaleTexture.flipY = basePortraitTexture.flipY;
    grayscaleTexture.needsUpdate = true;

    return grayscaleTexture;
  }, [basePortraitTexture]);

  const layout = useMemo(() => {
    const isMobile = size.width <= 768;

    if (isMobile) {
      const titleAspect = 1398 / 295;
      const usableWidth = Math.max(4.2, viewport.width * 0.92);
      const titleWidth = Math.min(usableWidth, viewport.width * 1.05);
      const titleHeight = titleWidth / titleAspect;
      const titleCenterY = Math.min(0.1, viewport.height * 0.04);
      const titleBottom = titleCenterY - titleHeight / 2;
      const cubeScale = Math.min(0.92, Math.max(0.7, viewport.width * 0.28));
      const cubeHeight = CUBE_SIZE * cubeScale;

      return {
        isMobile,
        cubePosition: [0, titleBottom - cubeHeight * 0.18, 0.15] as [
          number,
          number,
          number
        ],
        cubeScale,
        titlePosition: [0, titleCenterY, -0.5] as [number, number, number],
        titlePlane: [titleWidth, titleHeight] as [number, number],
      };
    }

    const margin = Math.max(0.8, viewport.width * 0.06);
    const leftX = -viewport.width / 2 + margin;
    const rightX = viewport.width / 2 - margin;

    const titleHeight = Math.min(2.4, Math.max(1.8, viewport.height * 0.24));
    const titleWidth = titleHeight * (1398 / 295);
    const titleX = (leftX + rightX - titleWidth) / 2;
    const titleY = Math.min(1.2, viewport.height * 0.28);

    const cubeScale = Math.min(1.08, Math.max(0.88, viewport.width * 0.065));
    const cubeHeight = CUBE_SIZE * cubeScale;
    const titleBottom = titleY - titleHeight / 2;
    const cubeY = titleBottom - cubeHeight * 0.2;

    return {
      isMobile: false,
      cubePosition: [titleX + titleWidth / 2, cubeY, 0.22] as [number, number, number],
      cubeScale,
      titlePosition: [titleX + titleWidth / 2, titleY, -0.4] as [
        number,
        number,
        number
      ],
      titlePlane: [titleWidth, titleHeight] as [number, number],
    };
  }, [size.width, viewport.width, viewport.height]);

  const [cx, cy, cz] = layout.cubePosition;

  return (
    <>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.45} />
      <spotLight
        position={[8, 12, 12]}
        angle={0.7}
        penumbra={0.6}
        intensity={2.0}
        color="#ffd7a8"
      />
      <spotLight
        position={[-10, 9, 8]}
        angle={0.9}
        penumbra={0.55}
        intensity={1.4}
        color="#8db6ff"
      />
      <spotLight
        position={[0, -8, 5]}
        angle={1.1}
        penumbra={0.3}
        intensity={0.8}
        color="#ffffff"
      />

      {/* ✅ Only ONE cube now */}
      <mesh position={layout.titlePosition}>
        <planeGeometry args={layout.titlePlane} />
        <meshBasicMaterial map={titleTexture} toneMapped={false} transparent />
      </mesh>

      <Float floatIntensity={0.55} rotationIntensity={0.32} speed={1.1}>
        <GlassCubeMesh
          position={[cx, cy, cz]}
          scale={layout.cubeScale}
          portraitTexture={portraitTexture}
        />
      </Float>

      <Environment resolution={256}>
        <group>
          <Lightformer
            intensity={6.5}
            color="#fbe5c0"
            position={[10, 2, 8] as const}
            rotation={[0, -Math.PI / 2.8, 0] as const}
            scale={[8, 10, 1] as const}
          />
          <Lightformer
            intensity={5}
            color="#8fb4ff"
            position={[-12, 4, 6] as const}
            rotation={[0, Math.PI / 3, 0] as const}
            scale={[10, 12, 1] as const}
          />
          <Lightformer
            form="ring"
            intensity={3.5}
            color="#ffffff"
            position={[0, 6, 10] as const}
            scale={6}
          />
        </group>
      </Environment>

      <EffectComposer enableNormalPass={false}>
        <Bloom
          mipmapBlur
          intensity={0.5}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.75}
        />
        {/* Noise removed for a bit more perf and less flicker */}
      </EffectComposer>
    </>
  );
}

export function HeroCanvas(props: HeroCanvasProps) {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0.8, 11.6], fov: 34 }}
      dpr={[1, 1.4]} // a bit lower max DPR
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <HeroScene {...props} />
      </Suspense>
    </Canvas>
  );
}