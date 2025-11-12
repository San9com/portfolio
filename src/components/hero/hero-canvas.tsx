"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

const TITLE_ASPECT = 1230.94 / 414.57;
const TITLE_CANVAS_WIDTH = 2048;
const TITLE_CANVAS_HEIGHT = 768;
const TITLE_REFERENCE_WIDTH = 1230.94;
const TITLE_REFERENCE_HEIGHT = 414.57;
const TITLE_PATH_TRANSLATE_X = 311.08;
const TITLE_PATH_TRANSLATE_Y = 476.02;
const TITLE_STROKE_LENGTH = 5800;
const TITLE_CYCLE_DURATION = 18;

const TITLE_PATH_D = `M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31`;

type TitleTextureData = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  path: Path2D;
  texture: CanvasTexture;
};

function renderTitleTexture(data: TitleTextureData, elapsed: number) {
  const { canvas, context: ctx, path, texture } = data;
  const { width, height } = canvas;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#040507";
  ctx.fillRect(0, 0, width, height);

  const gradientA = ctx.createLinearGradient(width * -0.2, 0, width * 0.6, height);
  gradientA.addColorStop(0, "rgba(255, 159, 237, 0.58)");
  gradientA.addColorStop(0.7, "rgba(255, 159, 237, 0.0)");
  ctx.fillStyle = gradientA;
  ctx.fillRect(0, 0, width, height);

  const gradientB = ctx.createLinearGradient(width * 0.2, 0, width * 1.1, height * 0.8);
  gradientB.addColorStop(0, "rgba(118, 164, 255, 0.48)");
  gradientB.addColorStop(0.65, "rgba(118, 164, 255, 0.0)");
  ctx.fillStyle = gradientB;
  ctx.fillRect(0, 0, width, height);

  const gradientC = ctx.createLinearGradient(width * 0.1, height * -0.1, width, height * 0.9);
  gradientC.addColorStop(0, "rgba(255, 191, 138, 0.5)");
  gradientC.addColorStop(0.7, "rgba(255, 191, 138, 0.0)");
  ctx.fillStyle = gradientC;
  ctx.fillRect(0, 0, width, height);

  const cycle = TITLE_CYCLE_DURATION;
  const segment = ((elapsed % cycle) + cycle) % cycle;
  const progress = segment / cycle;

  let dashOffset = TITLE_STROKE_LENGTH;
  let opacity = 0;

  if (progress < 0.12) {
    const local = progress / 0.12;
    dashOffset = TITLE_STROKE_LENGTH;
    opacity = Math.min(1, local * 1.1);
  } else if (progress < 0.5) {
    const local = (progress - 0.12) / 0.38;
    dashOffset = TITLE_STROKE_LENGTH * (1 - local);
    opacity = 1;
  } else if (progress < 0.78) {
    dashOffset = 0;
    opacity = 1;
  } else {
    const local = (progress - 0.78) / 0.22;
    dashOffset = TITLE_STROKE_LENGTH * Math.min(1, local * 1.1);
    opacity = Math.max(0, 1 - local * 1.1);
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";

  const scale = (width * 0.78) / TITLE_REFERENCE_WIDTH;
  const scaledWidth = TITLE_REFERENCE_WIDTH * scale;
  const scaledHeight = TITLE_REFERENCE_HEIGHT * scale;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([TITLE_STROKE_LENGTH]);
  ctx.lineDashOffset = dashOffset;
  ctx.lineWidth = 48 * scale;

  const offsetX = (width - scaledWidth) / 2;
  const offsetY = (height - scaledHeight) / 2;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  ctx.translate(TITLE_PATH_TRANSLATE_X, TITLE_PATH_TRANSLATE_Y);

  ctx.stroke(path);
  ctx.restore();

  texture.needsUpdate = true;
}

function HeroScene({ headlineLines: _headlineLines, portraitSrc }: HeroCanvasProps) {
  const { viewport, size } = useThree();
  const isMobile = size.width <= 768;
  void _headlineLines;

  const basePortraitTexture = useTexture(portraitSrc, (texture) => {
    texture.anisotropy = 4;
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
  });

  const portraitTexture = useMemo(() => {
    const sourceImage = basePortraitTexture.image as HTMLImageElement | HTMLCanvasElement | undefined;

    if (!sourceImage || !("width" in sourceImage) || !("height" in sourceImage) || sourceImage.width === 0) {
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

  const [titleTextureData] = useState<TitleTextureData | null>(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return null;
    if (typeof Path2D === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = TITLE_CANVAS_WIDTH;
    canvas.height = TITLE_CANVAS_HEIGHT;

    const context = canvas.getContext("2d");
    if (!context) return null;

    const path = new Path2D(TITLE_PATH_D);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    texture.flipY = false;
    texture.needsUpdate = true;

    return { canvas, context, path, texture };
  });

  useEffect(() => {
    if (!titleTextureData) return;
    renderTitleTexture(titleTextureData, 0);
    return () => {
      titleTextureData.texture.dispose();
    };
  }, [titleTextureData]);

  useFrame(({ clock }) => {
    if (!titleTextureData) return;
    renderTitleTexture(titleTextureData, clock.getElapsedTime());
  });

  const layout = useMemo(() => {
    // We'll compute a shared anchorX and use it for BOTH cube and title
    if (isMobile) {
      const sideMargin = Math.max(0.36, viewport.width * 0.06);
      const cubeScale = Math.min(0.92, Math.max(0.68, viewport.width * 0.24));
      const cubeSize = CUBE_SIZE * cubeScale;
      const anchorX = -viewport.width / 2 + sideMargin + cubeSize * 0.55;

      const topBound = viewport.height / 2;
      const cubeTopOffset = Math.max(0.34, viewport.height * 0.12);
      const cubeCenterY = topBound - cubeTopOffset;
      const cubeZ = 0.28;

      const availableWidth = Math.max(3.4, viewport.width - sideMargin * 2);
      const titleWidth = Math.min(availableWidth, viewport.width - sideMargin * 0.6);
      const titleHeight = titleWidth / TITLE_ASPECT;

      const minTitleY =
        -viewport.height / 2 + Math.max(0.4, viewport.height * 0.08) + titleHeight / 2;

      const gap = Math.max(cubeSize * 0.08, titleHeight * 0.08);
      const desiredTitleCenterY = cubeCenterY - cubeSize / 2 - gap - titleHeight / 2;
      const titleCenterY = Math.max(minTitleY, desiredTitleCenterY);

      return {
        isMobile: true,
        cubePosition: [anchorX, cubeCenterY, cubeZ] as [number, number, number],
        cubeScale,
        titlePosition: [anchorX, titleCenterY, cubeZ - 0.02] as [
          number,
          number,
          number
        ],
        titlePlane: [titleWidth, titleHeight] as [number, number],
      };
    }

    // Desktop
    const cubeScale = Math.min(1.12, Math.max(0.84, viewport.width * 0.065));
    const cubeSize = CUBE_SIZE * cubeScale;

    const anchorX = 0; // centered
    const cubeCenterY = Math.min(viewport.height * 0.26, 1.32);
    const cubeZ = 0.24;

    const horizontalMargin = Math.max(0.8, viewport.width * 0.08);
    const maxTitleWidth = Math.max(4, viewport.width - horizontalMargin * 2);

    let titleHeight = Math.min(2.6, Math.max(1.6, viewport.height * 0.22));
    let titleWidth = titleHeight * TITLE_ASPECT;

    if (titleWidth > maxTitleWidth) {
      titleWidth = maxTitleWidth;
      titleHeight = titleWidth / TITLE_ASPECT;
    }

    const minTitleY =
      -viewport.height / 2 + Math.max(0.5, viewport.height * 0.12) + titleHeight / 2;

    const gap = Math.max(cubeSize * 0.1, titleHeight * 0.08);
    const desiredTitleCenterY = cubeCenterY - cubeSize / 2 - gap - titleHeight / 2;
    const titleCenterY = Math.max(minTitleY, desiredTitleCenterY);

    return {
      isMobile: false,
      cubePosition: [anchorX, cubeCenterY, cubeZ] as [number, number, number],
      cubeScale,
      titlePosition: [anchorX, titleCenterY, cubeZ - 0.02] as [
        number,
        number,
        number
      ],
      titlePlane: [titleWidth, titleHeight] as [number, number],
    };
  }, [isMobile, viewport.height, viewport.width]);

  const [cx, cy, cz] = layout.cubePosition;

  return (
    <>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.45} />
      <spotLight position={[8, 12, 12]} angle={0.7} penumbra={0.6} intensity={2.0} color="#ffd7a8" />
      <spotLight position={[-10, 9, 8]} angle={0.9} penumbra={0.55} intensity={1.4} color="#8db6ff" />
      <spotLight position={[0, -8, 5]} angle={1.1} penumbra={0.3} intensity={0.8} color="#ffffff" />

      {/* Title uses the same X (anchorX) and nearly same Z as the cube */}
      <group position={layout.titlePosition}>
        <mesh>
          <planeGeometry args={layout.titlePlane} />
          <meshBasicMaterial
            map={titleTextureData?.texture}
            color="#ffffff"
            opacity={titleTextureData ? 1 : 0}
            transparent
            toneMapped={false}
          />
        </mesh>
      </group>

      <Float floatIntensity={0.55} rotationIntensity={0.32} speed={1.1}>
        <GlassCubeMesh position={[cx, cy, cz]} scale={layout.cubeScale} portraitTexture={portraitTexture} />
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
          <Lightformer form="ring" intensity={3.5} color="#ffffff" position={[0, 6, 10] as const} scale={6} />
        </group>
      </Environment>

      {!isMobile && (
        <EffectComposer enableNormalPass={false}>
          <Bloom mipmapBlur intensity={0.32} luminanceThreshold={0.48} luminanceSmoothing={0.68} />
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
      dpr={[1, 1.4]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <HeroScene {...props} />
      </Suspense>
    </Canvas>
  );
}