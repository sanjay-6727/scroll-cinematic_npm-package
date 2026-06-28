import { RefObject } from "react";

export interface Dialogue {
  id: string;
  show: number;      // Scroll progress (0 to 1) when dialogue should appear
  hide: number;      // Scroll progress (0 to 1) when dialogue should disappear
  title?: string;    // Dialogue title
  text: string;      // Dialogue main text content
  author?: string;   // Speaker or author name
  source?: string;   // Source or project citation
}

export interface UseScrollFramesOptions {
  frames: string | ((index: number) => string);
  frameCount: number;
  mobileZoom?: number;
  easingSpeed?: number; // Easing factor between 0 and 1 (1 = no easing). Default: 0.15
  onProgress?: (progress: number, frameIndex: number) => void;
}

export interface UseScrollFramesResult {
  containerRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  loaded: boolean;
  loadProgress: number;
  scrollProgress: number;
  frameIndex: number;
}
