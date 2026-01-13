"use client";

import { useEffect, useRef } from "react";

export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(any-pointer: fine)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let visible = false;

    const setVisible = (next: boolean) => {
      visible = next;
      dot.style.opacity = next ? "1" : "0";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onWindowBlur = () => setVisible(false);

    const loop = () => {
      const lerp = prefersReducedMotion ? 1 : 0.22;
      x = x + (targetX - x) * lerp;
      y = y + (targetY - y) * lerp;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = window.requestAnimationFrame(loop);
    };

    // Start hidden until the first real mouse movement.
    dot.style.opacity = "0";
    raf = window.requestAnimationFrame(loop);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onWindowBlur);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}


