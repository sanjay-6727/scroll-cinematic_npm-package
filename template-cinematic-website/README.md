# Cinematic Website Template

A production-ready template for creating scroll-driven cinematic frame animation websites.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the template in action.

## What's Included

- ✅ Frame sequence ready to go (from Iron Man project)
- ✅ Scroll-driven animation engine
- ✅ Smooth scrolling with Lenis
- ✅ Responsive design
- ✅ Beautiful UI components
- ✅ Easy to customize

## File Structure

```
template-cinematic-website/
├── public/frames/           # Frame sequence (ready to use!)
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Styling
│   ├── components/
│   │   ├── providers/       # Lenis smooth scroll
│   │   ├── sections/        # Main sections
│   │   └── ui/              # UI components
│   └── lib/
│       └── myProject.ts     # Configuration
```

## Customization Guide

### 1. Update Your Content

Edit `src/lib/myProject.ts`:

```typescript
export const MY_DIALOGUES: MyDialogue[] = [
  {
    id: "slide1",
    show: 0.05,
    hide: 0.25,
    title: "Your Title",
    text: "Your message",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
];
```

### 2. Change Frame Sequence

Replace frames in `/public/frames/`:

1. Export your video as JPGs: `frame_0001.jpg`, `frame_0002.jpg`, etc.
2. Place in `/public/frames/`
3. Update `MY_FRAME_COUNT` in `src/lib/myProject.ts` if different from 169

### 3. Style Your Theme

Edit `src/app/globals.css`:

```css
:root {
  --background: #0a0a0b;      /* Dark background */
  --foreground: #e4e4e7;      /* Light text */
  --accent: #d4a22f;          /* Highlight color */
}
```

### 4. Update Metadata

Edit `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Project Title",
  description: "Your description",
};
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

## Tips

- **Smooth Scroll**: Adjust settings in `src/components/providers/SmoothScrollProvider.tsx`
- **Animation Timing**: Modify `show`/`hide` values in `MY_DIALOGUES`
- **Canvas Zoom**: Change the `1.3` multiplier in `MyAnimationSection.tsx` for mobile
- **Performance**: Use WebP images instead of JPG for smaller file size

## Key Technologies

- **Next.js 16** - React framework
- **Framer Motion** - Animations
- **Lenis** - Smooth scrolling
- **TailwindCSS** - Styling
- **Canvas API** - Frame rendering

## Need Help?

Refer to the documentation files:
- `ANALYSIS_AND_TEMPLATE.md` - How it works
- `TEMPLATE_SETUP_GUIDE.md` - Detailed setup
- `CODE_TEMPLATE.ts` - Code examples

## License

Free to use and modify. Have fun! 🚀
