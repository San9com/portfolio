"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Float, Html, Lightformer, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  CanvasTexture,
  SRGBColorSpace,
} from "three";
import { CUBE_SIZE, GlassCubeMesh } from "./glass-cube";

type HeroCanvasProps = {
  headlineLines: string[];
  description: string;
  portraitSrc: string;
  introScript?: string;
};

const TITLE_ASPECT = 1230.94 / 414.57;

function HeroScene({ headlineLines: _headlineLines, portraitSrc }: HeroCanvasProps) {
  const { viewport, size } = useThree();
  const isMobile = size.width <= 768;
  void _headlineLines;

  const basePortraitTexture = useTexture(portraitSrc, (texture) => {
    texture.anisotropy = 4; // a bit lower for perf
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
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
    if (isMobile) {
      const titleAspect = TITLE_ASPECT;
      const sideMargin = Math.max(0.4, viewport.width * 0.06);
      const availableWidth = Math.max(3, viewport.width - sideMargin * 2);
      const titleWidth = Math.min(availableWidth, viewport.width - sideMargin * 0.4);
      const titleHeight = titleWidth / titleAspect;
      const leftEdge = -viewport.width / 2 + sideMargin;
      const topBound = viewport.height / 2;
      const topPadding = Math.max(0.45, viewport.height * 0.08);
      const titleTop = topBound - topPadding;
      const titleCenterY = titleTop - titleHeight / 2 - titleHeight * 0.15;
      const titleCenterX = leftEdge + titleWidth / 2;
      const titleBottom = titleCenterY - titleHeight / 2;
      const cubeScale = Math.min(0.84, Math.max(0.64, viewport.width * 0.24));
      const cubeHeight = CUBE_SIZE * cubeScale;

      return {
        isMobile: true,
        cubePosition: [titleCenterX + titleWidth * 0.05, titleBottom - cubeHeight * 0.82, 0.15] as [
          number,
          number,
          number
        ],
        cubeScale,
        titlePosition: [titleCenterX, titleCenterY, -0.5] as [number, number, number],
        titlePlane: [titleWidth, titleHeight] as [number, number],
        titlePixels: [
          (titleWidth / viewport.width) * size.width,
          (titleHeight / viewport.height) * size.height,
        ] as [number, number],
      };
    }

    const margin = Math.max(0.8, viewport.width * 0.06);
    const leftX = -viewport.width / 2 + margin;
    const rightX = viewport.width / 2 - margin;

    const titleHeight = Math.min(2.4, Math.max(1.8, viewport.height * 0.24));
    const titleWidth = titleHeight * TITLE_ASPECT;
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
      titlePixels: [
        (titleWidth / viewport.width) * size.width,
        (titleHeight / viewport.height) * size.height,
      ] as [number, number],
    };
  }, [isMobile, size.height, size.width, viewport.height, viewport.width]);

  const [cx, cy, cz] = layout.cubePosition;
  const [titlePixelWidth, titlePixelHeight] = layout.titlePixels;

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
      <Html
        position={layout.titlePosition}
        transform={false}
        center
        style={{
          width: `${Math.max(titlePixelWidth, 240)}px`,
          height: `${Math.max(titlePixelHeight, 120)}px`,
          pointerEvents: "none",
        }}
        className="hero-title-html"
      >
        <div
          className="hero-title-animation"
          data-mobile={layout.isMobile ? "true" : "false"}
        >
          <div className="hero-title-animation__bg">
            <div className="hero-title-animation__inner">
              <svg
                className="hero-title-animation__svg"
                viewBox="0 0 1230.94 414.57"
                role="img"
                aria-label="Hello I'm Alexander"
              >
                <path
                  d="M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31"
                  transform="translate(311.08 476.02)"
                />
              </svg>
            </div>
          </div>
        </div>
      </Html>

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

      {!isMobile && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            mipmapBlur
            intensity={0.32}
            luminanceThreshold={0.48}
            luminanceSmoothing={0.68}
          />
        </EffectComposer>
      )}
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