import { useCallback, useEffect, useRef, useState } from "react";
import { preloadFrames } from "../lib/preloadFrames";
import { UseScrollFramesOptions, UseScrollFramesResult } from "../types";

export function useScrollFrames({
  frames,
  frameCount,
  mobileZoom = 1.3,
  onProgress,
}: UseScrollFramesOptions): UseScrollFramesResult {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  // Preload all frames
  useEffect(() => {
    const { promise, cancel } = preloadFrames(
      frames,
      frameCount,
      (progress) => {
        setLoadProgress(progress);
      }
    );

    promise.then((loadedImages) => {
      framesRef.current = loadedImages;
      loadedRef.current = true;
      setLoaded(true);
    });

    return () => {
      cancel();
    };
  }, [frames, frameCount]);

  // Draw specific frame on canvas
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = framesRef.current[index];
      if (!canvas || !img || !img.complete || !img.naturalWidth) return;
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
    [mobileZoom]
  );

  // Setup canvas with proper DPI scaling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    
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

  // Handle window resize
  useEffect(() => {
    resizeCanvas();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [resizeCanvas]);

  // Initial frame draw when loaded
  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  // Main scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const container = containerRef.current;
        if (!container || !loadedRef.current || typeof window === "undefined") return;

        // Calculate scroll progress (0-1)
        const rect = container.getBoundingClientRect();
        const scrollable = container.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        setScrollProgress(progress);

        // Convert progress to frame index
        const index = Math.min(
          frameCount - 1,
          Math.floor(progress * frameCount)
        );

        setFrameIndex(index);

        // Only redraw if frame changed
        if (index !== lastFrameRef.current) {
          lastFrameRef.current = index;
          drawFrame(index);
        }

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
  }, [drawFrame, frameCount, onProgress, loaded]);

  return {
    containerRef,
    canvasRef,
    loaded,
    loadProgress,
    scrollProgress,
    frameIndex,
  };
}
