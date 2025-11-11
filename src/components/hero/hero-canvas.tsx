"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, Text, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { CanvasTexture, SRGBColorSpace } from "three";
import { GlassCubeMesh } from "./glass-cube";

type HeroCanvasProps = {
  headlineLines: string[];
  description: string;
  portraitSrc: string;
  introScript?: string;
};

function HeroScene({ headlineLines, portraitSrc }: HeroCanvasProps) {
  const { viewport, size } = useThree();
  const basePortraitTexture = useTexture(portraitSrc, (texture) => {
    texture.anisotropy = 8;
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
  });
  const helloTexture = useTexture("/hello.svg", (texture) => {
    texture.anisotropy = 4;
    texture.colorSpace = SRGBColorSpace;
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
    if (!context) {
      return basePortraitTexture;
    }

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

  const headline = useMemo(() => headlineLines.join("\n"), [headlineLines]);
  const layout = useMemo(() => {
    const isMobile = size.width <= 768;

    if (isMobile) {
      const helloWidth = 1.24;
      const helloHeight = helloWidth * 0.38;
      const textFontSize = 0.36;
      const textMaxWidth = 3.6;

      return {
        isMobile,
        cubePosition: [-0.05, -0.05, 0.32] as [number, number, number],
        cubeScale: 1.508,
        portraitPosition: [0, 1.5, -0.7] as [number, number, number],
        portraitPlane: [2.4, 2.7] as [number, number],
        textGroupPosition: [0, 0.15, -0.5] as [number, number, number],
        helloPlane: [helloWidth, helloHeight] as [number, number],
        helloMeshPosition: [0, 0.12, -0.02] as [number, number, number],
        textPosition: [0, -(helloHeight * 0.18), 0] as [number, number, number],
        textAnchorX: "center" as const,
        textFontSize,
        textLineHeight: 1.08,
        textMaxWidth,
        textAlign: "center" as const,
      };
    }

    const margin = Math.max(0.8, viewport.width * 0.06);
    const leftX = -viewport.width / 2 + margin;
    const rightX = viewport.width / 2 - margin;

    let portraitWidth = Math.min(3.6, Math.max(3, viewport.width * 0.27));
    let portraitHeight = portraitWidth * 1.05;
    const portraitY = 0.15;
    let portraitX = rightX - portraitWidth / 2;

    const helloWidth = Math.min(1.6, Math.max(1.2, viewport.width * 0.12));
    const helloHeight = helloWidth * 0.36;
    const helloGap = Math.max(0.3, viewport.width * 0.022);
    const gap = Math.max(0.4, viewport.width * 0.035);
    const textTop = Math.min(1.18, viewport.height * 0.32);
    const textStartX = leftX + helloWidth + helloGap;
    let textEnd = portraitX - portraitWidth / 2 - gap;
    let availableWidth = textEnd - textStartX;

    if (availableWidth < 4.2) {
      const reduction = 4.2 - availableWidth;
      const adjustedPortraitWidth = Math.max(2.6, portraitWidth - reduction);
      portraitWidth = adjustedPortraitWidth;
      portraitHeight = portraitWidth * 1.05;
      portraitX = rightX - portraitWidth / 2;
      textEnd = portraitX - portraitWidth / 2 - gap;
      availableWidth = textEnd - textStartX;
    }

    const textMaxWidth = Math.max(3.6, Math.min(availableWidth, 6));
    const textFontSize = viewport.width >= 11 ? 0.5 : viewport.width >= 9 ? 0.46 : 0.42;

    const cubeX = leftX + helloWidth + helloGap + textMaxWidth * 0.4;
    const cubeY = textTop - 0.2;

    return {
      isMobile: false,
      cubePosition: [cubeX, cubeY, 0.22] as [number, number, number],
      cubeScale: 1.456,
      portraitPosition: [portraitX, portraitY, -0.35] as [number, number, number],
      portraitPlane: [portraitWidth, portraitHeight] as [number, number],
      textGroupPosition: [leftX, textTop, -0.4] as [number, number, number],
      helloPlane: [helloWidth, helloHeight] as [number, number],
      helloMeshPosition: [helloWidth / 2, -helloHeight * 0.35, -0.02] as [number, number, number],
      textPosition: [helloWidth + helloGap, -0.06, 0] as [number, number, number],
      textAnchorX: "left" as const,
      textFontSize,
      textLineHeight: 1.05,
      textMaxWidth,
      textAlign: "left" as const,
    };
  }, [size.width, viewport.width, viewport.height]);

  return (
    <>
      <color attach="background" args={["#05060f"]} />

      <ambientLight intensity={0.45} />
      <spotLight position={[8, 12, 12]} angle={0.7} penumbra={0.6} intensity={2.2} color="#ffd7a8" castShadow shadow-bias={-0.0001} />
      <spotLight position={[-10, 9, 8]} angle={0.9} penumbra={0.55} intensity={1.6} color="#8db6ff" />
      <spotLight position={[0, -8, 5]} angle={1.1} penumbra={0.3} intensity={0.9} color="#ffffff" />

      <mesh position={[0, -0.6, -6]}>
        <planeGeometry args={[18, 12]} />
        <meshPhysicalMaterial color="#070911" roughness={0.45} metalness={0.1} />
      </mesh>

      <Float floatIntensity={0.45} rotationIntensity={0.24} speed={1.05}>
        <GlassCubeMesh position={layout.cubePosition} scale={layout.cubeScale} />
      </Float>

      <mesh position={layout.portraitPosition}>
        <planeGeometry args={layout.portraitPlane} />
        <meshBasicMaterial map={portraitTexture} toneMapped={false} />
      </mesh>

      <group position={layout.textGroupPosition}>
        <mesh position={layout.helloMeshPosition}>
          <planeGeometry args={layout.helloPlane} />
          <meshBasicMaterial map={helloTexture} transparent toneMapped={false} />
        </mesh>
        <Text
          position={layout.textPosition}
          fontSize={layout.textFontSize}
          lineHeight={layout.textLineHeight}
          color="#ffffff"
          fontWeight={300}
          anchorX={layout.textAnchorX}
          anchorY="top"
          maxWidth={layout.textMaxWidth}
          textAlign={layout.textAlign}
        >
          {headline}
        </Text>
      </group>

      <ContactShadows position={[0, -3.1, 0] as const} opacity={0.35} scale={18} blur={3} far={6} color="#030207" />

      <Environment resolution={512}>
        <group>
          <Lightformer
            intensity={7}
            color="#fbe5c0"
            position={[10, 2, 8] as const}
            rotation={[0, -Math.PI / 2.8, 0] as const}
            scale={[8, 10, 1] as const}
          />
          <Lightformer
            intensity={6}
            color="#8fb4ff"
            position={[-12, 4, 6] as const}
            rotation={[0, Math.PI / 3, 0] as const}
            scale={[10, 12, 1] as const}
          />
          <Lightformer form="ring" intensity={4} color="#ffffff" position={[0, 6, 10] as const} scale={6} />
        </group>
      </Environment>

      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.1} luminanceSmoothing={0.8} />
        <Noise premultiply opacity={0.05} />
        <Vignette eskil={false} offset={0.36} darkness={0.8} />
      </EffectComposer>
    </>
  );
}

export function HeroCanvas(props: HeroCanvasProps) {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0.8, 11.6], fov: 34 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <HeroScene {...props} />
      </Suspense>
    </Canvas>
  );
}

