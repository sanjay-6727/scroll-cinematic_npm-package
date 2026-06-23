<div align="center">

```
 ╔═══════════════════════════════════════════════════════════════╗
 ║                                                               ║
 ║   ░██████╗░█████╗░██████╗░░█████╗░██╗░░░░░██╗               ║
 ║   ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║░░░░░██║               ║
 ║   ╚█████╗░██║░░╚═╝██████╔╝██║░░██║██║░░░░░██║               ║
 ║   ░╚═══██╗██║░░██╗██╔══██╗██║░░██║██║░░░░░██║               ║
 ║   ██████╔╝╚█████╔╝██║░░██║╚█████╔╝███████╗███████╗          ║
 ║   ╚═════╝░░╚════╝░╚═╝░░╚═╝░╚════╝░╚══════╝╚══════╝          ║
 ║                                                               ║
 ║          ── C I N E M A T I C ──  S C R O L L ──            ║
 ║                                                               ║
 ╚═══════════════════════════════════════════════════════════════╝
```

**Scroll-driven frame sequence animation for React & Next.js.**  
*One scroll. 169 frames. Zero compromise.*

<br/>

[![npm version](https://img.shields.io/npm/v/scroll-cinematic?style=flat-square&color=black&labelColor=white&label=npm)](https://npmjs.com/package/scroll-cinematic)
[![bundle size](https://img.shields.io/bundlephobia/minzip/scroll-cinematic?style=flat-square&color=black&labelColor=white&label=size)](https://bundlephobia.com/package/scroll-cinematic)
[![license](https://img.shields.io/npm/l/scroll-cinematic?style=flat-square&color=black&labelColor=white)](./LICENSE)
[![zero deps](https://img.shields.io/badge/dependencies-zero-black?style=flat-square&labelColor=white)](./package.json)

</div>

---

<br/>

## ◈ What Is This

You've seen it on Apple product pages. On Stripe. On those insane award-winning portfolios.

**A video that plays as you scroll.** Not actually a video — a canvas. Rendering a sequence of pre-extracted frames, GPU-accelerated, frame-perfect, synced to your scroll position to the pixel.

`scroll-cinematic` is the library that does this for you in **one component**.

```
  USER SCROLLS DOWN
         │
         ▼
  ┌──────────────────────────────────────────┐
  │  scrollY  ──►  progress (0→1)            │
  │  progress ──►  frameIndex (0→N)          │
  │  frameIndex ──► canvas.drawImage(frame)  │
  │                            ▲             │
  │              GPU-accelerated 2D canvas   │
  └──────────────────────────────────────────┘
         │
         ▼
  60fps. Smooth. Cinematic.
```

<br/>

---

## ◈ Install

```bash
npm install scroll-cinematic
# or
yarn add scroll-cinematic
# or
pnpm add scroll-cinematic
```

> **Peer dependency:** React ≥ 18. That's it. No GSAP. No three.js. No baggage.

<br/>

---

## ◈ 30-Second Start

```tsx
import { ScrollSequence } from "scroll-cinematic";

export default function Hero() {
  return (
    <ScrollSequence
      frames="/frames/frame_%04d.webp"  // → frame_0001.webp, frame_0002.webp ...
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
          text: "Every frame is a decision.",
          author: "You",
          source: "YOUR SITE — 2026",
        },
      ]}
    />
  );
}
```

**That's a full cinematic scroll section.** Sticky canvas, frame preloader, progress bar, overlay text — all from one component.

<br/>

---

## ◈ Architecture

```
  scroll-cinematic/
  │
  ├─ <ScrollSequence />          ← Drop-in component. You probably want this.
  │     │
  │     ├─ useScrollFrames()     ← The engine. Handles everything below.
  │     │     │
  │     │     ├─ Preloader       ← Fetches all N frames in parallel, fires onProgress
  │     │     ├─ IntersectionObs ← Starts/stops RAF only when visible (perf)
  │     │     ├─ ScrollTracker   ← Maps scrollY → progress (0–1)
  │     │     └─ Canvas Renderer ← drawImage() with cover-fit scaling + mobile zoom
  │     │
  │     └─ Overlay Layer         ← Title, subtitle, eyebrow, Dialogue[] timed blocks
  │
  └─ useScrollFrames()           ← Headless hook for custom layouts
```

<br/>

---

## ◈ API

### `<ScrollSequence />`

<br/>

**Required**

| Prop | Type | Description |
|------|------|-------------|
| `frames` | `string \| (i: number) => string` | Frame path template. Supports `%d` `%03d` `%04d`. Or pass a function. |
| `frameCount` | `number` | Total frames in your sequence. |

<br/>

**Layout & Scroll**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `string` | `"300vh"` | Scroll container height. Longer = slower playback. |
| `stickyCanvas` | `boolean` | `true` | Sticky-in-container vs. `position: fixed`. |
| `mobileZoom` | `number` | `1.3` | Scale multiplier on screens ≤ 768px. |

<br/>

**Overlay Text**

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Hero title text. |
| `subtitle` | `string` | Subtitle below the title. |
| `eyebrow` | `string` | Monospace badge above the title. |
| `textFadeEnd` | `number` | Scroll progress at which title fades out. Default: `0.08`. |
| `dialogues` | `Dialogue[]` | Timed subtitle/quote blocks. See below. |

<br/>

**Loading & Progress**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showLoadingProgress` | `boolean` | `true` | Top bar while frames preload. |
| `loadingText` | `string` | `"Loading frames..."` | Text beside the loader. |
| `showProgressBar` | `boolean` | `true` | Bottom section scroll indicator. |

<br/>

**Callbacks & Classes**

| Prop | Type | Description |
|------|------|-------------|
| `onProgress` | `(progress: number, frameIndex: number) => void` | Fires every scroll update. |
| `className` | `string` | Class on the section wrapper. |
| `canvasClassName` | `string` | Class on the `<canvas>` element. |
| `overlayClassName` | `string` | Class on the overlay container. |

<br/>

### `Dialogue` Object

```ts
type Dialogue = {
  id: string;        // Unique key
  show: number;      // Progress value (0–1) to appear
  hide: number;      // Progress value (0–1) to disappear
  title?: string;    // Bold heading
  text: string;      // Body copy
  author?: string;   // Attribution line
  source?: string;   // Source label (monospace style)
};
```

<br/>

### `useScrollFrames(options)` — Headless Hook

For full control. Build your own canvas, your own overlays, your own everything.

```tsx
import { useScrollFrames } from "scroll-cinematic";

function MyCustomSequence() {
  const {
    containerRef,    // → attach to the <section> scroll container
    canvasRef,       // → attach to your <canvas>
    loaded,          // boolean — all frames preloaded
    loadProgress,    // 0–1 preload progress
    scrollProgress,  // 0–1 scroll position
    frameIndex,      // current frame number
  } = useScrollFrames({
    frames: "/frames/frame_%04d.webp",
    frameCount: 169,
    mobileZoom: 1.3,
  });

  return (
    <section ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "sticky", top: 0, width: "100%", height: "100vh" }} />

      {/* Build whatever overlay you want */}
      <div className="my-overlay">
        {Math.round(scrollProgress * 100)}% through
      </div>
    </section>
  );
}
```

<br/>

---

## ◈ Prepare Your Frames

```
  Your video.mp4
       │
       │  Step 1 — extract
       ▼
  ffmpeg -i video.mp4 -vf fps=30/1 frames/frame_%04d.jpg
       │
       │  Step 2 — compress to WebP (cuts size 50–70%)
       ▼
  cwebp frames/*.jpg -folder frames_webp
       │
       │  Step 3 — serve from /public/frames/
       ▼
  frames/
    frame_0001.webp  (~30kb)
    frame_0002.webp  (~30kb)
    ...
    frame_0169.webp  (~30kb)
```

> **Rule of thumb:** 1 frame per ~2px of scroll height.  
> `height="300vh"` at 1080p display = ~3240px = ~162 frames at 30fps.

<br/>

---

## ◈ Performance Notes

```
┌─────────────────────────────────────────────────────────────┐
│  WHAT MAKES IT FAST                                         │
│                                                             │
│  ① Canvas 2D — no DOM mutations on every frame             │
│  ② All frames preloaded into Image() objects in memory     │
│  ③ RAF only runs when section is in viewport               │
│  ④ Cover-fit scaling computed once, not per-frame          │
│  ⑤ WebP frames = 30–50kb each vs 80–150kb JPG             │
└─────────────────────────────────────────────────────────────┘
```

<br/>

---

## ◈ SSR / Next.js

Works out of the box. `useScrollFrames` guards all `window`/`document` access behind mount checks. No `"use client"` footguns. Drop it into any App Router page:

```tsx
// app/page.tsx — works as-is
import { ScrollSequence } from "scroll-cinematic";

export default function Page() {
  return <ScrollSequence frames="..." frameCount={169} />;
}
```

<br/>

---

## ◈ Repo Layout

```
scroll-cinematic/
├── src/
│   ├── ScrollSequence.tsx       ← Main component
│   ├── useScrollFrames.ts       ← Core hook
│   └── preloader.ts             ← Frame preloading logic
├── dist/                        ← Built ESM + CJS output
└── template-cinematic-website/  ← Full demo: Next.js + Tailwind + Framer Motion + Lenis
```

<br/>

**Build & develop:**

```bash
npm run build   # → dist/
npm run dev     # → watch mode
```

<br/>

---

## ◈ License

MIT © 2026

---

<div align="center">

```
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ▓                                               ▓
  ▓   scroll-cinematic  ·  MIT  ·  zero deps      ▓
  ▓   built for the web that deserves better      ▓
  ▓                                               ▓
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

</div>
