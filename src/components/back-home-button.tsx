"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";

// Calculate relative luminance to determine if background is light or dark
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function BackHomeButton() {
  const [isLightBackground, setIsLightBackground] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkBackground = () => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      // Sample multiple points for better accuracy with gradients
      const samplePoints = [
        { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        { x: rect.left + rect.width / 4, y: rect.top + rect.height / 2 },
        { x: rect.left + (rect.width * 3) / 4, y: rect.top + rect.height / 2 },
      ];

      let totalLuminance = 0;
      let sampleCount = 0;

      for (const point of samplePoints) {
        // Get elements at this point
        const elementsBelow = document.elementsFromPoint(point.x, point.y);
        
        // First pass: prioritize images and canvas (actual visual content)
        for (const el of elementsBelow) {
          // Skip the button and its children
          if (el === button || button.contains(el)) continue;
          
          // Check for img elements FIRST (before overlays)
          if (el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0) {
            try {
              const imgRect = el.getBoundingClientRect();
              if (imgRect.top <= point.y && imgRect.bottom >= point.y && 
                  imgRect.left <= point.x && imgRect.right >= point.x) {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = 1;
                tempCanvas.height = 1;
                const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
                if (tempCtx) {
                  const scaleX = el.naturalWidth / imgRect.width;
                  const scaleY = el.naturalHeight / imgRect.height;
                  const imgX = (point.x - imgRect.left) * scaleX;
                  const imgY = (point.y - imgRect.top) * scaleY;
                  
                  tempCtx.drawImage(el, imgX, imgY, 1, 1, 0, 0, 1, 1);
                  const imageData = tempCtx.getImageData(0, 0, 1, 1);
                  const [r, g, b] = imageData.data;
                  const luminance = getLuminance(r, g, b);
                  totalLuminance += luminance;
                  sampleCount++;
                  break; // Found image, use it
                }
              }
            } catch (e) {
              // CORS or other error - continue to next element
              continue;
            }
          }
          
          // Check for canvas elements (like Three.js scenes)
          if (el instanceof HTMLCanvasElement) {
            try {
              const canvasRect = el.getBoundingClientRect();
              if (canvasRect.top <= point.y && canvasRect.bottom >= point.y &&
                  canvasRect.left <= point.x && canvasRect.right >= point.x) {
                const ctx = el.getContext("2d", { willReadFrequently: true });
                if (ctx) {
                  const canvasX = point.x - canvasRect.left;
                  const canvasY = point.y - canvasRect.top;
                  const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                  const [r, g, b] = imageData.data;
                  const luminance = getLuminance(r, g, b);
                  totalLuminance += luminance;
                  sampleCount++;
                  break; // Found canvas, use it
                }
              }
            } catch (e) {
              continue;
            }
          }
        }
        
        // Second pass: check for background colors (if no image/canvas found)
        if (sampleCount === 0 || (sampleCount < samplePoints.length && totalLuminance / sampleCount < 0.3)) {
          for (const el of elementsBelow) {
            // Skip the button and its children
            if (el === button || button.contains(el)) continue;
            
            // Skip images and canvas (already checked)
            if (el instanceof HTMLImageElement || el instanceof HTMLCanvasElement) continue;
            
            const style = window.getComputedStyle(el);
            const bgColor = style.backgroundColor;
            
            // Check for solid background colors
            const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (rgbMatch && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
              const r = parseInt(rgbMatch[1], 10);
              const g = parseInt(rgbMatch[2], 10);
              const b = parseInt(rgbMatch[3], 10);
              const luminance = getLuminance(r, g, b);
              totalLuminance += luminance;
              sampleCount++;
              break; // Found a color for this point, move to next
            }
            
            // Check parent elements for background (up to 5 levels for gradients)
            let parent = el.parentElement;
            let depth = 0;
            while (parent && depth < 5) {
              const parentStyle = window.getComputedStyle(parent);
              const parentBg = parentStyle.backgroundColor;
              const parentMatch = parentBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
              if (parentMatch && parentBg !== "rgba(0, 0, 0, 0)" && parentBg !== "transparent") {
                const r = parseInt(parentMatch[1], 10);
                const g = parseInt(parentMatch[2], 10);
                const b = parseInt(parentMatch[3], 10);
                const luminance = getLuminance(r, g, b);
                totalLuminance += luminance;
                sampleCount++;
                break;
              }
              parent = parent.parentElement;
              depth++;
            }
          }
        }
      }
      
      // Use average luminance from all samples
      if (sampleCount > 0) {
        const avgLuminance = totalLuminance / sampleCount;
        setIsLightBackground(avgLuminance > 0.5);
      } else {
        // Default: assume dark background
        setIsLightBackground(false);
      }
    };

    // Initial check with delays to ensure DOM is ready
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    
    const initialCheck = () => {
      timeout1 = setTimeout(checkBackground, 100);
      timeout2 = setTimeout(checkBackground, 500);
    };
    
    initialCheck();
    
    const handleScroll = () => {
      requestAnimationFrame(checkBackground);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkBackground);
    
    // Check when images load
    const handleImageLoad = () => {
      checkBackground();
    };
    
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.complete) {
        // Image already loaded, check immediately
        setTimeout(checkBackground, 0);
      } else {
        img.addEventListener("load", handleImageLoad, { once: true });
      }
    });
    
    // Use MutationObserver to watch for new images
    const imageObserver = new MutationObserver(() => {
      const newImages = document.querySelectorAll("img");
      newImages.forEach((img) => {
        if (img.complete) {
          setTimeout(checkBackground, 0);
        } else {
          img.addEventListener("load", handleImageLoad, { once: true });
        }
      });
    });
    
    imageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkBackground);
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
      });
      imageObserver.disconnect();
    };
  }, []);

  // Determine text color based on background
  const useLightText = isLightBackground;
  
  const buttonClasses = useLightText
    ? "!text-black/90 hover:!text-black"
    : "text-foreground/60 hover:text-foreground";

  return (
    <Link
      ref={buttonRef}
      href="/"
      className={clsx("inline-flex items-center gap-2 text-sm font-normal tracking-wider transition-colors", buttonClasses)}
    >
      ← Back home
    </Link>
  );
}

