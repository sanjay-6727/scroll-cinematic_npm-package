"use client";

import { ScrollSequence } from "@/scroll-cinematic";
import { MY_DIALOGUES, MY_FRAME_COUNT, MY_TEXT_FADE_END, myFramePath } from "@/lib/myProject";

export function MyAnimationSection() {
  return (
    <div className="relative w-full">
      <ScrollSequence
        frames={myFramePath}
        frameCount={MY_FRAME_COUNT}
        height="300vh"
        dialogues={MY_DIALOGUES}
        textFadeEnd={MY_TEXT_FADE_END}
        title="Cinematic Scroll Experience"
        subtitle="Smooth, hardware-accelerated scroll sequence animations for Next.js. Scroll down to interact."
        eyebrow="SCROLL-CINEMATIC // DEMO"
        stickyCanvas={true}
        showProgressBar={true}
        showLoadingProgress={true}
        loadingText="Caching WebP sequence..."
      />
    </div>
  );
}
