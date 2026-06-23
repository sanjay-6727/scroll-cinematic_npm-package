"use client";

import { ScrollSequence } from "scroll-cinematic";
import { MY_DIALOGUES, MY_FRAME_COUNT, MY_TEXT_FADE_END, myFramePath } from "@/lib/myProject";

export function MyAnimationSection() {
  return (
    <ScrollSequence
      frames={myFramePath}
      frameCount={MY_FRAME_COUNT}
      height="300vh"
      dialogues={MY_DIALOGUES}
      textFadeEnd={MY_TEXT_FADE_END}
      title="Cinematic Frame Animation"
      subtitle="Customize this template with your own content. Scroll down to trigger the animation effect."
      eyebrow="SCROLL-DRIVEN ANIMATION // TEMPLATE"
      stickyCanvas={true} // Sticky positioning is cleaner and resolves overlap issues
      showProgressBar={true}
      showLoadingProgress={true}
      loadingText="Loading frames..."
    />
  );
}
