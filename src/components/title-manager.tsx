"use client";

import { useEffect, useRef } from "react";

const INACTIVE_TITLE = "hey, come back ;)";
const INACTIVE_DELAY = 5000; // 5 seconds

export function TitleManager() {
  const originalTitleRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Store the original title
    originalTitleRef.current = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is now hidden, start timer
        timeoutRef.current = setTimeout(() => {
          document.title = INACTIVE_TITLE;
        }, INACTIVE_DELAY);
      } else {
        // Tab is now visible, restore original title
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        document.title = originalTitleRef.current;
      }
    };

    const handleBlur = () => {
      // Window lost focus, start timer
      timeoutRef.current = setTimeout(() => {
        document.title = INACTIVE_TITLE;
      }, INACTIVE_DELAY);
    };

    const handleFocus = () => {
      // Window gained focus, restore original title
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      document.title = originalTitleRef.current;
    };

    // Listen to visibility change (tab switching)
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Also listen to window blur/focus as fallback
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      // Cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      
      // Restore original title on unmount
      document.title = originalTitleRef.current;
    };
  }, []);

  return null;
}

