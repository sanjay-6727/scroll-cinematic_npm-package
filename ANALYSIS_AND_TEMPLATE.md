# Scroll-Driven Cinematic Frame Animation Template - Complete Analysis & Guide

## 📋 Project Analysis: How It Works

### **Core Technology Stack**
- **Framework**: Next.js 16.2 (React 19)
- **Animation Library**: Framer Motion (staggered scroll animations)
- **Smooth Scrolling**: Lenis (physics-based smooth scroll)
- **Styling**: TailwindCSS v4 + PostCSS
- **Canvas Rendering**: HTML5 Canvas API for frame sequencing
- **Icons**: Phosphor Icons

### **How The Animation Effect Works**

#### **1. Scroll-Driven Frame Sequencing (Hero & CinematicReveal Sections)**

The magic lies in a **scroll-percentage-based frame animation** system:

```
User Scrolls → Scroll Progress Calculated → Frame Index Computed → Draw Frame on Canvas
```

**Step-by-step process:**
1. **Image Sequence Loading**: Pre-load 169 frames (JPG images) using JavaScript Image API
2. **Canvas Setup**: Create canvas element matching viewport dimensions with device pixel ratio
3. **Scroll Listener**: On scroll event, calculate progress percentage (0 to 1)
4. **Frame Mapping**: Convert scroll progress to frame index:
   ```
   frameIndex = Math.floor(progress * FRAME_COUNT)
   ```
5. **Canvas Drawing**: Use 2D context to render the frame with aspect-ratio preservation

**Key optimizations:**
- ✅ Request animation frame for smooth 60fps updates
- ✅ Ticking mechanism to prevent redundant calculations
- ✅ Only redraw when frame index changes (not every scroll event)
- ✅ Aspect ratio fitting (cover mode) for responsive display

#### **2. Content Synchronization with Scroll**

Text elements, badges, and UI components fade in/out based on scroll progress:

```javascript
const opacity = Math.max(0, 1 - progress / FADE_END_THRESHOLD);
element.style.opacity = String(opacity);
element.style.transform = `translateY(${(1 - opacity) * 12}px)`;
```

**Three animation tiers:**
- **Hero Section**: Dialogues fade based on progress (show: 0.1-0.3, hide: 0.3-0.55, etc.)
- **Cinematic Section**: Beats (narrative moments) appear/disappear at specific progress ranges
- **Systems Section**: Staggered Framer Motion animations triggered on viewport intersection

#### **3. Smooth Scroll Provider (Lenis)**

Wraps entire app to provide physics-based smooth scrolling:
```javascript
const lenis = new Lenis({
  lerp: 0.1,           // Lower = smoother
  duration: 1.2,       // Total duration
  smoothWheel: true,   // Mouse wheel smoothing
  touchMultiplier: 1.1 // Touch sensitivity
});
```

#### **4. Framer Motion Staggered Animations**

Used for non-scroll-driven sections:
- Container reveals items sequentially with 0.1s stagger
- Each item: fade in + slide up with spring physics
- Triggered on viewport intersection (once per page load)

---

## 🎯 Key Components Breakdown

### **Hero.tsx** (Scroll-driven)
- Loads 169 frame sequence from `/public/frames/`
- Maps scroll progress to frame display
- Shows/hides dialogue quotes at specific progress points
- Includes loading progress bar

### **CinematicReveal.tsx** (Scroll-driven)
- Loads 169 frame sequence from `/public/frames2/`
- Defines "beats" (narrative moments) with timestamps
- Animates text reveals synchronized to scroll
- Similar architecture to Hero but with different content

### **SystemsNominal.tsx** (Framer Motion)
- Static section with telemetry readouts
- Uses AnimatedSection/AnimatedItem for staggered entrance
- Displays specs/stats in futuristic UI grid

### **SmoothScrollProvider.tsx**
- Wraps app with Lenis for physics-based scrolling
- Manages RAF (request animation frame) loop
- Cleans up resources on unmount

### **AnimatedSection.tsx**
- Reusable wrapper for Framer Motion animations
- Container variant with staggered children
- Triggered on viewport intersection

---

## 📦 File Structure Pattern

