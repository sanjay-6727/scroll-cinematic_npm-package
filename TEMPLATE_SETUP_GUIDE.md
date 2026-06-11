# Cinematic Scroll Animation Template (Blank)

This is a reusable template for creating scroll-driven frame animation websites.

## Quick Start

### 1. Clone or Copy This Template
```bash
cp -r cinematic-template your-new-project
cd your-new-project
npm install
```

### 2. Prepare Your Assets
- Export your video as sequential JPGs (169 frames recommended)
- Place in `/public/frames/` folder
- Example: `frame_0001.jpg`, `frame_0002.jpg`, etc.

### 3. Update Configuration
Edit these files with your content:
- `src/lib/hero.ts` - Frame count, dialogues
- `src/lib/cinematic.ts` - Frame count, beats
- `src/app/layout.tsx` - Title, description
- `src/components/sections/Hero.tsx` - Your custom HTML

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## File-by-File Customization Guide

### `src/lib/hero.ts`
```typescript
// Update FRAME_COUNT to match your frame sequence
export const FRAME_COUNT = 169;

// Update this if your images are named differently
export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

// Customize your dialogue content
export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,      // Show at 10% scroll progress
    hide: 0.3,      // Hide at 30% scroll progress
    quote: "Your first message",
    speaker: "Character Name",
    film: "SOURCE — YEAR",
  },
  // Add more dialogues...
];
```

### `src/lib/cinematic.ts`
```typescript
// Same as hero.ts - update FRAME_COUNT and beats
export const CINE_FRAME_COUNT = 169;

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.1,
    hide: 0.3,
    label: "01 — Act One",
    quote: "Opening line",
    speaker: "Character",
    film: "TITLE — YEAR",
  },
  // Add more beats...
];
```

### `src/app/layout.tsx`
```typescript
export const metadata: Metadata = {
  title: "Your Site Title", // Change this
  description: "Your site description", // Change this
  metadataBase: new URL("http://localhost:3000"),
};
```

### `src/app/page.tsx`
Replace component names and imports with your custom sections:
```typescript
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <YourHeroSection />
        <YourCinematicSection />
        <YourContentSection />
      </main>
      <Footer />
    </>
  );
}
```

### `src/components/sections/Hero.tsx`
Core animation component - **don't modify the scroll logic**, only:
- Update HTML content inside the `<>...</>` blocks
- Change text, badges, quotes
- Adjust styling classes
- The canvas and scroll handler code should stay the same

### `src/components/sections/SystemsNominal.tsx`
Static content section using Framer Motion. Easy to customize:
```typescript
const telemetry = [
  { label: "Your Label", value: "123", note: "Description" },
  // Add more items
];
```

### `src/components/ui/Navbar.tsx`
Update links and branding text.

### `src/app/globals.css`
Contains CSS variables:
```css
:root {
  color-scheme: dark;
  --background: 0 0% 2%;        /* Change colors */
  --foreground: 0 0% 98%;
  --accent: 38 67% 54%;          /* Highlight color */
}
```

## Configuration Checklist

- [ ] Frame sequences in `/public/frames/` and `/public/frames2/`
- [ ] `FRAME_COUNT` matches your frame count
- [ ] Dialogues/beats updated in `src/lib/` files
- [ ] Metadata updated in `layout.tsx`
- [ ] Text content customized
- [ ] Colors adjusted in `globals.css`
- [ ] Navbar branding updated
- [ ] Test on mobile/tablet

## Tips & Tricks

### Adjust Scroll Feel
In `src/components/providers/SmoothScrollProvider.tsx`:
```typescript
const lenis = new Lenis({
  lerp: 0.1,           // 0.05 = smoother, 0.2 = snappier
  duration: 1.2,       // 0.8 = faster, 1.5 = slower
  smoothWheel: true,
  syncTouch: false,
  touchMultiplier: 1.1,
});
```

### Change Animation Timings
Adjust `show` and `hide` values in your dialogue/beat arrays:
```typescript
show: 0.1,  // Appears at 10% scroll
hide: 0.3,  // Disappears at 30% scroll
// Range: 0 (top) to 1 (bottom)
```

### Add More Sections
1. Copy `Hero.tsx` to `YourSection.tsx`
2. Change frame paths if using different frames
3. Import and use in `page.tsx`
4. Configure `src/lib/yourSection.ts` file

### Optimize Images
```bash
# Convert to WebP (smaller file size)
for f in frames/*.jpg; do cwebp "$f" -o "${f%.jpg}.webp"; done

# Update frame path
export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.webp`;
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
```bash
npm run build
# Deploy the `.next` folder as a static site
```

## Performance Baseline

- Load time: ~2-3s (with 169 × 100KB frames)
- First paint: <500ms
- Smooth scroll FPS: 60fps on modern devices
- Mobile: 30-45fps (acceptable)

## Troubleshooting

### Frames don't show
1. Check `/public/frames/` folder exists
2. Verify frame naming: `frame_0001.jpg`, `frame_0002.jpg`, etc.
3. Check FRAME_COUNT value matches actual file count

### Animation is jittery
1. Ensure smooth scroll provider is wrapping app
2. Check browser hardware acceleration is enabled
3. Reduce frame count or use WebP format

### Text doesn't sync with scroll
1. Adjust `show` and `hide` values in dialogue/beat arrays
2. Check progress calculations (0-1 range)
3. Console log progress value to debug

### Mobile looks wrong
1. Check canvas responsive logic in component
2. Test on actual device (emulation may differ)
3. Adjust mobile zoom settings: `drawW *= 1.3` in hero.tsx

## Next Steps

1. Prepare your frame sequence
2. Update configuration files
3. Customize content
4. Test locally
5. Deploy to Vercel or your hosting

Happy creating! 🚀

