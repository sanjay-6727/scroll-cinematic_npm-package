export const MY_FRAME_COUNT = 192;

export const myFramePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.webp`;

export type MyDialogue = {
  id: string;
  show: number;
  hide: number;
  title: string;
  text: string;
  author: string;
  source: string;
};

export const MY_DIALOGUES: MyDialogue[] = [
  {
    id: "slide1",
    show: 0.05,
    hide: 0.25,
    title: "01 — Welcome",
    text: "Edit this text! Replace with your own message. Scroll to see the animation.",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
  {
    id: "slide2",
    show: 0.3,
    hide: 0.5,
    title: "02 — Customize",
    text: "Change the frame sequence, dialogues, colors, and content to match your brand.",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
  {
    id: "slide3",
    show: 0.55,
    hide: 0.75,
    title: "03 — Deploy",
    text: "Run npm run build and deploy to Vercel, Netlify, or your hosting platform.",
    author: "Your Name",
    source: "YOUR PROJECT — 2026",
  },
];

export const MY_TEXT_FADE_END = 0.08;
