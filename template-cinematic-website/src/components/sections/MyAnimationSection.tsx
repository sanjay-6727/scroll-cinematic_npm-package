"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { MY_DIALOGUES, MY_FRAME_COUNT, MY_TEXT_FADE_END, myFramePath } from "@/lib/myProject";

export function MyAnimationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleDialogues, setVisibleDialogues] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= MY_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = myFramePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / MY_FRAME_COUNT);
        if (loadedCount === MY_FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / MY_FRAME_COUNT);
        if (loadedCount === MY_FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
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

    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(1, 1);
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        const frameIndex = Math.min(
          MY_FRAME_COUNT - 1,
          Math.floor(progress * MY_FRAME_COUNT),
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${progress * 100}%`;
        }

        if (contentRef.current) {
          const opacity = Math.max(0, 1 - progress / MY_TEXT_FADE_END);
          contentRef.current.style.opacity = String(opacity);
          contentRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
        }

        const newVisibleDialogues = new Set<string>();
        MY_DIALOGUES.forEach((dialogue) => {
          if (progress >= dialogue.show && progress <= dialogue.hide) {
            newVisibleDialogues.add(dialogue.id);
          }
        });
        setVisibleDialogues(newVisibleDialogues);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  return (
    <section
      ref={sectionRef}
      className="scroll-animation relative bg-black text-white"
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-screen w-screen"
        style={{ touchAction: "none" }}
      />

      <div className="pointer-events-none fixed inset-0 flex flex-col justify-between p-8">
        {!loaded && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">Loading frames...</span>
            <div className="h-1 w-64 bg-white/10">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${loadProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        <div ref={contentRef} className="flex flex-col gap-8 transition-all duration-75">
          <div>
            <EyebrowBadge>SCROLL-DRIVEN ANIMATION // TEMPLATE</EyebrowBadge>
          </div>
          <div>
            <h1 className="max-w-2xl text-5xl font-bold leading-tight">
              Cinematic Frame Animation
            </h1>
            <p className="mt-4 max-w-lg text-xl text-white/70">
              Customize this template with your own content. Scroll down to trigger the animation effect.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {MY_DIALOGUES.map((dialogue) => (
            <div
              key={dialogue.id}
              className={`transition-opacity duration-300 ${
                visibleDialogues.has(dialogue.id)
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <div className="border-l-2 border-white/30 pl-4 py-2">
                <div className="text-xs font-mono uppercase text-white/50">
                  {dialogue.title}
                </div>
                <p className="mt-2 max-w-xl text-lg italic text-white/80">
                  "{dialogue.text}"
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>{dialogue.author}</span>
                  <span>{dialogue.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 h-1 w-full bg-white/10">
        <div
          ref={progressFillRef}
          className="h-full bg-white transition-all duration-75"
          style={{ width: "0%" }}
        />
      </div>
    </section>
  );
}
