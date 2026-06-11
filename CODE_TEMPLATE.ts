// ============================================================================
// CINEMATIC SCROLL ANIMATION TEMPLATE - Copy & Paste Code Blocks
// ============================================================================
// Use these templates to quickly create your own cinematic scroll websites

// ============================================================================
// FILE: src/lib/myProject.ts
// PURPOSE: Configuration for your animation sequence
// ============================================================================

export const MY_FRAME_COUNT = 169;  // Total frames in your sequence

export const myFramePath = (n: number) =>
  `/my-frames/frame_${String(n).padStart(4, "0")}.jpg`;

export type MyDialogue = {
  id: string;
  show: number;      // 0-1 (0 = top, 1 = bottom)
  hide: number;
  title: string;     // Section label
  text: string;      // Main quote/message
  author: string;    // Speaker name
  source: string;    // Source reference
};

export const MY_DIALOGUES: MyDialogue[] = [
  {
    id: "slide1",
    show: 0.05,
    hide: 0.25,
    title: "01 — Introduction",
    text: "Replace this with your first message",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
  {
    id: "slide2",
    show: 0.3,
    hide: 0.5,
    title: "02 — Development",
    text: "Your second message here",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
  {
    id: "slide3",
    show: 0.55,
    hide: 0.75,
    title: "03 — Conclusion",
    text: "Your closing message",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
];

export const MY_TEXT_FADE_END = 0.08;


// ============================================================================
// FILE: src/components/sections/MyAnimationSection.tsx
// PURPOSE: Scroll-driven frame animation component
// Copy this entire file as a template and customize the HTML content
// ============================================================================

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

  // Load all frame images
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

  // Draw specific frame on canvas
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

    // Mobile zoom adjustment
    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Setup canvas with proper DPI scaling
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

  // Handle window resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Initial frame draw when loaded
  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  // Main scroll handler - THIS IS THE KEY ANIMATION LOGIC
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        // Calculate scroll progress (0-1)
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        // Convert progress to frame index
        const frameIndex = Math.min(
          MY_FRAME_COUNT - 1,
          Math.floor(progress * MY_FRAME_COUNT),
        );

        // Only redraw if frame changed
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        // Update progress bar
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${progress * 100}%`;
        }

        // Content fade effect
        if (contentRef.current) {
          const opacity = Math.max(0, 1 - progress / MY_TEXT_FADE_END);
          contentRef.current.style.opacity = String(opacity);
          contentRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
        }

        // Show/hide dialogues based on scroll progress
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
      className="relative h-[300vh] bg-black text-white"
    >
      {/* Canvas for frame animation */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-screen w-screen"
        style={{ touchAction: "none" }}
      />

      {/* Content overlay */}
      <div className="pointer-events-none fixed inset-0 flex flex-col justify-between p-8">
        {/* Top section - loading progress */}
        {!loaded && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">Loading...</span>
            <div className="h-1 w-64 bg-white/10">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${loadProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Center content */}
        <div ref={contentRef} className="flex flex-col gap-8 transition-all duration-75">
          <div>
            <EyebrowBadge>YOUR PROJECT // SCROLL TO EXPLORE</EyebrowBadge>
          </div>
          <div>
            <h1 className="max-w-2xl text-5xl font-bold leading-tight">
              Replace This With Your Title
            </h1>
            <p className="mt-4 max-w-lg text-xl text-white/70">
              Customize this content. Scroll down to trigger the animation.
            </p>
          </div>
        </div>

        {/* Bottom - dialogues */}
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

      {/* Progress indicator */}
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


// ============================================================================
// FILE: src/app/page.tsx (Example Usage)
// ============================================================================

import { Navbar } from "@/components/ui/Navbar";
import { MyAnimationSection } from "@/components/sections/MyAnimationSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <MyAnimationSection />
        {/* Add more sections below */}
      </main>
      <Footer />
    </>
  );
}


// ============================================================================
// QUICK START CHECKLIST
// ============================================================================

/*
✅ Step 1: Create frames directory
   mkdir -p public/my-frames

✅ Step 2: Add frame images
   Place files: frame_0001.jpg, frame_0002.jpg, etc.

✅ Step 3: Copy src/lib/myProject.ts template above
   Update MY_FRAME_COUNT to match your frame count

✅ Step 4: Copy MyAnimationSection.tsx template
   Customize the HTML content in the component

✅ Step 5: Update page.tsx to use MyAnimationSection

✅ Step 6: Run and test
   npm run dev

✅ Step 7: Customize colors and styling
   Edit globals.css and component classes

✅ Step 8: Deploy!
   npm run build && vercel deploy

CUSTOMIZATION POINTS:
- MY_FRAME_COUNT: Total frames (currently 169)
- myFramePath: Path to frame images
- MY_DIALOGUES: Show/hide timing and text content
- HTML classes: Styling in MyAnimationSection
- Canvas drawing logic: Leave as-is (it works!)
*/

