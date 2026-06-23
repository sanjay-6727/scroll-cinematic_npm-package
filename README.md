<div align="center">

╔═══════════════════════════════════════════════════════════════╗║                                                               ║║       ░██████╗░█████╗░██████╗░░█████╗░██╗░░░░░██╗             ║║       ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║░░░░░██║             ║║       ╚█████╗░██║░░╚═╝██████╔╝██║░░██║██║░░░░░██║             ║║       ░╚═══██╗██║░░██╗██╔══██╗██║░░██║██║░░░░░██║             ║║       ██████╔╝╚█████╔╝██║░░██║╚█████╔╝███████╗███████╗        ║║       ╚═════╝░░╚════╝░╚═╝░░╚═╝░╚════╝░╚══════╝╚══════╝        ║║                                                               ║║          ─── C I N E M A T I C   S C R O L L ───              ║║                                                               ║╚═══════════════════════════════════════════════════════════════╝
### Scroll-driven frame sequence animations for React & Next.js.
*One scroll. 169 frames. Zero compromise.*

<br/>

[![npm version](https://img.shields.io/npm/v/scroll-cinematic?style=flat-square&color=black&labelColor=white&label=npm)](https://npmjs.com/package/scroll-cinematic)
[![bundle size](https://img.shields.io/bundlephobia/minzip/scroll-cinematic?style=flat-square&color=black&labelColor=white&label=size)](https://bundlephobia.com/package/scroll-cinematic)
[![license](https://img.shields.io/npm/l/scroll-cinematic?style=flat-square&color=black&labelColor=white)](./LICENSE)
[![zero deps](https://img.shields.io/badge/dependencies-zero-black?style=flat-square&labelColor=white)](./package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-black?style=flat-square&labelColor=white)](./src)
[![SSR Safe](https://img.shields.io/badge/SSR--safe-ready-black?style=flat-square&labelColor=white)](./src)

<br/>

**[Live Demo](https://scroll-cinematic-demo.vercel.app)** · **[npm Package](https://npmjs.com/package/scroll-cinematic)** · **[Real-World Examples](#-real-world-use-cases)**

</div>

---

## ◈ What Is This?

You've seen it on Apple product launches, Stripe landing pages, and award-winning portfolios: **high-fidelity video sequences that play perfectly in sync with your scrollbar.** Achieving this smoothly using standard HTML5 `<video>` elements is notoriously unreliable due to browser buffering constraints and non-deterministic frame-seeking.

`scroll-cinematic` solves this by orchestrating a high-performance HTML5 2D Canvas pipeline. It preloads pre-extracted video frames directly into memory, rendering them with GPU acceleration frame-by-frame as the user scrolls.

USER SCROLLS DOWN│▼┌──────────────────────────────────────────┐│  scrollY  ──►  progress (0 → 1)          ││  progress ──►  frameIndex (0 → N)        ││  frameIndex ──► canvas.drawImage(frame)  ││                                          ││       ▲ GPU-Accelerated 2D Canvas        │└──────────────────────────────────────────┘│▼60fps. Smooth. Cinematic.
---

## ◈ Why Not Just Use `<video>`?

Video decoding in modern browsers is optimized for linear playback, not random-access scrubbing. Forcing `<video currentTime={scrollY}>` leads to stuttering, visual desynchronization, and high CPU usage. 

| Feature | `scroll-cinematic` | `<video>` Scrubbing | GSAP ScrollTrigger |
| :--- | :---: | :---: | :---: |
| **Frame-Perfect Scroll Sync** | ✅ | ❌ | ⚠️ *Complex Setup* |
| **Instant Reverse Playback** | ✅ | ❌ | ✅ |
| **Deterministic Rendering** | ✅ | ❌ | ✅ |
| **React-Native Server Safe** | ✅ | ❌ | ⚠️ *Client Guard Needed* |
| **Zero Dependencies** | ✅ | ✅ | ❌ *Tethered to Core Library* |
| **Built-in Overlay Blocks** | ✅ | ❌ | ❌ |
| **Single Drop-in Component** | ✅ | ❌ | ❌ |

---

## ◈ Installation

```bash
npm install scroll-cinematic
# or
yarn add scroll-cinematic
# or
pnpm add scroll-cinematic
Requirements: React ≥ 18. No external layout systems, animation frameworks, or heavy bundle baggage required.◈ Quick Start (30 Seconds)TypeScriptimport { ScrollSequence } from "scroll-cinematic";

export default function Hero() {
  return (
    <ScrollSequence
      frames="/frames/frame_%04d.webp"  // Maps to frame_0001.webp, frame_0002.webp, etc.
      frameCount={169}
      height="300vh"
      title="Something Worth Watching"
      subtitle="Scroll to begin"
      dialogues={[
        {
          id: "act-1",
          show: 0.1,
          hide: 0.35,
          title: "01 — The Beginning",
          text: "Every frame is a deliberate architectural decision.",
          author: "Sanjay",
          source: "PROD SYSTEM — 2026",
        },
      ]}
    />
  );
}
◈ Architecture Blueprint scroll-cinematic/
 │
 ├─ <ScrollSequence />       ← Drop-in component containing pre-styled UI layers.
 │   │
 │   ├─ useScrollFrames()    ← Core functional lifecycle engine.
 │   │   │
 │   │   ├─ Preloader        ← Asynchronously fetches N frames into memory array layout.
 │   │   ├─ IntersectionObs  ← Spawns/kills RequestAnimationFrame (RAF) based on visibility.
 │   │   ├─ ScrollTracker    ← Normalizes viewport coordinates to progress delta (0-1).
 │   │   └─ Canvas Renderer  ← Computes static cover-fit aspect configurations.
 │   │
 │   └─ Overlay Layer        ← Manages timed transitions for title text and custom dialogue assets.
 │
 └─ useScrollFrames()        ← Headless hook exposed for custom composition pipelines.
◈ API Reference<ScrollSequence />Required PropsPropTypeDescriptionframesstring | ((i: number) => string)Path template supporting standard format specifiers (%d, %03d, %04d) or a dynamic factory function.frameCountnumberTotal discrete frame items within the target assets directory.Layout & Scroll AdjustmentsPropTypeDefaultDescriptionheightstring"300vh"Total scroll track depth. Higher values lower perceived playback speeds.stickyCanvasbooleantrueWhen true, scopes canvas relative to viewport bounds during scroll container focus.mobileZoomnumber1.3Aspect ratio scaling transform applied on viewports ≤ 768px wide.Cinematic Typography & OverlaysPropTypeDefaultDescriptiontitlestringundefinedHero section primary heading text.subtitlestringundefinedSubheading text displayed immediately below the primary header.eyebrowstringundefinedMonospace system context text presented above the title layer.textFadeEndnumber0.08Scroll progress delta percentage (0–1) where the primary hero text completely opacity-fades.dialoguesDialogue[][]Array of sequenced conversational text panels tracked against scroll progress.Performance & Utility ClassesPropTypeDefaultDescriptionshowLoadingProgressbooleantrueRenders a top-oriented loading progress bar while pre-fetching frames.loadingTextstring"Loading frames..."Status text presented during asset initialization.showProgressBarbooleantrueDisplays a minimal scroll completion bar at the footer level.onProgress(p: number, idx: number) => voidundefinedLifecycle callback executed on every frame paint transition step.Dialogue Type SchemaTypeScripttype Dialogue = {
  id: string;        // Unique node primitive key
  show: number;      // Scroll threshold marker (0–1) to trigger transition-in
  hide: number;      // Scroll threshold marker (0–1) to trigger transition-out
  title?: string;    // Bold descriptive section header
  text: string;      // Body narrative content block
  author?: string;   // Optional author citation signature line
  source?: string;   // Complementary reference identifier rendered in monospace formatting
};
Headless Hook implementation: useScrollFrames()For custom layouts, complex state tracking, or unique UI layering, drop the component and consume the headless core directly:TypeScriptimport { useScrollFrames } from "scroll-cinematic";

function CustomSequenceLayout() {
  const {
    containerRef,    // Attach to parent wrapper section track container
    canvasRef,       // Attach directly to custom target <canvas> element
    loaded,          // Boolean status indicating complete memory asset buffering
    loadProgress,    // Preload calculation percentage scalar value (0–1)
    scrollProgress,  // Active real-time scroll tracking normalized progress (0–1)
    frameIndex,      // Explicit numerical calculation tracking mapped frame array position
  } = useScrollFrames({
    frames: "/frames/frame_%04d.webp",
    frameCount: 169,
    mobileZoom: 1.3,
  });

  return (
    <section ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "sticky", top: 0, width: "100vw", height: "100vh" }} />
      
      <div className="custom-overlay-hud">
        <p>Pipeline Status: {loaded ? "Ready" : `${Math.round(loadProgress * 100)}% Locked`}</p>
        <p>Active Engine Delta: {Math.round(scrollProgress * 100)}%</p>
      </div>
    </section>
  );
}
◈ Preparing Your Asset PipelineTo optimize network delivery and processing, always compress source animations down into individual WebP file tracks. Your video.mp4
       │
       │  Step 1: Extract frames via FFmpeg at target uniform framerates
       ▼
 ffmpeg -i video.mp4 -vf fps=30/1 frames/frame_%04d.jpg
       │
       │  Step 2: Compress sequences into WebP configurations (shaves ~65% off raw size)
       ▼
 cwebp frames/*.jpg -folder frames_webp
       │
       │  Step 3: Move compiled outputs to your project structure public path
       ▼
 public/frames/
   ├── frame_0001.webp  (~30kb)
   ├── frame_0002.webp  (~30kb)
   └── frame_0169.webp  (~30kb)
Calculation Rule of Thumb: Target roughly 1 frame asset per ~2px of configured scroll track depth height container space.A height="300vh" track container running on standard 1080p display environments spans roughly 3240px total vertical scrolling headroom — pairing nicely with a sequence configuration scaling around 160 total animation asset frames.◈ Performance ArchitectureZero-Mutation Core: Calculations write straight down to the immediate HTML5 Canvas 2D frame context interface — bypassing standard layout calculations, tree updates, and style recomputation overheads.Aggressive Lookahead Preloading: Video files are pre-parsed into indexed native in-memory Image() instance allocation arrays before drawing steps trigger.Viewport Isolation: Lifecycle tracking loops isolate state management updates utilizing standard IntersectionObserver targets, systematically unbinding active requestAnimationFrame tracking clocks whenever a scroll section leaves user sight lines.Cached Aspect-Fit Geometry Metrics: Math transform calculations measuring source image sizing vectors relative to viewport scaling constraints are locked during initial startup intervals and layout changes, keeping processing loops safe from frame-rendering overhead.◈ Real-World Use Cases📦 Product Deep-Dives: Break down hardware assemblies, mechanical components, or industrial layers interactively.🚀 High-Conversion Landers: Convert static product marketing copy structures into dynamic, continuous visual loops.🎨 Interactive Case Studies: Retain visitor engagement metrics by matching content reveal cadences directly to physical reading pace variables.◈ LicenseDistributed under the terms of the MIT License. See LICENSE for details. ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 ▓                                               ▓
 ▓   scroll-cinematic · MIT · Zero Dependencies  ▓
 ▓     Built for a web that deserves better.     ▓
 ▓                                               ▓
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
