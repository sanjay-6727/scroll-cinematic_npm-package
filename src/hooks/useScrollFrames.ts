import { useCallback, useEffect, useRef, useState } from "react";
import { preloadFrames } from "../lib/preloadFrames";
import { UseScrollFramesOptions, UseScrollFramesResult } from "../types";

export function useScrollFrames({
  frames,
  frameCount,
  mobileZoom = 1.3,
  easingSpeed = 0.15,
  onProgress,
}: UseScrollFramesOptions): UseScrollFramesResult {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const containerOffsetTopRef = useRef(0);
  const containerHeightRef = useRef(0);

  // Easing & Animation loop refs
  const targetIndexRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  // Helper: check if a specific frame image is loaded and ready to draw
  const isFrameReady = useCallback((index: number) => {
    const img = framesRef.current[index];
    return !!(img && img.complete && img.naturalWidth > 0);
  }, []);

  // Helper: find the nearest ready frame to draw as fallback
  const getNearestReadyFrameIndex = useCallback((targetIndex: number) => {
    if (isFrameReady(targetIndex)) return targetIndex;

    let left = targetIndex - 1;
    let right = targetIndex + 1;

    while (left >= 0 || right < frameCount) {
      if (left >= 0 && isFrameReady(left)) return left;
      if (right < frameCount && isFrameReady(right)) return right;
      left--;
      right++;
    }

    return 0; // Fallback to first frame if none are loaded
  }, [frameCount, isFrameReady]);

  // 1. Draw specific frame on canvas
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const readyIndex = getNearestReadyFrameIndex(index);
      const img = framesRef.current[readyIndex];
      if (!img || !img.complete || !img.naturalWidth) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let drawW: number;
      let drawH: number;
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }

      // Mobile zoom adjustment
      if (typeof window !== "undefined" && window.innerWidth <= 768) {
        drawW *= mobileZoom;
        drawH *= mobileZoom;
      }

      const drawX = (cw - drawW) / 2;
      const drawY = (ch - drawH) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    },
    [mobileZoom, getNearestReadyFrameIndex]
  );

  // 2. Setup canvas with proper DPI scaling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    // Cache container geometry to avoid forced layout reflows on scroll ticks
    if (container) {
      let top = 0;
      let el: HTMLElement | null = container;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      containerOffsetTopRef.current = top;
      containerHeightRef.current = container.offsetHeight;
    }

    // Limit DPR to 2.0 to avoid giant VRAM allocations on 4K/high-density screens
    const rawDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const dpr = Math.min(2, rawDpr);
    
    // Default to viewport dimensions or parent element if available
    const width = typeof window !== "undefined" ? window.innerWidth : 800;
    const height = typeof window !== "undefined" ? window.innerHeight : 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(1, 1);
    
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  // 3. Self-managing requestAnimationFrame loop to animate frame transitions smoothly
  const startAnimationLoop = useCallback(() => {
    if (animationFrameIdRef.current !== null) return; // already active

    const animate = () => {
      const target = targetIndexRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      // Snap to target and exit loop if difference is negligible
      if (Math.abs(diff) < 0.1) {
        currentFrameRef.current = target;
        const finalIndex = Math.round(target);

        if (finalIndex !== lastFrameRef.current) {
          lastFrameRef.current = finalIndex;
          drawFrame(finalIndex);
          setFrameIndex(finalIndex);
        }

        animationFrameIdRef.current = null;
        return;
      }

      currentFrameRef.current = current + diff * easingSpeed;
      const nextIndex = Math.round(currentFrameRef.current);

      if (nextIndex !== lastFrameRef.current) {
        lastFrameRef.current = nextIndex;
        drawFrame(nextIndex);
        setFrameIndex(nextIndex);
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [drawFrame, easingSpeed]);

  // 4. Preload all frames progressively
  useEffect(() => {
    const { promise, cancel } = preloadFrames(
      frames,
      frameCount,
      (info) => {
        setLoadProgress(info.progress);
      },
      (loadedKeyframes) => {
        // Phase 1 complete: keyframes ready!
        // Immediately expose canvas and allow interaction
        framesRef.current = loadedKeyframes;
        loadedRef.current = true;
        setLoaded(true);
        resizeCanvas();
      },
      4 // Load every 4th frame in Phase 1
    );

    promise.then((loadedImages) => {
      // Phase 2 complete: all detail frames fully loaded!
      framesRef.current = loadedImages;
      loadedRef.current = true;
      setLoaded(true);
      // Redraw current frame to update to high detail version
      drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
    });

    return () => {
      cancel();
    };
  }, [frames, frameCount, resizeCanvas, drawFrame]);

  // 5. Clean up animation frame loop on unmount
  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // 6. Handle window resize
  useEffect(() => {
    resizeCanvas();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [resizeCanvas]);

  // 7. Initial frame draw when loaded
  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  // 8. Main scroll handler
  useEffect(() => {
    // Initial caching on mount
    resizeCanvas();

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const container = containerRef.current;
        if (!container || !loadedRef.current || typeof window === "undefined") return;

        // Calculate scroll progress (0-1) using cached coordinates to avoid layout reflows
        const scrollY = window.scrollY;
        const containerOffsetTop = containerOffsetTopRef.current;
        const containerHeight = containerHeightRef.current;
        const viewportHeight = window.innerHeight;

        const scrollable = containerHeight - viewportHeight;
        const relativeScroll = scrollY - containerOffsetTop;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, relativeScroll / scrollable));

        setScrollProgress(progress);

        // Convert progress to target frame index
        const index = Math.min(
          frameCount - 1,
          Math.floor(progress * frameCount)
        );

        targetIndexRef.current = index;

        // Kick off the easing animation loop
        startAnimationLoop();

        if (onProgress) {
          onProgress(progress, index);
        }
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      // Run once initially
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [drawFrame, frameCount, onProgress, loaded, resizeCanvas, startAnimationLoop]);

  return {
    containerRef,
    canvasRef,
    loaded,
    loadProgress,
    scrollProgress,
    frameIndex,
  };
}