```
your-project/
├── public/
│   ├── frames/          # Hero sequence (169 JPGs)
│   └── frames2/         # Cinematic sequence (169 JPGs)
├── src/
│   ├── app/
│   │   ├── layout.tsx   # Root layout + Lenis provider
│   │   ├── globals.css  # TailwindCSS config
│   │   └── page.tsx     # Main page composition
│   ├── components/
│   │   ├── providers/
│   │   │   └── SmoothScrollProvider.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── CinematicReveal.tsx
│   │   │   ├── SystemsNominal.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── Navbar.tsx
│   │       ├── AnimatedSection.tsx
│   │       ├── HudFrame.tsx          # SVG corner decoration
│   │       └── EyebrowBadge.tsx
│   └── lib/
│       ├── hero.ts                  # Hero config (frames, dialogues)
│       └── cinematic.ts             # Cinematic config (frames, beats)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

---

## 🚀 Creating Your Own Version

### **Step 1: Set Up Project**
```bash
npm create next-app@latest my-cinematic-website -- --typescript
cd my-cinematic-website
npm install framer-motion lenis @phosphor-icons/react
```

### **Step 2: Prepare Your Frame Sequences**
- Create two video clips (or export frames from video editing software)
- Export as sequential JPGs: `frame_0001.jpg`, `frame_0002.jpg`, etc.
- Place in `/public/frames/` and `/public/frames2/`
- Recommended: 169 frames per sequence at 30fps = 5.6 second sequence

### **Step 3: Configure Frame Count & Paths**
Edit `src/lib/hero.ts` and `src/lib/cinematic.ts`:
```typescript
export const FRAME_COUNT = 169;  // Change based on your frames
export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;
```

### **Step 4: Customize Content**
Update dialogues/beats and text content:
```typescript
export const DIALOGUES = [
  {
    id: "d1",
    show: 0.1,    // Appear at 10% scroll
    hide: 0.3,    // Disappear at 30% scroll
    quote: "Your quote here",
    speaker: "Name",
    film: "SOURCE — YEAR",
  },
];
```

### **Step 5: Style Your Theme**
- Edit `globals.css` for color scheme
- Update TailwindCSS variables in theme config
- Modify component classes for your branding

---

## ⚡ Performance Tips

| Optimization | Impact | Implementation |
|---|---|---|
| **Image Compression** | ⬇️ Load time | Use WebP format, compress to ~30-50KB per frame |
| **Lazy Loading Frames** | ⬇️ Initial load | Load frames as user scrolls (advanced) |
| **Canvas Device Pixel Ratio** | ⬆️ Quality | Already implemented: `canvas.width = window.innerWidth * dpr` |
| **Throttled Scroll Events** | ⬆️ FPS | Already implemented: ticking mechanism |
| **Image Preloading** | ⬇️ Jank | Images load on mount, not on scroll |
| **Hardware Acceleration** | ⬆️ Rendering | CSS `will-change` on animated elements |

---

## 🎨 Customization Checklist

- [ ] Replace frame sequences with your own video exports
- [ ] Update dialogue/beat text content
- [ ] Change color scheme (accent, background colors)
- [ ] Modify progress thresholds (show/hide values)
- [ ] Adjust smooth scroll settings (lerp, duration)
- [ ] Add/remove sections as needed
- [ ] Update metadata (title, description)
- [ ] Replace navbar branding
- [ ] Adjust canvas zoom for mobile (currently `1.3x`)
- [ ] Test on different devices (mobile, tablet, desktop)

---

## 🔧 Advanced Modifications

### **Add Multiple Scenes**
Duplicate Hero.tsx component with different frame paths and update page.tsx.

### **Dynamic Content Sync**
Add text/UI that changes at specific scroll percentages using the same progress calculation.

### **Interactive Overlay**
Add click handlers or scroll-to features that jump to specific progress points.

### **Export as Video**
Combine frames back into video with final scroll animations baked in.

### **SSR Optimization**
The canvas setup happens client-side only; consider prefetching images on hover for better UX.

---

## 📊 Data Flow Diagram

```
Scroll Event
    ↓
Calculate Progress (0-1)
    ↓
Compute Frame Index
    ↓
Is Frame Different?
    ├─ Yes → Draw Frame on Canvas
    └─ No → Skip (no redraw)
    ↓
Update Text Opacity/Position
    ↓
RequestAnimationFrame Loop
```

---

## 💡 Key Takeaways

1. **Frame-by-frame animations** scale scroll progress (0-1) to frame index
2. **Canvas rendering** provides hardware-accelerated, responsive display
3. **Lenis smoothing** creates premium feel for scroll interactions
4. **Framer Motion** handles traditional staggered entrance animations
5. **Modular structure** makes it easy to swap content while keeping animation engine
6. **Responsive design** handled via CSS and canvas aspect ratio fitting

---

## 🆘 Common Issues & Fixes

| Issue | Cause | Fix |
|---|---|---|
| Frames don't load | Wrong frame count or path | Check FRAME_COUNT value and `/public/frames/` folder |
| Jittery animation | Scroll event firing too often | Verify ticking mechanism is working |
| Canvas blurry | Device pixel ratio not set | Check `canvas.width = window.innerWidth * dpr` |
| Slow on mobile | Too many simultaneous calculations | Reduce frame count or use WebP |
| Text doesn't sync | Wrong show/hide thresholds | Adjust show/hide values in config |

---

## 📝 Next Steps

1. Export your video as sequential frames
2. Update frame count and paths in `hero.ts` and `cinematic.ts`
3. Customize dialogues/beats with your content
4. Adjust Lenis settings for your scroll feel preference
5. Test on different devices and browsers
6. Deploy! 🚀

