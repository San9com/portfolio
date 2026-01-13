"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mask, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { Group, MathUtils, Shape, ExtrudeGeometry, Path } from "three";

type GlassLensProps = {
  position?: [number, number, number];
  speed?: number;
  startOffset?: number;
  radius?: number;
  travelWidth?: number;
  scale?: number;
  isMobile?: boolean;
  forcedShape?: string;
  scrollProgress?: number;
  maskId?: number;
};

// Shape types - includes message-specific shapes and nav shapes
type ShapeType = 
  | "appIcon" | "button" | "card" | "toggle" | "badge" | "window"
  | "cv" | "work" | "experience" | "contact"
  | "greeting" | "design" | "care" | "user" | "portrait";

export function GlassLens({
  position = [0, 0, 0],
  speed = 0.5,
  startOffset = 0,
  radius = 0.4,
  travelWidth = 8,
  scale = 1,
  isMobile = false,
  forcedShape,
  scrollProgress = 0,
  maskId,
}: GlassLensProps) {
  const ref = useRef<Group>(null);
  const meshRef = useRef<Group>(null);
  const { size, viewport } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollCurrent = useRef(0);
  const scrollTarget = useRef(0);
  const mouseLerp = useRef({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<ShapeType>("greeting");
  const [navHoverShape, setNavHoverShape] = useState<string | null>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const scaleRef = useRef(1);

  // Listen for nav hover events - this takes priority
  useEffect(() => {
    const handleNavHover = (event: CustomEvent<string | null>) => {
      setNavHoverShape(event.detail);
    };
    window.addEventListener("nav-hover" as any, handleNavHover);
    return () => window.removeEventListener("nav-hover" as any, handleNavHover);
  }, []);

  // Update shape based on forcedShape prop (when not hovering nav)
  useEffect(() => {
    if (forcedShape && !navHoverShape) {
      setCurrentShape(forcedShape as ShapeType);
    }
  }, [forcedShape, navHoverShape]);

  // Update shape when nav hover changes
  useEffect(() => {
    if (navHoverShape) {
      setCurrentShape(navHoverShape as ShapeType);
    } else if (forcedShape) {
      setCurrentShape(forcedShape as ShapeType);
    }
  }, [navHoverShape, forcedShape]);

  useEffect(() => {
    if (isMobile) {
      const onScroll = () => {
        const scrollY = window.scrollY / (window.innerHeight * 2);
        scrollTarget.current = scrollY % 1;
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

  useFrame((state) => {
    if (!ref.current) return;

    let currentX = 0;
    let currentY = 0;

    const glassSize = radius * scale * 1.5;
    const maxX = viewport.width / 2 - glassSize;
    const maxY = viewport.height / 2 - glassSize;

    if (isMobile) {
      scrollCurrent.current = MathUtils.lerp(scrollCurrent.current, scrollTarget.current, 0.08);
      const fullTravelWidth = viewport.width * 1.8;
      const progress = scrollCurrent.current % 1;
      currentX = -viewport.width / 2 + progress * fullTravelWidth;
      currentY = position[1];
      currentX = MathUtils.clamp(currentX, -maxX, maxX);
      ref.current.position.set(currentX, currentY, position[2]);
    } else {
      // When hovering over nav, position glass in center-right of visible area
      if (navHoverShape) {
        const targetX = Math.min(viewport.width * 0.25, maxX);
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

    // Set target rotation based on current shape
    switch (currentShape) {
      case "greeting":
        targetRotation.current = { x: 0.1, y: 0.1, z: 0 };
        break;
      case "design":
        targetRotation.current = { x: 0.15, y: -0.1, z: 0.05 };
        break;
      case "care":
        targetRotation.current = { x: 0.05, y: 0.15, z: -0.02 };
        break;
      case "user":
        targetRotation.current = { x: 0.1, y: 0, z: 0 };
        break;
      case "portrait":
        targetRotation.current = { x: 0.08, y: -0.05, z: 0 };
        break;
      case "cv":
        targetRotation.current = { x: 0.15, y: -0.1, z: 0.02 };
        break;
      case "work":
        targetRotation.current = { x: 0.1, y: 0.1, z: 0 };
        break;
      case "experience":
        targetRotation.current = { x: 0.2, y: 0, z: 0 };
        break;
      case "contact":
        targetRotation.current = { x: 0.05, y: 0.15, z: -0.05 };
        break;
      default:
        targetRotation.current = { x: 0.1, y: 0.1, z: 0 };
    }

    // Smoothly interpolate rotation
    rotationRef.current.x = MathUtils.lerp(rotationRef.current.x, targetRotation.current.x, 0.05);
    rotationRef.current.y = MathUtils.lerp(rotationRef.current.y, targetRotation.current.y, 0.05);
    rotationRef.current.z = MathUtils.lerp(rotationRef.current.z, targetRotation.current.z, 0.05);

    // Scale based on scroll progress - subtle breathing effect
    const breatheScale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    const scrollScale = 1 - scrollProgress * 0.15;
    scaleRef.current = MathUtils.lerp(scaleRef.current, breatheScale * scrollScale, 0.05);
    ref.current.scale.setScalar(scale * 0.9 * scaleRef.current);

    // Add gentle continuous rotation
    if (meshRef.current) {
      meshRef.current.rotation.x = rotationRef.current.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      meshRef.current.rotation.y = rotationRef.current.y + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = rotationRef.current.z;
    }
  });

  // Optimized glass material
  const glassMaterial = (
    <MeshTransmissionMaterial
      transmission={0.97}
      roughness={0.03}
      thickness={0.45}
      ior={1.55}
      chromaticAberration={0.18}
      distortion={0.02}
      distortionScale={0.12}
      temporalDistortion={0}
      samples={8}
      resolution={512}
      backside={false}
    />
  );

  // Mask should NOT render visible pixels, only write stencil.
  const maskMaterial = <meshBasicMaterial colorWrite={false} depthWrite={false} depthTest={false} />;

  // Single-mesh heart geometry (no overlapping parts => no transmission seams)
  const heartGeometry = useMemo(() => {
    const x = 0;
    const y = 0;
    const heart = new Shape();
    heart.moveTo(x + 0.25, y + 0.25);
    heart.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heart.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heart.bezierCurveTo(x - 0.3, y + 0.6, x - 0.05, y + 0.82, x + 0.25, y + 1.0);
    heart.bezierCurveTo(x + 0.55, y + 0.82, x + 0.8, y + 0.6, x + 0.8, y + 0.35);
    heart.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heart.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const geom = new ExtrudeGeometry(heart, {
      depth: 0.22,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 6,
    });
    geom.center();
    // IMPORTANT: meshRef rotation is animated every frame, so don't rely on <mesh rotation={...}>.
    // Bake the correct orientation into the geometry so the heart point faces DOWN.
    geom.rotateZ(Math.PI);
    return geom;
  }, []);

  // Single-mesh speech bubble geometry for greeting/hello
  const bubbleGeometry = useMemo(() => {
    // Build a rounded rectangle with a small tail (all one shape)
    const w = 1.6;
    const h = 1.05;
    const r = 0.38;
    const tailW = 0.32;
    const tailH = 0.22;

    const shape = new Shape();

    // Start top-left (after radius)
    shape.moveTo(-w / 2 + r, h / 2);
    shape.lineTo(w / 2 - r, h / 2);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2, h / 2 - r);
    shape.lineTo(w / 2, -h / 2 + r);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2 - r, -h / 2);

    // Bottom edge up to tail start (slightly left of center)
    const tailX = -w * 0.12;
    shape.lineTo(tailX + tailW * 0.5, -h / 2);
    // Tail (a little triangle-ish but rounded by bevel)
    shape.lineTo(tailX, -h / 2 - tailH);
    shape.lineTo(tailX - tailW * 0.5, -h / 2);

    // Continue bottom edge
    shape.lineTo(-w / 2 + r, -h / 2);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2, -h / 2 + r);
    shape.lineTo(-w / 2, h / 2 - r);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2 + r, h / 2);

    const geom = new ExtrudeGeometry(shape, {
      depth: 0.22,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
    });
    geom.center();
    return geom;
  }, []);

  function roundedRectShape(w: number, h: number, r: number) {
    const shape = new Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  }

  // NAV icons: single-mesh, clean silhouettes (no overlaps => no seams)
  const navCvGeometry = useMemo(() => {
    const w = 1.35;
    const h = 1.7;
    const r = 0.22;
    const shape = roundedRectShape(w, h, r);

    // Folded-corner cutout (top-right)
    const fold = new Path();
    const fx = w / 2;
    const fy = h / 2;
    fold.moveTo(fx - 0.52, fy);
    fold.lineTo(fx, fy);
    fold.lineTo(fx, fy - 0.52);
    fold.closePath();
    shape.holes.push(fold);

    const geom = new ExtrudeGeometry(shape, {
      depth: 0.22,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
    });
    geom.center();
    return geom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navWorkGeometry = useMemo(() => {
    // Grid icon: rounded square with a plus-shaped cutout
    const w = 1.55;
    const h = 1.55;
    const r = 0.28;
    const shape = roundedRectShape(w, h, r);

    const line = 0.16;
    // Vertical cut
    const v = new Path();
    v.moveTo(-line / 2, -h / 2);
    v.lineTo(line / 2, -h / 2);
    v.lineTo(line / 2, h / 2);
    v.lineTo(-line / 2, h / 2);
    v.closePath();
    // Horizontal cut
    const ho = new Path();
    ho.moveTo(-w / 2, -line / 2);
    ho.lineTo(w / 2, -line / 2);
    ho.lineTo(w / 2, line / 2);
    ho.lineTo(-w / 2, line / 2);
    ho.closePath();

    shape.holes.push(v, ho);

    const geom = new ExtrudeGeometry(shape, {
      depth: 0.22,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
    });
    geom.center();
    return geom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navExperienceGeometry = useMemo(() => {
    // Timeline: wide pill with a dot + line cutout
    const w = 1.9;
    const h = 1.15;
    const r = 0.42;
    const shape = roundedRectShape(w, h, r);

    // Dot cutout
    const dot = new Path();
    dot.absarc(-w * 0.28, 0, 0.18, 0, Math.PI * 2, false);
    shape.holes.push(dot);

    // Line cutout
    const lw = w * 0.72;
    const lh = 0.14;
    const line = new Path();
    line.moveTo(-lw / 2 + w * 0.12, -lh / 2);
    line.lineTo(lw / 2 + w * 0.12, -lh / 2);
    line.lineTo(lw / 2 + w * 0.12, lh / 2);
    line.lineTo(-lw / 2 + w * 0.12, lh / 2);
    line.closePath();
    shape.holes.push(line);

    const geom = new ExtrudeGeometry(shape, {
      depth: 0.22,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
    });
    geom.center();
    return geom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HERO user icon: head circle + rounded-shoulders body (like the reference icon)
  const userHeadGeometry = useMemo(() => {
    const head = new Shape();
    head.absarc(0, 0, 0.38, 0, Math.PI * 2, false);
    const g = new ExtrudeGeometry([head], {
      depth: 0.22,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
    });
    g.center();
    return g;
  }, []);

  const userBodyGeometry = useMemo(() => {
    // Flat-bottom + semicircle top (rounded shoulders)
    const bw = 1.75;
    const bh = 1.25;
    const bottomY = -0.9;
    const topY = bottomY + bh;
    const r = bw / 2;
    const arcCenterY = topY - r; // so the arc touches topY at its apex

    const body = new Shape();
    body.moveTo(-bw / 2, bottomY);
    body.lineTo(bw / 2, bottomY);
    body.lineTo(bw / 2, arcCenterY);
    body.absarc(0, arcCenterY, r, 0, Math.PI, true);
    body.closePath();

    const g = new ExtrudeGeometry([body], {
      depth: 0.22,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
    });
    g.center();
    return g;
  }, []);

  const renderShape = () => {
    const s = radius * 1.8;
    
    switch (currentShape) {
      // ======= MESSAGE-SPECIFIC SHAPES =======
      
      // Greeting: simple speech bubble (hello/communication)
      case "greeting":
        return (
          <group ref={meshRef} rotation={[0, 0, 0.02]}>
            {maskId ? (
              <Mask id={maskId}>
                <mesh geometry={bubbleGeometry} scale={[s * 0.8, s * 0.8, s * 0.55]} renderOrder={10}>
                  {maskMaterial}
                </mesh>
              </Mask>
            ) : null}
            <mesh geometry={bubbleGeometry} scale={[s * 0.8, s * 0.8, s * 0.55]}>
              {glassMaterial}
            </mesh>
          </group>
        );
      
      // Design: clean artboard slab
      case "design":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <RoundedBox
                  args={[s * 1.28, s * 0.98, s * 0.14]}
                  radius={s * 0.14}
                  smoothness={6}
                  renderOrder={10}
                >
                  {maskMaterial}
                </RoundedBox>
              </Mask>
            ) : null}
            <RoundedBox
              args={[s * 1.28, s * 0.98, s * 0.14]}
              radius={s * 0.14}
              smoothness={6}
            >
              {glassMaterial}
            </RoundedBox>
          </group>
        );
      
      // Care: proper single-mesh heart (extruded)
      case "care":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <mesh geometry={heartGeometry} scale={[s * 0.85, s * 0.85, s * 0.55]} renderOrder={10}>
                  {maskMaterial}
                </mesh>
              </Mask>
            ) : null}
            <mesh geometry={heartGeometry} scale={[s * 0.85, s * 0.85, s * 0.55]}>
              {glassMaterial}
            </mesh>
          </group>
        );
      
      // User: simple head + shoulders silhouette (single mesh, no overlaps)
      case "user":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <group renderOrder={10}>
                  <mesh geometry={userHeadGeometry} position={[0, s * 0.52, 0]} scale={[s * 0.62, s * 0.62, s * 0.62]}>
                    {maskMaterial}
                  </mesh>
                  <mesh geometry={userBodyGeometry} position={[0, -s * 0.08, 0]} scale={[s * 0.62, s * 0.62, s * 0.62]}>
                    {maskMaterial}
                  </mesh>
                </group>
              </Mask>
            ) : null}

            <mesh geometry={userHeadGeometry} position={[0, s * 0.52, 0]} scale={[s * 0.62, s * 0.62, s * 0.62]}>
              {glassMaterial}
            </mesh>
            <mesh geometry={userBodyGeometry} position={[0, -s * 0.08, 0]} scale={[s * 0.62, s * 0.62, s * 0.62]}>
              {glassMaterial}
            </mesh>
          </group>
        );
      
      // Portrait: Frame/window shape
      case "portrait":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <RoundedBox
                  args={[s * 1.06, s * 1.36, s * 0.14]}
                  radius={s * 0.16}
                  smoothness={6}
                  renderOrder={10}
                >
                  {maskMaterial}
                </RoundedBox>
              </Mask>
            ) : null}
            <RoundedBox
              args={[s * 1.06, s * 1.36, s * 0.14]}
              radius={s * 0.16}
              smoothness={6}
            >
              {glassMaterial}
            </RoundedBox>
          </group>
        );
      
      // ======= NAV-SPECIFIC SHAPES =======
      
      // CV: Clean document icon
      case "cv":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <mesh geometry={navCvGeometry} scale={[s * 0.7, s * 0.7, s * 0.55]} renderOrder={10}>
                  {maskMaterial}
                </mesh>
              </Mask>
            ) : null}
            <mesh geometry={navCvGeometry} scale={[s * 0.7, s * 0.7, s * 0.55]}>
              {glassMaterial}
            </mesh>
          </group>
        );
      
      // WORK: simple stacked glass layers (clean + recognisable)
      case "work":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <RoundedBox
                  args={[s * 1.25, s * 0.85, s * 0.06]}
                  radius={s * 0.12}
                  smoothness={6}
                  renderOrder={10}
                >
                  {maskMaterial}
                </RoundedBox>
              </Mask>
            ) : null}
            <RoundedBox
              args={[s * 1.25, s * 0.85, s * 0.06]}
              radius={s * 0.12}
              smoothness={6}
              position={[-s * 0.06, s * 0.04, -s * 0.08]}
            >
              {glassMaterial}
            </RoundedBox>
            <RoundedBox
              args={[s * 1.25, s * 0.85, s * 0.06]}
              radius={s * 0.12}
              smoothness={6}
              position={[0, 0, 0]}
            >
              {glassMaterial}
            </RoundedBox>
            <RoundedBox
              args={[s * 1.25, s * 0.85, s * 0.06]}
              radius={s * 0.12}
              smoothness={6}
              position={[s * 0.06, -s * 0.04, s * 0.08]}
            >
              {glassMaterial}
            </RoundedBox>
          </group>
        );
      
      // EXPERIENCE: Timeline pill icon
      case "experience":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <mesh geometry={navExperienceGeometry} scale={[s * 0.62, s * 0.62, s * 0.55]} renderOrder={10}>
                  {maskMaterial}
                </mesh>
              </Mask>
            ) : null}
            <mesh geometry={navExperienceGeometry} scale={[s * 0.62, s * 0.62, s * 0.55]}>
              {glassMaterial}
            </mesh>
          </group>
        );
      
      // CONTACT: Message bubble icon (reuse greeting bubble)
      case "contact":
        return (
          <group ref={meshRef}>
            {maskId ? (
              <Mask id={maskId}>
                <mesh geometry={bubbleGeometry} scale={[s * 0.74, s * 0.74, s * 0.55]} renderOrder={10}>
                  {maskMaterial}
                </mesh>
              </Mask>
            ) : null}
            <mesh geometry={bubbleGeometry} scale={[s * 0.74, s * 0.74, s * 0.55]}>
              {glassMaterial}
            </mesh>
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
    <group ref={ref} position={position}>
      {/* Mask is drawn early; the glass is drawn late so it can refract masked titles */}
      <group renderOrder={200}>{renderShape()}</group>
    </group>
  );
}
