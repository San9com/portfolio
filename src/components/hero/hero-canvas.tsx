"use client";

import { Suspense, useMemo, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import { SRGBColorSpace, MathUtils } from "three";
import { GlassLens } from "./glass-lens";

// Title sequence data
const TITLE_SEQUENCE = [
  { text: "hello", isScript: true, glassShape: "greeting" },
  { text: "great design", isScript: false, glassShape: "design" },
  { text: "is done with care", isScript: false, glassShape: "care" },
  { text: "care for the user", isScript: false, glassShape: "user" },
  // Keep the last stage lens as a person silhouette (more fitting than a frame)
  { text: "That's what I do", isScript: false, glassShape: "user", showPortrait: true },
] as const;

type HeroCanvasProps = {
  headlineLines: string[];
  description: string;
  portraitSrc: string;
  introScript?: string;
  scrollProgress?: number;
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function getStageFloat(scrollProgress: number, count: number) {
  // Shared mapping for BOTH: titles and lens shapes.
  // Adds lead-in/out padding so the sequence breathes and is easy to tune.
  return MathUtils.clamp(scrollProgress * (count + 0.6) - 0.3, 0, count - 0.001);
}

function HeroScene({ 
  scrollProgress = 0,
  portraitSrc,
  currentGlassShape,
}: { 
  scrollProgress: number;
  portraitSrc: string;
  currentGlassShape: string;
}) {
  const { viewport } = useThree();
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth;
    return 1920;
  });
  const [navHoverShape, setNavHoverShape] = useState<string | null>(null);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Listen for nav hover events
  useEffect(() => {
    const handleNavHover = (event: CustomEvent<string | null>) => {
      setNavHoverShape(event.detail);
    };
    window.addEventListener("nav-hover" as any, handleNavHover);
    return () => window.removeEventListener("nav-hover" as any, handleNavHover);
  }, []);

  // Load background texture
  const backgroundTexture = useTexture("/bgd-test-2.png", (texture) => {
    texture.colorSpace = SRGBColorSpace;
  });

  // Load assets used as planes (so we can reliably apply stencil masking)
  const helloTexture = useTexture("/hello.svg");
  const portraitTexture = useTexture(portraitSrc);
  useEffect(() => {
    helloTexture.colorSpace = SRGBColorSpace;
  }, [helloTexture]);
  useEffect(() => {
    portraitTexture.colorSpace = SRGBColorSpace;
  }, [portraitTexture]);

  const isMobile = windowWidth < 768;

  const portraitScale = useMemo(() => {
    // Keep the portrait proportional (no stretching) and sized like a hero “reveal”.
    const img = portraitTexture.image as unknown as { width?: number; height?: number } | undefined;
    const aspect = img?.width && img?.height ? img.width / img.height : 0.75;

    // Target height; clamp width so it never feels too huge on ultrawide screens.
    let h = viewport.height * 0.6;
    let w = h * aspect;
    const maxW = viewport.width * 0.55;
    if (w > maxW) {
      w = maxW;
      h = w / aspect;
    }
    return [w, h, 1] as [number, number, number];
  }, [portraitTexture, viewport.height, viewport.width]);

  // Background plane size
  const bgSize = useMemo(() => {
    const scale = 2;
    return [viewport.width * scale, viewport.height * scale] as [number, number];
  }, [viewport.width, viewport.height]);

  // Determine glass shape - nav hover takes priority
  const activeGlassShape = navHoverShape || currentGlassShape;

  // Stage is derived directly from scrollProgress (no timers/state)
  // Add a bit of "lead in / lead out" so stage changes don't feel rushed.
  const stageFloat = getStageFloat(scrollProgress, TITLE_SEQUENCE.length);
  const showPortrait = scrollProgress > 0.92;

  // Scale title size responsively with viewport
  const titleFontSize = MathUtils.clamp(viewport.width * 0.12, 0.55, 1.0);
  const titleY = MathUtils.clamp(viewport.height * 0.02, 0.05, 0.2);
  const textZ = -1.6; // keep far enough behind the lens to avoid depth artifacts

  return (
    <>
      {/* Background image plane */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={bgSize} />
        <meshBasicMaterial map={backgroundTexture} toneMapped={false} />
      </mesh>

      {/* Glass lens: render mask early, glass late via renderOrder (so it refracts titles) */}
      <GlassLens
        position={[0, 0, 0.3]}
        speed={0.15}
        startOffset={0}
        radius={0.84}
        scale={2.1}
        travelWidth={viewport.width * 0.8}
        isMobile={isMobile}
        forcedShape={activeGlassShape}
        scrollProgress={scrollProgress}
      />

      {/* Titles as real WebGL text, behind the lens so it refracts them */}
      {!showPortrait && (
        <group position={[0, titleY, textZ]}>
          {TITLE_SEQUENCE.map((t, i) => {
            // Cross-fade between stages. Keep it tight so transitions feel intentional.
            const d = Math.abs(stageFloat - i);
            const fade = 1 - smoothstep(0.12, 0.52, d);
            const opacity = clamp01(fade);
            const visible = opacity > 0.001;

            const yOffset = MathUtils.clamp((stageFloat - i) * 0.22, -0.35, 0.35);
            const scale = 0.98 + opacity * 0.04;
            // Tiny Z offset to avoid z-fighting during crossfades (hello -> text etc.)
            const zOffset = -i * 0.002;

            if (t.isScript) {
              // Use the SVG as a textured plane (refracts correctly since it's in WebGL)
              // hello.svg viewBox is 342x108 => aspectH = 108/342 ≈ 0.3158
              // Add a bit of padding so the strokes never feel “cut” at the edges.
              const helloW = MathUtils.clamp(viewport.width * 0.26, 2.6, 4.2);
              const helloH = helloW * 0.316;
              return (
                <mesh
                  key={`title-${i}`}
                  scale={[helloW * scale, helloH * scale, 1]}
                  position={[0, yOffset, zOffset]}
                  renderOrder={100 + i}
                  visible={visible}
                >
                  <planeGeometry args={[1, 1]} />
                  <meshBasicMaterial
                    map={helloTexture}
                    transparent
                    opacity={opacity}
                    depthWrite={false}
                  />
                </mesh>
              );
            }

            return (
              <Text
                key={`title-${i}`}
                font="/PPNeueMontreal-Book.woff"
                fontSize={titleFontSize}
                anchorX="center"
                anchorY="middle"
                color="#ffffff"
                fillOpacity={opacity}
                outlineWidth={0}
                position={[0, yOffset, zOffset]}
                maxWidth={viewport.width * 0.9}
                lineHeight={0.95}
                renderOrder={100 + i}
                visible={visible}
                material-transparent
                material-depthWrite={false}
                material-depthTest={true}
              >
                {t.text}
              </Text>
            );
          })}
        </group>
      )}

      {/* Portrait as WebGL image (also refracts) */}
      {showPortrait && (
        <group position={[0, 0, textZ]}>
          <mesh scale={portraitScale} position={[0, 0, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={portraitTexture}
              transparent
              opacity={clamp01((scrollProgress - 0.92) / 0.06)}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      <ambientLight intensity={1} />
    </>
  );
}

export function HeroCanvas(props: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGlassShape, setCurrentGlassShape] = useState("greeting");

  // Keep lens shape in sync with scroll-derived stage
  useEffect(() => {
    const sp = props.scrollProgress ?? 0;
    const stageFloat = getStageFloat(sp, TITLE_SEQUENCE.length);
    const idx = Math.min(Math.floor(stageFloat), TITLE_SEQUENCE.length - 1);
    const next = TITLE_SEQUENCE[idx]?.glassShape ?? "greeting";
    setCurrentGlassShape(next);
  }, [props.scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    return () => {
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full hero-no-cursor relative">
      <Canvas
        className="h-full w-full hero-no-cursor"
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
        }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <HeroScene 
            scrollProgress={props.scrollProgress || 0} 
            portraitSrc={props.portraitSrc}
            currentGlassShape={currentGlassShape}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
