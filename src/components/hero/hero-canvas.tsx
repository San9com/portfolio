"use client";

import { Suspense, useMemo, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";
import { GlassLens } from "./glass-lens";

type HeroCanvasProps = {
  headlineLines: string[];
  description: string;
  portraitSrc: string;
  introScript?: string;
};

function HeroScene({ portraitSrc }: HeroCanvasProps) {
  const { viewport } = useThree();
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth;
    return 1920; // Default to desktop
  });

  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Load background texture
  const backgroundTexture = useTexture("/bgd-test-2.png", (texture) => {
    texture.colorSpace = SRGBColorSpace;
  });

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


  // Detect mobile vs desktop using actual window width
  const isMobile = windowWidth < 768;

  // Clean centered layout: Text and image side by side, centered, smaller (DESKTOP)
  // Mobile: Image on top of text, both screen wide
  const layout = useMemo(() => {
    const svgAspect = 1072 / 427; // title.svg aspect ratio
    const portraitAspect = 1;

    if (isMobile) {
      // MOBILE LAYOUT: Similar to desktop - side by side, scaled to fit
      const margin = viewport.width * 0.06; // Smaller margins for mobile
      const gap = viewport.width * 0.03; // Smaller gap
      
      // Portrait: smaller but still prominent
      const portraitWidth = viewport.width * 0.38;
      const portraitHeight = (portraitWidth / portraitAspect) * 0.6;
      
      // Text: scaled to match image height
      const svgHeight = portraitHeight;
      const svgWidth = svgHeight * svgAspect;
      
      // Center both elements horizontally
      const totalWidth = svgWidth + gap + portraitWidth;
      const svgX = -totalWidth / 2 + svgWidth / 2;
      const portraitX = svgX + svgWidth / 2 + gap + portraitWidth / 2;
      
      // Center vertically - slightly lower for mobile
      const centerY = -viewport.height * 0.05;

      return {
        svgPosition: [svgX, centerY, -0.2] as [number, number, number],
        svgSize: [svgWidth, svgHeight] as [number, number],
        portraitPosition: [portraitX, centerY, -0.2] as [number, number, number],
        portraitSize: [portraitWidth, portraitHeight] as [number, number],
        glassPositions: [] as [number, number, number][],
      };
    }

    // DESKTOP LAYOUT: Keep exactly the same as before
    const margin = viewport.width * 0.1; // Generous clean margins
    const gap = viewport.width * 0.04; // Clean gap between elements
    
    // Calculate sizes - make both smaller
    // Portrait: smaller size
    const portraitWidth = viewport.width * 0.31;
    const portraitHeight = (portraitWidth / portraitAspect) * 0.6; // 60% height to match mask
    
    // Text: scaled to match image height, smaller
    const svgHeight = portraitHeight; // Match the image height
    const svgWidth = svgHeight * svgAspect; // Calculate width from height and aspect ratio
    
    // Center both elements horizontally
    const totalWidth = svgWidth + gap + portraitWidth;
    const svgX = -totalWidth / 2 + svgWidth / 2;
    const portraitX = svgX + svgWidth / 2 + gap + portraitWidth / 2;
    
    // Center vertically in viewport
    const centerY = 0;
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
  }, [viewport.width, viewport.height, windowWidth]);

  // Background plane size - cover entire viewport with extra margin
  const bgSize = useMemo(() => {
    const scale = 2;
    return [viewport.width * scale, viewport.height * scale] as [number, number];
  }, [viewport.width, viewport.height]);

  return (
    <>
      {/* Background image plane - behind everything */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={bgSize} />
        <meshBasicMaterial map={backgroundTexture} toneMapped={false} />
      </mesh>

      <ambientLight intensity={1} />

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

      {/* Glass lens following cursor */}
      <GlassLens
        position={[layout.svgPosition[0], layout.svgPosition[1], 0.3]}
        speed={0.15}
        startOffset={0}
        radius={0.84}
        scale={2.1}
        travelWidth={layout.svgSize[0]}
        isMobile={isMobile}
      />
    </>
  );
}

export function HeroCanvas(props: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hideCursor = () => {
      const canvas = container.querySelector("canvas");
        if (canvas) {
          canvas.style.cursor = "none";
      }
    };

    // Hide cursor immediately
    hideCursor();

    // Only hide cursor when mouse is inside the hero container
    const handleMouseEnter = () => {
      hideCursor();
      document.body.style.cursor = "none";
      document.documentElement.style.cursor = "none";
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    // Use MutationObserver to catch canvas when it's added
    const observer = new MutationObserver(hideCursor);
    observer.observe(container, {
        childList: true,
        subtree: true,
      });

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      // Restore cursor on cleanup
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full hero-no-cursor" >
      <Canvas
        className="h-full w-full hero-no-cursor"
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.2]}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          precision: "lowp",
        }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <HeroScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
