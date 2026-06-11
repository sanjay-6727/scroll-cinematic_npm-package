# 🚀 Template Setup (5 Minutes)

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages:
- Next.js 16
- React 19
- Framer Motion
- Lenis
- TailwindCSS
- And more...

## Step 2: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the animation in action with Iron Man frames!

## Step 3: Customize Your Content

### Edit Dialogues
File: `src/lib/myProject.ts`

```typescript
export const MY_DIALOGUES: MyDialogue[] = [
  {
    id: "slide1",
    show: 0.05,      // Show at 5% scroll
    hide: 0.25,      // Hide at 25% scroll
    title: "01 — Your Title",
    text: "Your message here",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
  // Add more dialogues...
];
```

### Change Branding
File: `src/components/ui/Navbar.tsx`

Replace "Template" with your brand name.

### Update Colors
File: `src/app/globals.css`

```css
:root {
  --accent: #d4a22f;  /* Change this to your color */
}
```

## Step 4: Replace Frame Sequence (When Ready)

1. Export your video as JPG frames
2. Name them: `frame_0001.jpg`, `frame_0002.jpg`, etc.
3. Place in `/public/frames/`
4. Update `MY_FRAME_COUNT` in `src/lib/myProject.ts`

## Step 5: Build & Deploy

```bash
npm run build
```

Deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod --dir=.next`
- **Any Node host**: Push `.next` folder

---

## 📁 What's Where?

| File/Folder | Purpose |
|---|---|
| `src/lib/myProject.ts` | Animation config (dialogues, frame count) |
| `src/components/sections/MyAnimationSection.tsx` | Main animation component |
| `src/app/globals.css` | Colors and styling |
| `src/components/ui/Navbar.tsx` | Top navigation |
| `public/frames/` | Frame images (ready to use!) |

## 🎯 Next: Customize Everything!

1. ✅ You now have a working website
2. 📝 Edit text content in `myProject.ts`
3. 🎨 Change colors in `globals.css`
4. 🖼️ Replace frames when you have your own
5. 🚀 Deploy!

## ❓ Common Tasks

### Change Animation Timing
Edit `show` and `hide` values (0 = top, 1 = bottom):

```typescript
{
  show: 0.1,   // Appears at 10% scroll
  hide: 0.3,   // Disappears at 30% scroll
}
```

### Adjust Smooth Scroll Feel
File: `src/components/providers/SmoothScrollProvider.tsx`

```typescript
lerp: 0.1,      // Lower = smoother (try 0.05)
duration: 1.2,  // Lower = faster (try 0.8)
```

### Add More Sections
1. Copy `MyAnimationSection.tsx`
2. Rename to `YourSection.tsx`
3. Import in `src/app/page.tsx`
4. Customize

## 🎉 You're Ready!

Start developing:

```bash
npm run dev
```

Happy coding! 🚀
