"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { navigationLinks } from "@/data/navigation";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

const MotionLink = motion(Link);
const MotionSpan = motion.span;

type HeaderProps = {
  overlay?: boolean;
};

// Calculate relative luminance to determine if background is light or dark
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Sample background color at a specific point using canvas
function getBackgroundColorAtPoint(x: number, y: number): { r: number; g: number; b: number } | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  
  try {
    // Create a temporary canvas to capture the pixel
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    // Get all elements at this point
    const elements = document.elementsFromPoint(x, y);
    
    // Find the background element (skip header and its children)
    let bgElement: Element | null = null;
    for (const el of elements) {
      if (el.tagName === "HEADER" || el.closest("header")) continue;
      bgElement = el;
      break;
    }
    
    if (!bgElement) return null;
    
    const computedStyle = window.getComputedStyle(bgElement);
    const bgColor = computedStyle.backgroundColor;
    
    // Parse RGB color from computed style
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10),
      };
    }
    
    // For images or complex backgrounds, try to sample actual pixel
    // This requires rendering to canvas which is complex, so we'll use a fallback
    return null;
  } catch (e) {
    return null;
  }
}

export function Header({ overlay = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isDetailPage = pathname?.startsWith("/work/");

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Detect background color behind header
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkBackground = () => {
      const header = headerRef.current;
      if (!header) return;

      const rect = header.getBoundingClientRect();
      // Sample multiple points for better accuracy with gradients
      const samplePoints = [
        { x: rect.left + rect.width / 2, y: rect.top + rect.height + 10 },
        { x: rect.left + rect.width / 4, y: rect.top + rect.height + 10 },
        { x: rect.left + (rect.width * 3) / 4, y: rect.top + rect.height + 10 },
      ];

      let totalLuminance = 0;
      let sampleCount = 0;

      for (const point of samplePoints) {
        // Get elements at this point
        const elementsBelow = document.elementsFromPoint(point.x, point.y);
        
        // First pass: prioritize images and canvas (actual visual content)
        for (const el of elementsBelow) {
          // Skip header and its children
          if (el.tagName === "HEADER" || el.closest("header")) continue;
          
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
            // Skip header and its children
            if (el.tagName === "HEADER" || el.closest("header")) continue;
            
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
        // Fallback: check if we're over an image at top (usually dark)
        if (overlay && window.scrollY < 100) {
          setIsLightBackground(false);
        } else {
          // Default: assume dark background
          setIsLightBackground(false);
        }
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
  }, [overlay]);

  const positionClasses = overlay ? "fixed inset-x-0 top-0" : "sticky top-0";
  const backgroundClasses = "bg-transparent";

  // Determine text color based on background
  // When background is light, use black text; when dark, use light text
  const useLightText = isLightBackground;
  
  const brandTextClasses = useLightText
    ? "!text-black hover:!text-black"
    : "text-foreground/80 hover:text-foreground";
  const navLinkClasses = useLightText
    ? "!text-black/90 hover:!text-black"
    : "text-foreground/70 hover:text-foreground";
  const mobileButtonClasses = useLightText
    ? "!text-black hover:!text-black"
    : "text-foreground/80 hover:text-foreground";

  return (
    <header 
      ref={headerRef}
      className={clsx("z-30 flex w-full justify-center", positionClasses, backgroundClasses)}
    >
      <div className="pointer-events-auto relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className={clsx("text-sm transition-colors", brandTextClasses)}>
          <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          >
            murashka
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-normal md:flex">
          {navigationLinks.map((link) => {
            const characters = Array.from(link.label);
            const handleClick = (e: React.MouseEvent) => {
              if (link.href.startsWith("#")) {
                e.preventDefault();
                
                // If on detail page, navigate to home first, then scroll
                if (isDetailPage) {
                  router.push(`/${link.href}`);
                  return;
                }
                
                // Otherwise, scroll to section on current page
                const scrollToElement = () => {
                  const element = document.querySelector<HTMLElement>(link.href);
                  if (!element) return;
                  
                  const lenis = getLenis();
                  if (lenis) {
                    // For work section, scroll to show the content (account for sticky positioning)
                    if (link.href === "#work") {
                      // Scroll to the section with a small offset to show content
                      const rect = element.getBoundingClientRect();
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      const targetY = scrollTop + rect.top - 100; // 100px offset from top
                      lenis.scrollTo(targetY, { duration: 1.2 });
                    } else {
                      lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                    }
                  } else {
                    // Fallback to native smooth scroll
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                  window.history.pushState(null, "", link.href);
                };
                
                // Wait a bit to ensure DOM is ready
                setTimeout(scrollToElement, 100);
              }
            };
            
            // Use full path for detail pages, hash for home page
            const linkHref = isDetailPage && link.href.startsWith("#") 
              ? `/${link.href}` 
              : link.href;
            
            return (
              <MotionLink
              key={link.href}
                href={linkHref}
                onClick={handleClick}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
                className={clsx("text-sm transition-colors", navLinkClasses)}
              >
                <MotionSpan
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  className="inline-flex"
                >
                  {characters.map((char, charIndex) => (
                    <MotionSpan
                      key={`${link.href}-${char}-${charIndex}`}
                      variants={{
                        rest: { y: 0, rotate: 0, scale: 1 },
                        hover: {
                          y: -4,
                          rotate: charIndex % 2 === 0 ? 3.5 : -3.5,
                          scale: 1.05,
                          transition: {
                            duration: 0.5,
                            ease: "easeInOut",
                            delay: charIndex * 0.022,
                            repeat: 1,
                            repeatType: "reverse",
                          },
                        },
                      }}
            >
                      {char}
                    </MotionSpan>
                  ))}
                </MotionSpan>
              </MotionLink>
            );
          })}
        </nav>

        <motion.button
          type="button"
          className={clsx(
            "flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-base text-foreground transition-colors hover:border-white/40 hover:text-white md:hidden",
            mobileButtonClasses
          )}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          {menuOpen ? "Close" : "Menu"}
        </motion.button>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              id="mobile-nav"
              key="mobile-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-40 flex min-h-screen flex-col bg-black text-foreground md:hidden"
            >
              <motion.button
                type="button"
                className="absolute right-6 top-6 z-50 rounded-full border border-white/20 px-5 py-3 text-base text-foreground transition-colors hover:border-white/40 hover:text-white"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                Close
              </motion.button>

              <div className="flex h-full flex-col justify-center px-6 py-20">
                {navigationLinks.map((link, index) => {
                  const handleClick = (e: React.MouseEvent) => {
                    setMenuOpen(false);
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      
                      // If on detail page, navigate to home first
                      if (isDetailPage) {
                        router.push(`/${link.href}`);
                        return;
                      }
                      
                      // Otherwise, scroll to section on current page
                      setTimeout(() => {
                        const lenis = getLenis();
                        if (lenis) {
                          const element = document.querySelector<HTMLElement>(link.href);
                          if (element) {
                            lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                            window.history.pushState(null, "", link.href);
                          }
                        } else {
                          // Fallback to native smooth scroll
                          const element = document.querySelector<HTMLElement>(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                            window.history.pushState(null, "", link.href);
                          }
                        }
                      }, 100);
                    }
                  };
                  
                  // Use full path for detail pages, hash for home page
                  const linkHref = isDetailPage && link.href.startsWith("#") 
                    ? `/${link.href}` 
                    : link.href;
                  
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      <Link
                        href={linkHref}
                        onClick={handleClick}
                        className="block py-6"
                      >
                        <motion.span
                          className="block text-[clamp(3.5rem,18vw,8rem)] font-light leading-[0.9] text-foreground transition-colors hover:text-white"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {link.label.charAt(0).toUpperCase() + link.label.slice(1)}
                        </motion.span>
              </Link>
            </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}

